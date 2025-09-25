import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: 'patient' | 'doctor' | null;
  loading: boolean;
  signInPatient: (email: string, password: string) => Promise<{ error: any }>;
  signInDoctor: (email: string, password: string) => Promise<{ error: any }>;
  signUpPatient: (data: PatientSignUpData) => Promise<{ error: any }>;
  signUpDoctor: (data: DoctorSignUpData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

interface PatientSignUpData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  food_preferences?: string;
}

interface DoctorSignUpData {
  name: string;
  email: string;
  password: string;
  degree: string;
  institution: string;
  experience_years: number;
  specialization: string;
  certifications?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userType: null,
  loading: true,
  signInPatient: async () => ({ error: null }),
  signInDoctor: async () => ({ error: null }),
  signUpPatient: async () => ({ error: null }),
  signUpDoctor: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is patient or doctor
          setTimeout(async () => {
            await determineUserType(session.user.id);
          }, 0);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        determineUserType(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const determineUserType = async (userId: string) => {
    try {
      // Check if user exists in patients table
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('id', userId)
        .single();

      if (patient) {
        setUserType('patient');
        return;
      }

      // Check if user exists in doctors table
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('id', userId)
        .single();

      if (doctor) {
        setUserType('doctor');
        return;
      }

      setUserType(null);
    } catch (error) {
      console.error('Error determining user type:', error);
      setUserType(null);
    }
  };

  const signInPatient = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Verify user is a patient
      if (data.user) {
        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!patient) {
          await supabase.auth.signOut();
          const errorMsg = "This account is not registered as a patient.";
          toast({
            title: "Access Denied",
            description: errorMsg,
            variant: "destructive",
          });
          return { error: { message: errorMsg } };
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInDoctor = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Verify user is a doctor
      if (data.user) {
        const { data: doctor } = await supabase
          .from('doctors')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!doctor) {
          await supabase.auth.signOut();
          const errorMsg = "This account is not registered as a doctor.";
          toast({
            title: "Access Denied",
            description: errorMsg,
            variant: "destructive",
          });
          return { error: { message: errorMsg } };
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUpPatient = async (data: PatientSignUpData) => {
    try {
      const redirectUrl = `${window.location.origin}/patient/dashboard`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      }

      if (authData.user) {
        // Create patient profile
        const { error: profileError } = await supabase
          .from('patients')
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            age: data.age,
            gender: data.gender,
            food_preferences: data.food_preferences || null,
          });

        if (profileError) {
          toast({
            title: "Profile Creation Failed",
            description: profileError.message,
            variant: "destructive",
          });
          return { error: profileError };
        }
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUpDoctor = async (data: DoctorSignUpData) => {
    try {
      const redirectUrl = `${window.location.origin}/doctor/dashboard`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      }

      if (authData.user) {
        // Create doctor profile
        const { error: profileError } = await supabase
          .from('doctors')
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            degree: data.degree,
            institution: data.institution,
            experience_years: data.experience_years,
            specialization: data.specialization,
            certifications: data.certifications || null,
          });

        if (profileError) {
          toast({
            title: "Profile Creation Failed",
            description: profileError.message,
            variant: "destructive",
          });
          return { error: profileError };
        }
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear local state
        setUser(null);
        setSession(null);
        setUserType(null);
        
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        
        // Redirect to landing page instead of auth page
        window.location.href = '/';
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    userType,
    loading,
    signInPatient,
    signInDoctor,
    signUpPatient,
    signUpDoctor,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};