import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Search, Users, Stethoscope } from 'lucide-react';
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

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience_years: number;
  degree: string;
  institution: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
}

interface Chat {
  id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
  last_message_at: string | null;
  doctor: Doctor;
  patient: Patient;
}

const EnhancedChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userType = user?.email?.includes('@doctor.') ? 'doctor' : 'patient';
  
  console.log('User type detected:', userType, 'for email:', user?.email);

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      
      // Set up real-time subscription for messages
      const otherParticipantId = userType === 'patient' 
        ? selectedChat.doctor_id 
        : selectedChat.patient_id;

      const channel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `or(and(sender_id.eq.${user?.id},receiver_id.eq.${otherParticipantId}),and(sender_id.eq.${otherParticipantId},receiver_id.eq.${user?.id}))`
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
  }, [selectedChat, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...');
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }
      
      console.log('Doctors fetched:', data);
      setDoctors(data || []);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchChats = async () => {
    if (!user?.id) return;

    try {
      // For patients, show chats where they are the patient
      // For doctors, show chats where they are the doctor
      const filter = userType === 'patient' 
        ? `patient_id.eq.${user.id}` 
        : `doctor_id.eq.${user.id}`;

      console.log('Fetching chats for user:', user.id, 'userType:', userType, 'filter:', filter);

      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq(userType === 'patient' ? 'patient_id' : 'doctor_id', user.id)
        .order('last_message_at', { ascending: false });

      if (chatsError) throw chatsError;
      
      console.log('Raw chats data:', chatsData);

      // Fetch doctor and patient data separately
      const chatPromises = (chatsData || []).map(async (chat) => {
        const [doctorResult, patientResult] = await Promise.all([
          supabase.from('doctors').select('*').eq('id', chat.doctor_id).single(),
          supabase.from('patients').select('*').eq('id', chat.patient_id).single()
        ]);

        return {
          ...chat,
          doctor: doctorResult.data,
          patient: patientResult.data
        };
      });

      let chatsWithData = await Promise.all(chatPromises);

      // If doctor has no chats yet, derive from chat_messages so incoming messages still show up
      if (userType === 'doctor' && chatsWithData.length === 0) {
        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id})`)
          .order('created_at', { ascending: false });

        const patientIds = Array.from(new Set((msgs || [])
          .map(m => (m.sender_id === user.id ? m.receiver_id : m.sender_id))));

        const derivedPromises = patientIds.map(async (pid) => {
          const [{ data: patient }, { data: lastMsg }] = await Promise.all([
            supabase.from('patients').select('*').eq('id', pid).single(),
            supabase.from('chat_messages')
              .select('*')
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${pid}),and(sender_id.eq.${pid},receiver_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1)
              .single()
          ]);

          return {
            id: `derived-${pid}`,
            patient_id: pid,
            doctor_id: user.id,
            created_at: lastMsg?.created_at || new Date().toISOString(),
            last_message_at: lastMsg?.created_at || null,
            doctor: { 
              id: user.id, 
              name: '', 
              email: '', 
              degree: '', 
              institution: '', 
              experience_years: 0, 
              specialization: '',
              certifications: '',
              created_at: new Date().toISOString(),
              profile_pic_url: '',
              theme_preference: 'light'
            } as any,
            patient: patient as any,
          } as Chat;
        });

        const derived = await Promise.all(derivedPromises);
        chatsWithData = derived as any;
      }

      setChats(chatsWithData);
    } catch (error: any) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat || !user?.id) return;

    try {
      // Get the other participant's ID based on user type
      const otherParticipantId = userType === 'patient' 
        ? selectedChat.doctor_id 
        : selectedChat.patient_id;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherParticipantId}),and(sender_id.eq.${otherParticipantId},receiver_id.eq.${user.id})`)
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

  const startChatWithDoctor = async (doctor: Doctor) => {
    if (!user?.id) return;

    try {
      // Check if chat already exists
      const existingChat = chats.find(chat => 
        chat.doctor_id === doctor.id && chat.patient_id === user.id
      );

      if (existingChat) {
        setSelectedChat(existingChat);
        return;
      }

      // Create new chat
      const { data: chatData, error } = await supabase
        .from('chats')
        .insert({
          patient_id: user.id,
          doctor_id: doctor.id,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Fetch doctor and patient data
      const [doctorResult, patientResult] = await Promise.all([
        supabase.from('doctors').select('*').eq('id', doctor.id).single(),
        supabase.from('patients').select('*').eq('id', user.id).single()
      ]);

      const chatWithData = {
        ...chatData,
        doctor: doctorResult.data,
        patient: patientResult.data
      };

      setSelectedChat(chatWithData);
      setChats(prev => [chatWithData, ...prev]);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user?.id) return;

    setLoading(true);

    try {
      const receiverId = userType === 'patient' ? selectedChat.doctor_id : selectedChat.patient_id;
      const receiverType = userType === 'patient' ? 'doctor' : 'patient';

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message: newMessage.trim(),
          sender_type: userType,
          receiver_type: receiverType,
          chat_id: selectedChat.id,
        });

      if (error) throw error;

      // Update last message time
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setNewMessage('');
      
      // Create notification for receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: receiverId,
          user_type: receiverType,
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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Doctor List / Chat List */}
      <Card className="mandala-shadow">
        <CardHeader>
          <CardTitle className="sanskrit-title flex items-center gap-2">
            <Users className="h-5 w-5" />
            {userType === 'patient' ? 'Available Doctors' : 'Patient Chats'}
          </CardTitle>
          {userType === 'patient' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
          {userType === 'patient' ? (
            // Patient view - show doctors
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => startChatWithDoctor(doctor)}
                className={`p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-mystic ${
                  selectedChat?.doctor_id === doctor.id ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doctor.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {doctor.experience_years} years exp
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doctor.degree}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Doctor view - show patient chats
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-mystic ${
                  selectedChat?.id === chat.id ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {chat.patient?.name ? chat.patient.name.split(' ').map(n => n[0]).join('') : 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{chat.patient?.name || 'Patient'}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.patient?.age ? `Age: ${chat.patient.age} • ` : ''}
                      {chat.last_message_at 
                        ? `Last message: ${new Date(chat.last_message_at).toLocaleDateString()}`
                        : 'No messages yet'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="mandala-shadow h-full flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {userType === 'patient' ? `Dr. ${selectedChat.doctor.name}` : selectedChat.patient?.name || 'Patient'}
                  <Badge variant="secondary" className="ml-auto">
                    {userType === 'patient' ? selectedChat.doctor.specialization : `Age: ${selectedChat.patient?.age || 'N/A'}`}
                  </Badge>
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
                              {userType === 'patient' 
                                ? selectedChat.doctor.name.split(' ').map(n => n[0]).join('')
                                : selectedChat.patient?.name ? selectedChat.patient.name.split(' ').map(n => n[0]).join('') : 'P'
                              }
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
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {userType === 'patient' ? 'Select a Doctor to Chat' : 'Select a Patient Chat'}
                </h3>
                <p className="text-muted-foreground">
                  {userType === 'patient' 
                    ? 'Choose a doctor from the list to start a conversation'
                    : 'Choose a patient chat to view messages'
                  }
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;