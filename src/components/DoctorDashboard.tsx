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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updates = {
      name: formData.get('name') as string,
      degree: formData.get('degree') as string,
      institution: formData.get('institution') as string,
      experience_years: parseInt(formData.get('experience_years') as string),
      specialization: formData.get('specialization') as string,
      certifications: formData.get('certifications') as string,
    };

    try {
      const { error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      setDoctor(prev => prev ? { ...prev, ...updates } : null);
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Active Patients</h3>
                  <p className="text-2xl font-bold text-primary">42</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <ChefHat className="h-8 w-8 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Recipes Shared</h3>
                  <p className="text-2xl font-bold text-secondary">{recipes.length}</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Posts This Month</h3>
                  <p className="text-2xl font-bold text-primary">{doctorPosts.length}</p>
                </CardContent>
              </Card>
              
              <Card className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Years Experience</h3>
                  <p className="text-2xl font-bold text-secondary">{doctor?.experience_years}</p>
                </CardContent>
              </Card>
            </div>

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

            <Card className="mandala-shadow">
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Patient Dashboard Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced patient management and consultation features will be available in the next update.
                </p>
              </CardContent>
            </Card>
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
                Share and access Ayurvedic knowledge and research
              </p>
            </div>

            <Card className="mandala-shadow">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Educational Platform Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive learning modules and research library will be available in the next update.
                </p>
              </CardContent>
            </Card>
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

            <Card className="mandala-shadow max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="sanskrit-title">Professional Information</CardTitle>
                <CardDescription>
                  Update your qualifications and practice details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={doctor?.name} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree(s)</Label>
                    <Input 
                      id="degree" 
                      name="degree" 
                      defaultValue={doctor?.degree} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input 
                      id="institution" 
                      name="institution" 
                      defaultValue={doctor?.institution} 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">Years of Experience</Label>
                      <Input 
                        id="experience_years" 
                        name="experience_years" 
                        type="number" 
                        defaultValue={doctor?.experience_years} 
                        min="0" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select name="specialization" defaultValue={doctor?.specialization}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="panchakarma">Panchakarma</SelectItem>
                          <SelectItem value="nutrition">Ayurvedic Nutrition</SelectItem>
                          <SelectItem value="metabolism">Metabolic Disorders</SelectItem>
                          <SelectItem value="womens-health">Women's Health</SelectItem>
                          <SelectItem value="digestive">Digestive Health</SelectItem>
                          <SelectItem value="mental-health">Mental Wellness</SelectItem>
                          <SelectItem value="general">General Practice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea 
                      id="certifications" 
                      name="certifications" 
                      defaultValue={doctor?.certifications || ''} 
                      placeholder="Additional certifications and qualifications"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full mystic-glow transition-mystic">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;