import { useState, useEffect } from "react";
import DoctorPatientsSection from "./DoctorPatientsSection";
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
  Users, 
  Heart, 
  Brain, 
  Sparkles, 
  User, 
  ChefHat,
  Stethoscope,
  Settings,
  MessageCircle,
  Plus,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import EnhancedChatInterface from "./EnhancedChatInterface";
import ProfileSection from "./ProfileSection";
import ConcentricCircularTracker from "./ConcentricCircularTracker";

interface Doctor {
  id: string;
  name: string;
  email: string;
  degree: string;
  institution: string;
  experience_years: number;
  specialization: string;
  certifications?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  created_at: string;
}

interface DoctorPost {
  id: string;
  content: string;
  created_at: string;
  doctor: {
    name: string;
  } | null;
}

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [doctorPosts, setDoctorPosts] = useState<DoctorPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDoctorData();
      fetchRecipes();
      fetchDoctorPosts();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setDoctor(data);
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
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });

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
        .limit(10);

      if (error) throw error;
      setDoctorPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching doctor posts:', error);
    }
  };

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const ingredients = (formData.get('ingredients') as string).split(',').map(i => i.trim());
    const instructions = formData.get('instructions') as string;

    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          title,
          description,
          ingredients,
          instructions,
          author_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe created successfully!",
      });

      fetchRecipes();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get('content') as string;

    try {
      const { error } = await supabase
        .from('doctor_posts')
        .insert({
          content,
          doctor_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      fetchDoctorPosts();
      (e.target as HTMLFormElement).reset();
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
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Doctor Portal</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className="sanskrit-title transition-mystic"
            >
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "patients" ? "default" : "ghost"}
              onClick={() => setActiveTab("patients")}
              className="sanskrit-title transition-mystic"
            >
              Patients
            </Button>
            <Button 
              variant={activeTab === "recipes" ? "default" : "ghost"}
              onClick={() => setActiveTab("recipes")}
              className="sanskrit-title transition-mystic"
            >
              Recipes
            </Button>
            <Button 
              variant={activeTab === "education" ? "default" : "ghost"}
              onClick={() => setActiveTab("education")}
              className="sanskrit-title transition-mystic"
            >
              Education
            </Button>
            <Button 
              variant={activeTab === "messages" ? "default" : "ghost"}
              onClick={() => setActiveTab("messages")}
              className="sanskrit-title transition-mystic"
            >
              Messages
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className="sanskrit-title transition-mystic"
            >
              Profile
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
                Welcome, Dr. {doctor?.name}
              </h2>
              <p className="text-muted-foreground text-lg">
                Continue sharing your Ayurvedic expertise
              </p>
            </div>

            {/* Real-time Stats */}
            <ConcentricCircularTracker userType="doctor" />

            {/* Create Post Section */}
            <Card className="mandala-shadow">
              <CardHeader>
                <CardTitle className="sanskrit-title">Share Your Wisdom</CardTitle>
                <CardDescription>
                  Create educational posts to help patients on their wellness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <Textarea 
                    name="content"
                    placeholder="Share an Ayurvedic tip, insight, or educational content..."
                    rows={4}
                    required
                  />
                  <Button type="submit" className="mystic-glow transition-mystic">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Post
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold sanskrit-title">Recent Community Posts</h3>
              
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
                            <h4 className="font-semibold sanskrit-title">{post.doctor?.name || 'Unknown Doctor'}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Patients */}
          <TabsContent value="patients" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Patient Management
              </h2>
              <p className="text-muted-foreground text-lg">
                Monitor and guide your patients' wellness journeys
              </p>
            </div>
            {user?.id && <DoctorPatientsSection doctorId={user.id} />}
          </TabsContent>

          {/* Recipes */}
          <TabsContent value="recipes" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Recipe Management
              </h2>
              <p className="text-muted-foreground text-lg">
                Create and manage Ayurvedic recipes for the community
              </p>
            </div>

            {/* Create Recipe Form */}
            <Card className="mandala-shadow">
              <CardHeader>
                <CardTitle className="sanskrit-title">Create New Recipe</CardTitle>
                <CardDescription>
                  Share your knowledge through nutritious Ayurvedic recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRecipe} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Title</Label>
                    <Input id="title" name="title" placeholder="Golden Turmeric Milk" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="A soothing anti-inflammatory drink perfect for evening relaxation..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                    <Textarea 
                      id="ingredients" 
                      name="ingredients" 
                      placeholder="1 cup milk, 1 tsp turmeric, 1/2 tsp ginger, honey to taste"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea 
                      id="instructions" 
                      name="instructions" 
                      placeholder="1. Heat milk in a pan. 2. Add turmeric and ginger..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full mystic-glow transition-mystic">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Create Recipe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Recipes */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold sanskrit-title">My Recipes</h3>
              
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
                        <h5 className="font-medium mb-2">Ingredients:</h5>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {recipe.ingredients.map((ingredient, index) => (
                            <div key={index}>• {ingredient}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Educational Resources
              </h2>
              <p className="text-muted-foreground text-lg">
                Curated resources for Ayurvedic practitioners: research, guidelines, and best practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Curated Ayurvedic resources */}
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/ayush-logo.svg" alt="AYUSH Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ministry of AYUSH Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Official government guidelines for Ayurvedic practice in India.</p>
                  <a href="https://www.ayush.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit Website</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/journal-ayurveda.svg" alt="Journal of Ayurveda" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Journal of Ayurveda and Integrative Medicine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Peer-reviewed research articles and reviews on Ayurveda.</p>
                  <a href="https://www.jaim.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Read Journal</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/ccras-logo.svg" alt="CCRAS Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">CCRAS Research Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Central Council for Research in Ayurvedic Sciences: clinical trials, monographs, and more.</p>
                  <a href="https://www.ccras.nic.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Explore CCRAS</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/who-logo.svg" alt="WHO Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">WHO Benchmarks for Training in Ayurveda</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">World Health Organization's standards for Ayurveda education and practice.</p>
                  <a href="https://www.who.int/publications/i/item/9789241515436" target="_blank" rel="noopener noreferrer" className="text-primary underline">View WHO Document</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/formulary.svg" alt="Ayurvedic Formulary" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurvedic Formulary of India</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Comprehensive list of classical Ayurvedic formulations and their standards.</p>
                  <a href="https://www.ayush.gov.in/docs/afivol1.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">Download PDF</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/nia-logo.svg" alt="NIA Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">National Institute of Ayurveda (NIA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Academic programs, research, and resources for practitioners and students.</p>
                  <a href="https://www.nia.nic.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit NIA</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/aiia-logo.svg" alt="AIIA Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">All India Institute of Ayurveda (AIIA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Premier institute for Ayurveda education, research, and clinical care.</p>
                  <a href="https://aiia.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit AIIA</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/ccim-elearning.svg" alt="CCIM eLearning" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurveda eLearning Portal (CCIM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Online learning modules and resources for Ayurveda students and practitioners.</p>
                  <a href="https://elearning.ccimindia.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Go to eLearning</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/ayush-portal.svg" alt="AYUSH Portal" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurveda Research Database (AYUSH)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Database of published research in Ayurveda and related systems.</p>
                  <a href="https://ayushportal.nic.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Search Database</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/pharmacopoeia.svg" alt="Ayurvedic Pharmacopoeia" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurvedic Pharmacopoeia of India</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Standards for single drugs and compound formulations in Ayurveda.</p>
                  <a href="https://www.ayush.gov.in/docs/ayurvedic-pharmacopoeia-part-i-volume-i.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">Download PDF</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/namstp-logo.svg" alt="NAMSTP Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">National AYUSH Morbidity and Standardized Terminologies Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Standardized clinical terminologies and morbidity codes for Ayurveda.</p>
                  <a href="https://namstp.ayush.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit NAMSTP</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/manuscripts.svg" alt="Ayurveda Manuscripts" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurveda Books and Manuscripts (Digital Library)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Access digitized classical Ayurveda texts and manuscripts.</p>
                  <a href="https://www.ayurvedamanuscripts.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Explore Library</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/rav-logo.svg" alt="RAV Logo" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">RAV (Rashtriya Ayurveda Vidyapeeth)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Continuing medical education, training, and fellowships for Ayurveda practitioners.</p>
                  <a href="https://ravdelhi.nic.in/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit RAV</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/ayurveda-research.svg" alt="Ayurveda Research" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurveda International Research Journals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Access international journals publishing Ayurveda research.</p>
                  <a href="https://www.ayurvedaresearch.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Browse Journals</a>
                </CardContent>
              </Card>
              <Card className="mandala-shadow">
                <CardHeader>
                  <img src="/assets/jaim-case-report.svg" alt="J-AIM Case Report" className="h-60 mx-auto mb-2" />
                  <CardTitle className="text-lg">Ayurvedic Clinical Case Reports (J-AIM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Case reports and clinical experiences in Ayurveda practice.</p>
                  <a href="https://www.jaim.in/article.asp?issn=0975-9476;year=2020;volume=11;issue=3;spage=255;epage=259;aulast=Patel" target="_blank" rel="noopener noreferrer" className="text-primary underline">Read Case Report</a>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Patient Messages
              </h2>
              <p className="text-muted-foreground text-lg">
                Communicate with your patients and provide guidance
              </p>
            </div>

            <EnhancedChatInterface />
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Doctor Profile
              </h2>
              <p className="text-muted-foreground text-lg">
                Manage your professional information
              </p>
            </div>

            <ProfileSection userType="doctor" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;