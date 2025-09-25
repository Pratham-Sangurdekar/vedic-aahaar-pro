import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/utils/translations';

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sender_type: 'patient' | 'doctor';
  receiver_type: 'patient' | 'doctor';
  is_read: boolean;
  created_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  type: 'patient' | 'doctor';
}

interface ChatInterfaceProps {
  recipientId?: string;
  recipientType?: 'patient' | 'doctor';
  recipientName?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  recipientId,
  recipientType,
  recipientName
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userType = user?.email?.includes('@doctor.') ? 'doctor' : 'patient';

  useEffect(() => {
    if (recipientId) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `or(and(sender_id.eq.${user?.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user?.id}))`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [recipientId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!recipientId || !user?.id) return;

    try {
      // Use proper UUID validation to avoid invalid syntax errors
      const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
      };

      if (!isValidUUID(recipientId) || !isValidUUID(user.id)) {
        console.error('Invalid UUID format');
        return;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientId || !user?.id) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          message: newMessage.trim(),
          sender_type: userType,
          receiver_type: recipientType || 'doctor',
        });

      if (error) throw error;

      setNewMessage('');
      
      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
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
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('chat', language)} - {recipientName}
        </CardTitle>
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
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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

export default ChatInterface;