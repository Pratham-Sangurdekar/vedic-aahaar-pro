import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  TrendingUp, 
  Heart, 
  Brain, 
  Users, 
  ChefHat, 
  MessageCircle,
  BookOpen,
  Activity,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStatsProps {
  userType: 'patient' | 'doctor';
}

interface PatientStats {
  daysActive: number;
  wellnessScore: number;
  doshaBalance: string;
  availableRecipes: number;
  totalChats: number;
  completedModules: number;
  lastDietChart: string | null;
}

interface DoctorStats {
  activePatients: number;
  recipesShared: number;
  postsThisMonth: number;
  yearsExperience: number;
  totalChats: number;
  totalPosts: number;
  recentActivity: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userType }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PatientStats | DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      if (userType === 'patient') {
        await fetchPatientStats();
      } else {
        await fetchDoctorStats();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientStats = async () => {
    try {
      // Get patient's join date to calculate days active
      const { data: patientData } = await supabase
        .from('patients')
        .select('created_at')
        .eq('id', user?.id)
        .single();

      const daysActive = patientData 
        ? Math.floor((Date.now() - new Date(patientData.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Get total recipes available
      const { count: availableRecipes } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Get total chats
      const { count: totalChats } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user?.id);

      // Get completed gyan modules
      const { count: completedModules } = await supabase
        .from('gyan_progress')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user?.id);

      // Get last diet chart
      const { data: lastDietChart } = await supabase
        .from('diet_charts')
        .select('created_at')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Calculate wellness score based on activity
      const wellnessScore = Math.min(100, Math.max(0, 
        Math.floor((daysActive * 2) + (completedModules * 5) + (totalChats * 3))
      ));

      // Simple dosha calculation based on activity
      const doshaOptions = ['Vata', 'Pitta', 'Kapha'];
      const doshaBalance = doshaOptions[daysActive % 3];

      setStats({
        daysActive,
        wellnessScore,
        doshaBalance,
        availableRecipes: availableRecipes || 0,
        totalChats: totalChats || 0,
        completedModules: completedModules || 0,
        lastDietChart: lastDietChart?.created_at || null
      });
    } catch (error) {
      console.error('Error fetching patient stats:', error);
    }
  };

  const fetchDoctorStats = async () => {
    try {
      // Get doctor's experience years
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('experience_years')
        .eq('id', user?.id)
        .single();

      // Get active patients (patients who have chats with this doctor)
      const { count: activePatients } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user?.id);

      // Get recipes shared by this doctor
      const { count: recipesShared } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user?.id);

      // Get posts this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: postsThisMonth } = await supabase
        .from('doctor_posts')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user?.id)
        .gte('created_at', startOfMonth.toISOString());

      // Get total posts
      const { count: totalPosts } = await supabase
        .from('doctor_posts')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user?.id);

      // Get total chats
      const { count: totalChats } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user?.id);

      // Calculate recent activity (posts + recipes in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentActivity } = await supabase
        .from('doctor_posts')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user?.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        activePatients: activePatients || 0,
        recipesShared: recipesShared || 0,
        postsThisMonth: postsThisMonth || 0,
        yearsExperience: doctorData?.experience_years || 0,
        totalChats: totalChats || 0,
        totalPosts: totalPosts || 0,
        recentActivity: recentActivity || 0
      });
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="mandala-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-8 w-8 bg-muted animate-pulse rounded mx-auto mb-4"></div>
              <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-6 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load statistics</p>
      </div>
    );
  }

  if (userType === 'patient') {
    const patientStats = stats as PatientStats;
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="mandala-shadow transition-mystic hover:scale-105">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Days Active</h3>
            <p className="text-2xl font-bold text-primary">{patientStats.daysActive}</p>
          </CardContent>
        </Card>
        
        <Card className="mandala-shadow transition-mystic hover:scale-105">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Wellness Score</h3>
            <p className="text-2xl font-bold text-secondary">{patientStats.wellnessScore}%</p>
          </CardContent>
        </Card>
        
        <Card className="mandala-shadow transition-mystic hover:scale-105">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Dosha Balance</h3>
            <p className="text-2xl font-bold text-primary">{patientStats.doshaBalance}</p>
          </CardContent>
        </Card>
        
        <Card className="mandala-shadow transition-mystic hover:scale-105">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Available Recipes</h3>
            <p className="text-2xl font-bold text-secondary">{patientStats.availableRecipes}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const doctorStats = stats as DoctorStats;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="mandala-shadow transition-mystic hover:scale-105">
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Active Patients</h3>
          <p className="text-2xl font-bold text-primary">{doctorStats.activePatients}</p>
        </CardContent>
      </Card>
      
      <Card className="mandala-shadow transition-mystic hover:scale-105">
        <CardContent className="p-6 text-center">
          <ChefHat className="h-8 w-8 text-secondary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Recipes Shared</h3>
          <p className="text-2xl font-bold text-secondary">{doctorStats.recipesShared}</p>
        </CardContent>
      </Card>
      
      <Card className="mandala-shadow transition-mystic hover:scale-105">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Posts This Month</h3>
          <p className="text-2xl font-bold text-primary">{doctorStats.postsThisMonth}</p>
        </CardContent>
      </Card>
      
      <Card className="mandala-shadow transition-mystic hover:scale-105">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-secondary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Years Experience</h3>
          <p className="text-2xl font-bold text-secondary">{doctorStats.yearsExperience}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;


