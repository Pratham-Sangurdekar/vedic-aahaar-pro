import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, MessageCircle, Paperclip, Download, FileText, Image, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/utils/translations';

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sender_type: 'patient' | 'doctor';
  receiver_type: 'patient' | 'doctor';
  is_read: boolean;
  read_at?: string;
  attachment_url?: string;
  attachment_type?: string;
  created_at: string;
}

interface Chat {
  id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
  last_message_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  email: string;
  type: 'patient' | 'doctor';
  profile_pic_url?: string;
  specialization?: string;
  experience_years?: number;
}

interface EnhancedChatInterfaceProps {
  recipientId?: string;
  recipientType?: 'patient' | 'doctor';
  recipientName?: string;
  chatId?: string;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  recipientId,
  recipientType,
  recipientName,
  chatId: initialChatId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const [recipientInfo, setRecipientInfo] = useState<ChatUser | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userType = user?.email?.includes('@doctor.') ? 'doctor' : 'patient';
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recipientId && user?.id) {
      initializeChat();
    }
  }, [recipientId, user?.id]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      setupRealtimeSubscription();
      markMessagesAsRead();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    if (!recipientId || !user?.id) return;

    try {
      // Fetch recipient info
      await fetchRecipientInfo();

      // Check if chat exists or create new one
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .or(`and(patient_id.eq.${user.id},doctor_id.eq.${recipientId}),and(patient_id.eq.${recipientId},doctor_id.eq.${user.id})`)
        .single();

      if (chatError && chatError.code !== 'PGRST116') {
        throw chatError;
      }

      if (existingChat) {
        setChatId(existingChat.id);
      } else {
        // Create new chat (only patients can initiate)
        if (userType === 'patient') {
          const { data: newChat, error: newChatError } = await supabase
            .from('chats')
            .insert({
              patient_id: user.id,
              doctor_id: recipientId,
            })
            .select()
            .single();

          if (newChatError) throw newChatError;
          setChatId(newChat.id);
        }
      }
    } catch (error: any) {
      console.error('Error initializing chat:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchRecipientInfo = async () => {
    if (!recipientId) return;

    try {
      const table = recipientType === 'doctor' ? 'doctors' : 'patients';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', recipientId)
        .single();

      if (error) throw error;

      setRecipientInfo({
        id: data.id,
        name: data.name,
        email: data.email,
        type: recipientType!,
        profile_pic_url: data.profile_pic_url,
        specialization: recipientType === 'doctor' ? (data as any).specialization : undefined,
        experience_years: recipientType === 'doctor' ? (data as any).experience_years : undefined,
      });
    } catch (error: any) {
      console.error('Error fetching recipient info:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Show notification if message is from someone else
          if (newMessage.sender_id !== user?.id) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const typingUserIds = new Set<string>();
        
        Object.values(newState).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.typing && presence.user_id !== user?.id) {
              typingUserIds.add(presence.user_id);
            }
          });
        });
        
        setTypingUsers(typingUserIds);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as ChatMessage[]) || []);
      
      // Count unread messages
      const unread = (data || []).filter(msg => 
        msg.receiver_id === user?.id && !msg.read_at
      ).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const markMessagesAsRead = async () => {
    if (!chatId || !user?.id) return;

    try {
      await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      setUnreadCount(0);
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user?.id) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          receiver_id: recipientId!,
          message: newMessage.trim(),
          sender_type: userType,
          receiver_type: recipientType || 'doctor',
        });

      if (error) throw error;

      setNewMessage('');
      
      // Update chat's last_message_at
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);

      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId!,
          user_type: recipientType || 'doctor',
          title: 'New Message',
          message: `You have a new message from ${user.email}`,
          type: 'message',
        });

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (!chatId) return;

    const channel = supabase.channel(`chat-${chatId}`);
    channel.track({
      user_id: user?.id,
      typing,
      timestamp: Date.now(),
    });

    if (typing) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        channel.track({
          user_id: user?.id,
          typing: false,
          timestamp: Date.now(),
        });
      }, 3000);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !chatId) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${chatId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      // Send message with attachment
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user?.id!,
          receiver_id: recipientId!,
          message: `Shared a file: ${file.name}`,
          sender_type: userType,
          receiver_type: recipientType || 'doctor',
          attachment_url: publicUrl,
          attachment_type: file.type,
        });

      if (messageError) throw messageError;

      toast({
        title: 'File uploaded',
        description: 'File has been shared successfully',
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadAttachment = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the file',
        variant: 'destructive',
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!recipientId) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t('selectChatRecipient', language)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipientInfo?.profile_pic_url} />
              <AvatarFallback>
                {recipientName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{recipientName}</CardTitle>
              {recipientInfo?.specialization && (
                <p className="text-sm text-muted-foreground">
                  {recipientInfo.specialization} • {recipientInfo.experience_years} years
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            
            return (
              <div
                key={message.id}
                className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recipientInfo?.profile_pic_url} />
                    <AvatarFallback className="text-xs">
                      {recipientName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  
                  {/* Attachment */}
                  {message.attachment_url && (
                    <div className="mt-2 p-2 bg-background/20 rounded flex items-center gap-2">
                      {message.attachment_type?.startsWith('image/') ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="text-xs flex-1">Attachment</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadAttachment(
                          message.attachment_url!,
                          `attachment-${message.id}`
                        )}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {isOwnMessage && message.read_at && (
                      <span className="text-xs text-primary-foreground/70">✓</span>
                    )}
                  </div>
                </div>
                
                {isOwnMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user?.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          
          {/* Typing indicator */}
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
              <span>{recipientName} is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (e.target.value && !isTyping) {
                handleTyping(true);
              } else if (!e.target.value && isTyping) {
                handleTyping(false);
              }
            }}
            placeholder={t('typeMessage', language)}
            disabled={loading}
            className="flex-1"
          />
          
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;