import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Leaf, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Brain, 
  Sparkles, 
  User, 
  ChefHat,
  Calculator,
  Stethoscope,
  Settings,
  MessageCircle,
  BookOpen,
  Download,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { t } from "@/utils/translations";
import { generateDietPDF } from "@/utils/pdfGenerator";
import ChatInterface from "./ChatInterface";
import NotificationSystem from "./NotificationSystem";

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  height?: number;
  weight?: number;
  medical_history?: string;
  food_preferences?: string;
  food_restrictions?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  created_at: string;
  doctor: {
    name: string;
  } | null;
}

interface DoctorPost {
  id: string;
  content: string;
  created_at: string;
  doctor: {
    name: string;
  } | null;
}

const PatientDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [doctorPosts, setDoctorPosts] = useState<DoctorPost[]>([]);
  const [lastDietChart, setLastDietChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPatientData();
      fetchRecipes();
      fetchDoctorPosts();
      fetchLastDietChart();
    }
  }, [user]);

  const fetchPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setPatient(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          doctor:doctors(name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchDoctorPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_posts')
        .select(`
          *,
          doctor:doctors(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setDoctorPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching doctor posts:', error);
    }
  };

  const fetchLastDietChart = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_charts')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setLastDietChart(data?.[0] || null);
    } catch (error: any) {
      console.error('Error fetching diet chart:', error);
    }
  };

  const handleDownloadPDF = () => {
    if (!patient || !lastDietChart) {
      toast({
        title: t('error', language),
        description: "No diet chart available to download",
        variant: "destructive",
      });
      return;
    }

    generateDietPDF(patient, lastDietChart.generated_diet);
    toast({
      title: t('success', language),
      description: "Diet chart downloaded successfully!",
    });
  };

  const handleGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const goal = formData.get('goal') as string;
    const concern = formData.get('concern') as string;
    const restrictions = formData.get('restrictions') as string;

    const dietPlan = {
      goal,
      concern,
      restrictions,
      generated_at: new Date().toISOString(),
      recommendations: [
        "Include warm, cooked foods to support digestion",
        "Favor sweet, sour, and salty tastes to balance Vata",
        "Avoid cold, raw foods and excessive bitter/astringent tastes",
        "Eat at regular times and avoid skipping meals"
      ]
    };

    try {
      const { error } = await supabase
        .from('diet_charts')
        .insert({
          patient_id: user?.id,
          generated_diet: dietPlan,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your personalized diet plan has been generated!",
      });

      fetchLastDietChart();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updates = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      height: parseFloat(formData.get('height') as string) || null,
      weight: parseFloat(formData.get('weight') as string) || null,
      medical_history: formData.get('medical_history') as string,
      food_preferences: formData.get('food_preferences') as string,
      food_restrictions: formData.get('food_restrictions') as string,
    };

    try {
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      setPatient(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-mystic">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold sanskrit-title gradient-text">Ved-Aahaar</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className="sanskrit-title transition-mystic"
            >
              Aarambh
            </Button>
            <Button 
              variant={activeTab === "diet" ? "default" : "ghost"}
              onClick={() => setActiveTab("diet")}
              className="sanskrit-title transition-mystic"
            >
              Yojan
            </Button>
            <Button 
              variant={activeTab === "tracker" ? "default" : "ghost"}
              onClick={() => setActiveTab("tracker")}
              className="sanskrit-title transition-mystic"
            >
              Ankhan
            </Button>
            <Button 
              variant={activeTab === "education" ? "default" : "ghost"}
              onClick={() => setActiveTab("education")}
              className="sanskrit-title transition-mystic"
            >
              Gyan
            </Button>
            <Button 
              variant={activeTab === "chat" ? "default" : "ghost"}
              onClick={() => setActiveTab("chat")}
              className="sanskrit-title transition-mystic"
            >
              {t('chat', language)}
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className="sanskrit-title transition-mystic"
            >
              {t('profile', language)}
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={signOut} className="transition-mystic">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="vedic-border"></div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                {t('welcomeBack', language)}, {patient?.name}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('continueJourney', language)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Days Active</h3>
                  <p className="text-2xl font-bold text-primary">21</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Wellness Score</h3>
                  <p className="text-2xl font-bold text-secondary">87%</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Dosha Balance</h3>
                  <p className="text-2xl font-bold text-primary">Vata</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Brain className="h-8 w-8 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Available Recipes</h3>
                  <p className="text-2xl font-bold text-secondary">{recipes.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recipes Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold sanskrit-title">Recommended Recipes</h3>
                <Badge variant="secondary" className="px-3 py-1">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Personalized for You
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="mandala-shadow transition-mystic hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sanskrit-title">{recipe.title}</CardTitle>
                        <ChefHat className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2 text-sm">Ingredients:</h5>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                            <div key={index}>• {ingredient}</div>
                          ))}
                          {recipe.ingredients.length > 3 && (
                            <div className="text-xs">... and {recipe.ingredients.length - 3} more</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </span>
                        <p className="text-xs text-muted-foreground">by Dr. {recipe.doctor?.name || 'Unknown'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Doctor Posts */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold sanskrit-title">Expert Insights</h3>
              
              <div className="space-y-4">
                {doctorPosts.map((post) => (
                  <Card key={post.id} className="mandala-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.doctor?.name ? post.doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold sanskrit-title">Dr. {post.doctor?.name || 'Unknown Doctor'}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{post.content}</p>
                          <div className="flex items-center space-x-4 pt-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <Heart className="h-4 w-4 mr-1" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Diet Generator */}
          <TabsContent value="diet" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Personalized Diet Generator
              </h2>
              <p className="text-muted-foreground text-lg">
                AI-powered meal plans based on your unique constitution
              </p>
            </div>

            <Card className="mandala-shadow max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="sanskrit-title text-center">Generate Your Diet Plan</CardTitle>
                <CardDescription className="text-center">
                  Answer a few questions to receive your personalized Ayurvedic meal plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateDiet} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Current Health Goal</Label>
                      <Select name="goal" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight_management">Weight Management</SelectItem>
                          <SelectItem value="digestive_health">Digestive Health</SelectItem>
                          <SelectItem value="energy_vitality">Energy & Vitality</SelectItem>
                          <SelectItem value="stress_management">Stress Management</SelectItem>
                          <SelectItem value="general_wellness">General Wellness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concern">Primary Concern</Label>
                      <Select name="concern" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary concern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irregular_digestion">Irregular Digestion</SelectItem>
                          <SelectItem value="low_energy">Low Energy</SelectItem>
                          <SelectItem value="sleep_issues">Sleep Issues</SelectItem>
                          <SelectItem value="stress_anxiety">Stress & Anxiety</SelectItem>
                          <SelectItem value="joint_pain">Joint Pain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="restrictions">Food Preferences & Restrictions</Label>
                    <Textarea 
                      name="restrictions"
                      placeholder="e.g., allergic to nuts, prefer warm foods, avoid dairy..." 
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full mystic-glow transition-mystic" size="lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate My Diet Plan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calorie Tracker */}
          <TabsContent value="tracker" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Ayurvedic Calorie Tracker
              </h2>
              <p className="text-muted-foreground text-lg">
                Track nutrition with Rasa & Guna classification
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="mandala-shadow">
                  <CardHeader>
                    <CardTitle className="sanskrit-title">Today's Intake</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">1,247 / 1,800</div>
                      <p className="text-muted-foreground">Calories consumed today</p>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full" style={{width: '69%'}}></div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Add Food Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mandala-shadow">
                  <CardHeader>
                    <CardTitle className="sanskrit-title">Dosha Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vata</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pitta</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Kapha</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Doctor */}
          <TabsContent value="doctor" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Your Ayurvedic Doctor
              </h2>
              <p className="text-muted-foreground text-lg">
                Connect with your assigned practitioner
              </p>
            </div>

            <Card className="mandala-shadow max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-6">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                    PS
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-2xl font-bold sanskrit-title mb-2">Dr. Priya Sharma</h3>
                <p className="text-primary font-medium mb-2">Panchakarma & Digestive Health</p>
                <p className="text-muted-foreground mb-6">15 years experience • BAMS, MD (Ayurveda)</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" className="transition-mystic">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button className="transition-mystic">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Dr. Sharma specializes in digestive health and Panchakarma treatments. 
                  She has helped over 1,000 patients achieve optimal wellness through personalized Ayurvedic care.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Ayurvedic Learning Center
              </h2>
              <p className="text-muted-foreground text-lg">
                Deepen your understanding of Ayurvedic principles and nutrition
              </p>
            </div>

            <Card className="mandala-shadow">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Educational Content Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive learning modules about Ayurvedic nutrition, dosha balance, and wellness practices will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat */}
          <TabsContent value="chat" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                {t('chat', language)}
              </h2>
              <p className="text-muted-foreground text-lg">
                Connect with your Ayurvedic doctor
              </p>
            </div>

            <ChatInterface 
              recipientId="doctor-demo-id"
              recipientType="doctor"
              recipientName="Dr. Priya Sharma"
            />
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Your Profile
              </h2>
              <p className="text-muted-foreground text-lg">
                Manage your wellness information
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="mandala-shadow">
                <CardHeader>
                  <CardTitle className="sanskrit-title flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                      AK
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-2">
                <Card className="mandala-shadow">
                  <CardHeader>
                    <CardTitle className="sanskrit-title">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value="Arjun Kumar" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="arjun.kumar@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" value="28" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input id="height" value="175" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" value="72" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dosha">Primary Dosha</Label>
                        <select className="w-full p-2 border border-border rounded-md bg-background">
                          <option selected>Vata</option>
                          <option>Pitta</option>
                          <option>Kapha</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medical-history">Medical History</Label>
                      <Textarea 
                        id="medical-history" 
                        placeholder="Any health conditions, allergies, or ongoing treatments..."
                        value="Mild hypertension, managed with lifestyle changes. No known allergies."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dietary-prefs">Dietary Preferences</Label>
                      <Textarea 
                        id="dietary-prefs" 
                        placeholder="Food preferences, restrictions, etc..."
                        value="Vegetarian, prefer warm foods, avoid dairy after 6 PM"
                      />
                    </div>
                    
                  <Button type="submit" className="w-full mystic-glow transition-mystic" size="lg">
                    <Settings className="h-5 w-5 mr-2" />
                    Update Profile
                  </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;