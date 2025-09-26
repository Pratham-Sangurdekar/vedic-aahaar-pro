import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TrackerProps {
  userType: 'patient' | 'doctor';
}

interface PatientMetrics {
  daysActive: number;
  wellnessScore: number;
  completedModules: number;
  availableRecipes: number;
  totalChats: number;
  doshaBalance: string;
}

interface DoctorMetrics {
  activePatients: number;
  recipesShared: number;
  postsThisMonth: number;
  yearsExperience: number;
  totalChats: number;
  recentActivity: number;
}

const ConcentricCircularTracker: React.FC<TrackerProps> = ({ userType }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PatientMetrics | DoctorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetrics();
      
      // Set up real-time updates
      const channel = supabase
        .channel('tracker-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: userType === 'patient' ? 'gyan_progress' : 'doctor_posts'
          },
          () => {
            fetchMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chats'
          },
          () => {
            fetchMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'recipes'
          },
          () => {
            fetchMetrics();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, userType]);

  const fetchMetrics = async () => {
    if (!user?.id) return;

    try {
      if (userType === 'patient') {
        await fetchPatientMetrics();
      } else {
        await fetchDoctorMetrics();
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientMetrics = async () => {
    try {
      // Get patient's join date
      const { data: patientData } = await supabase
        .from('patients')
        .select('created_at')
        .eq('id', user?.id)
        .single();

      const daysActive = patientData 
        ? Math.floor((Date.now() - new Date(patientData.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Get other metrics
      const [
        { count: availableRecipes },
        { count: totalChats },
        { count: completedModules }
      ] = await Promise.all([
        supabase.from('recipes').select('*', { count: 'exact', head: true }),
        supabase.from('chats').select('*', { count: 'exact', head: true }).eq('patient_id', user?.id),
        supabase.from('gyan_progress').select('*', { count: 'exact', head: true }).eq('patient_id', user?.id)
      ]);

      const wellnessScore = Math.min(100, Math.max(0, 
        Math.floor((daysActive * 2) + (completedModules * 5) + (totalChats * 3))
      ));

      const doshaOptions = ['Vata', 'Pitta', 'Kapha'];
      const doshaBalance = doshaOptions[daysActive % 3];

      setMetrics({
        daysActive,
        wellnessScore,
        completedModules: completedModules || 0,
        availableRecipes: availableRecipes || 0,
        totalChats: totalChats || 0,
        doshaBalance
      });
    } catch (error) {
      console.error('Error fetching patient metrics:', error);
    }
  };

  const fetchDoctorMetrics = async () => {
    try {
      // Get doctor's experience
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('experience_years')
        .eq('id', user?.id)
        .single();

      // Get other metrics
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        { count: activePatients },
        { count: recipesShared },
        { count: postsThisMonth },
        { count: totalChats },
        { count: recentActivity }
      ] = await Promise.all([
        supabase.from('chats').select('*', { count: 'exact', head: true }).eq('doctor_id', user?.id),
        supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('author_id', user?.id),
        supabase.from('doctor_posts').select('*', { count: 'exact', head: true })
          .eq('doctor_id', user?.id).gte('created_at', startOfMonth.toISOString()),
        supabase.from('chats').select('*', { count: 'exact', head: true }).eq('doctor_id', user?.id),
        supabase.from('doctor_posts').select('*', { count: 'exact', head: true })
          .eq('doctor_id', user?.id).gte('created_at', sevenDaysAgo.toISOString())
      ]);

      setMetrics({
        activePatients: activePatients || 0,
        recipesShared: recipesShared || 0,
        postsThisMonth: postsThisMonth || 0,
        yearsExperience: doctorData?.experience_years || 0,
        totalChats: totalChats || 0,
        recentActivity: recentActivity || 0
      });
    } catch (error) {
      console.error('Error fetching doctor metrics:', error);
    }
  };

  const renderConcentricCircles = () => {
    if (!metrics) return null;

    if (userType === 'patient') {
      const patientMetrics = metrics as PatientMetrics;
      const circles = [
        {
          value: patientMetrics.daysActive,
          max: 365,
          color: 'stroke-primary',
          label: 'Days Active',
          radius: 140
        },
        {
          value: patientMetrics.wellnessScore,
          max: 100,
          color: 'stroke-secondary',
          label: 'Wellness Score',
          radius: 110
        },
        {
          value: patientMetrics.completedModules,
          max: 20,
          color: 'stroke-accent',
          label: 'Completed Modules',
          radius: 80
        },
        {
          value: patientMetrics.totalChats,
          max: 50,
          color: 'stroke-primary/70',
          label: 'Total Chats',
          radius: 50
        }
      ];

      return (
        <div className="relative flex items-center justify-center">
          <svg width="320" height="320" className="transform -rotate-90">
            {circles.map((circle, index) => {
              const circumference = 2 * Math.PI * circle.radius;
              const progress = Math.min(circle.value / circle.max, 1);
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference * (1 - progress);

              return (
                <g key={index}>
                  {/* Background circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={circle.radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={circle.radius}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={`${circle.color} transition-all duration-1000 ease-out`}
                    style={{
                      strokeDasharray,
                      strokeDashoffset,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold gradient-text mb-2">
              {patientMetrics.wellnessScore}%
            </div>
            <div className="text-sm text-muted-foreground mb-1">Wellness Score</div>
            <div className="text-xs text-primary font-medium">
              {patientMetrics.doshaBalance} Dominant
            </div>
          </div>
        </div>
      );
    } else {
      const doctorMetrics = metrics as DoctorMetrics;
      const circles = [
        {
          value: doctorMetrics.activePatients,
          max: 100,
          color: 'stroke-primary',
          label: 'Active Patients',
          radius: 140
        },
        {
          value: doctorMetrics.recipesShared,
          max: 50,
          color: 'stroke-secondary',
          label: 'Recipes Shared',
          radius: 110
        },
        {
          value: doctorMetrics.postsThisMonth,
          max: 30,
          color: 'stroke-accent',
          label: 'Posts This Month',
          radius: 80
        },
        {
          value: doctorMetrics.recentActivity,
          max: 20,
          color: 'stroke-primary/70',
          label: 'Recent Activity',
          radius: 50
        }
      ];

      return (
        <div className="relative flex items-center justify-center">
          <svg width="320" height="320" className="transform -rotate-90">
            {circles.map((circle, index) => {
              const circumference = 2 * Math.PI * circle.radius;
              const progress = Math.min(circle.value / circle.max, 1);
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference * (1 - progress);

              return (
                <g key={index}>
                  {/* Background circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={circle.radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r={circle.radius}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={`${circle.color} transition-all duration-1000 ease-out`}
                    style={{
                      strokeDasharray,
                      strokeDashoffset,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold gradient-text mb-2">
              {doctorMetrics.activePatients}
            </div>
            <div className="text-sm text-muted-foreground mb-1">Active Patients</div>
            <div className="text-xs text-primary font-medium">
              {doctorMetrics.yearsExperience} Years Experience
            </div>
          </div>
        </div>
      );
    }
  };

  const renderLegend = () => {
    if (!metrics) return null;

    if (userType === 'patient') {
      const patientMetrics = metrics as PatientMetrics;
      const items = [
        { label: 'Days Active', value: patientMetrics.daysActive, color: 'bg-primary' },
        { label: 'Wellness Score', value: `${patientMetrics.wellnessScore}%`, color: 'bg-secondary' },
        { label: 'Completed Modules', value: patientMetrics.completedModules, color: 'bg-accent' },
        { label: 'Total Chats', value: patientMetrics.totalChats, color: 'bg-primary/70' }
      ];

      return (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <div className="text-sm">
                <div className="font-medium">{item.value}</div>
                <div className="text-muted-foreground text-xs">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      const doctorMetrics = metrics as DoctorMetrics;
      const items = [
        { label: 'Active Patients', value: doctorMetrics.activePatients, color: 'bg-primary' },
        { label: 'Recipes Shared', value: doctorMetrics.recipesShared, color: 'bg-secondary' },
        { label: 'Posts This Month', value: doctorMetrics.postsThisMonth, color: 'bg-accent' },
        { label: 'Recent Activity', value: doctorMetrics.recentActivity, color: 'bg-primary/70' }
      ];

      return (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <div className="text-sm">
                <div className="font-medium">{item.value}</div>
                <div className="text-muted-foreground text-xs">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <Card className="mandala-shadow">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="relative">
            <div className="w-80 h-80 rounded-full border-8 border-muted animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-8 bg-muted animate-pulse rounded mb-2"></div>
                <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mandala-shadow">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold sanskrit-title gradient-text">
            {userType === 'patient' ? 'Wellness Tracker' : 'Practice Overview'}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Real-time activity and progress visualization
          </p>
        </div>
        
        {renderConcentricCircles()}
        {renderLegend()}
      </CardContent>
    </Card>
  );
};

export default ConcentricCircularTracker;