import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Play, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/utils/translations';

interface GyanModule {
  id: string;
  title: string;
  content_html: string;
  topic: string;
  order_index: number;
  image_url?: string;
  video_url?: string;
  created_at: string;
}

interface GyanProgress {
  id: string;
  module_id: string;
  patient_id: string;
  completed_at: string;
}

const GyanModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [modules, setModules] = useState<GyanModule[]>([]);
  const [progress, setProgress] = useState<GyanProgress[]>([]);
  const [selectedModule, setSelectedModule] = useState<GyanModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('gyan_modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      toast({
        title: t('error', language),
        description: 'Failed to load knowledge modules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('gyan_progress')
        .select('*')
        .eq('patient_id', user?.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error: any) {
      console.error('Error fetching progress:', error);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gyan_progress')
        .insert({
          module_id: moduleId,
          patient_id: user.id,
        });

      if (error) throw error;

      setProgress(prev => [...prev, {
        id: '',
        module_id: moduleId,
        patient_id: user.id,
        completed_at: new Date().toISOString(),
      }]);

      toast({
        title: t('success', language),
        description: 'Module completed! Great job!',
      });
    } catch (error: any) {
      console.error('Error marking module complete:', error);
      toast({
        title: t('error', language),
        description: 'Failed to save progress',
        variant: 'destructive',
      });
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.some(p => p.module_id === moduleId);
  };

  const getCompletionPercentage = () => {
    if (modules.length === 0) return 0;
    return Math.round((progress.length / modules.length) * 100);
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    const previousModule = modules[moduleIndex - 1];
    return previousModule ? isModuleCompleted(previousModule.id) : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading knowledge modules...</p>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => setSelectedModule(null)}
            className="mb-6"
          >
            ← Back to Modules
          </Button>

          {/* Module Content */}
          <Card className="mandala-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="sanskrit-title text-2xl">{selectedModule.title}</CardTitle>
                  {selectedModule.topic && (
                    <Badge variant="secondary" className="mt-2">
                      {selectedModule.topic}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Video */}
              {selectedModule.video_url && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    poster={selectedModule.image_url}
                  >
                    <source src={selectedModule.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Image */}
              {selectedModule.image_url && !selectedModule.video_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={selectedModule.image_url} 
                    alt={selectedModule.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selectedModule.content_html }}
              />

              {/* Complete Button */}
              {!isModuleCompleted(selectedModule.id) && (
                <div className="pt-6 border-t">
                  <Button 
                    onClick={() => markModuleComplete(selectedModule.id)}
                    className="w-full mystic-glow transition-mystic"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}

              {isModuleCompleted(selectedModule.id) && (
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Module Completed!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
            {t('knowledgeModule', language)}
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Discover the wisdom of Ayurveda through interactive learning modules
          </p>

          {/* Progress Overview */}
          <Card className="max-w-md mx-auto mandala-shadow">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Your Learning Progress</h3>
                <div className="space-y-2">
                  <Progress value={getCompletionPercentage()} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {progress.length} of {modules.length} modules completed ({getCompletionPercentage()}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const isCompleted = isModuleCompleted(module.id);
            const isUnlocked = isModuleUnlocked(index);

            return (
              <Card 
                key={module.id} 
                className={`mandala-shadow transition-mystic hover:scale-105 ${
                  !isUnlocked ? 'opacity-60' : ''
                } ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={isCompleted ? 'default' : 'secondary'}>
                      Module {index + 1}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <CardTitle className="sanskrit-title line-clamp-2">
                    {module.title}
                  </CardTitle>
                  {module.topic && (
                    <Badge variant="outline" className="w-fit">
                      {module.topic}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Module Image */}
                  {module.image_url && (
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img 
                        src={module.image_url} 
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content Preview */}
                  <div 
                    className="text-sm text-muted-foreground line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: module.content_html.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }}
                  />

                  {/* Action Button */}
                  <Button 
                    onClick={() => setSelectedModule(module)}
                    disabled={!isUnlocked}
                    className="w-full transition-mystic"
                    variant={isCompleted ? 'outline' : 'default'}
                  >
                    {!isUnlocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : isCompleted ? (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {modules.length === 0 && (
          <Card className="mandala-shadow">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Modules Available</h3>
              <p className="text-muted-foreground">
                Knowledge modules will be available soon. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GyanModule;