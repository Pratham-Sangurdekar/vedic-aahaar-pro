import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import logoImage from "@/assets/logo.png";
import { 
  Calendar, 
  TrendingUp, 
  Heart, 
  Brain, 
  Sparkles,
  User, 
  ChefHat,
  Calculator,
  Stethoscope,
  Moon,
  Sun,
  Settings,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const recipes = [
    {
      title: "Golden Turmeric Milk",
      description: "Soothing anti-inflammatory drink perfect for evening relaxation and joint health.",
      rasa: "Sweet, Bitter",
      guna: "Heavy, Oily",
      effect: "Kapha-Pitta balancing",
      calories: 150,
      time: "5 mins",
      author: "Dr. Priya Sharma"
    },
    {
      title: "Ayurvedic Quinoa Bowl",
      description: "Nutrient-rich bowl with seasonal vegetables and digestive spices.",
      rasa: "Sweet, Astringent",
      guna: "Light, Dry",
      effect: "Vata-Pitta balancing",
      calories: 320,
      time: "25 mins",
      author: "Dr. Rajesh Kumar"
    },
    {
      title: "Cooling Cucumber Raita",
      description: "Traditional yogurt-based side dish to balance excess heat and support digestion.",
      rasa: "Sweet, Astringent",
      guna: "Cool, Heavy",
      effect: "Pitta pacifying",
      calories: 80,
      time: "10 mins",
      author: "Dr. Meera Nair"
    }
  ];

  const doctorPosts = [
    {
      author: "Dr. Priya Sharma",
      title: "Understanding Your Dosha Constitution",
      content: "Each individual has a unique constitution (Prakriti) that determines their optimal diet and lifestyle. Understanding whether you're predominantly Vata, Pitta, or Kapha helps in creating personalized nutrition plans.",
      time: "2 hours ago",
      likes: 24,
      comments: 8
    },
    {
      author: "Dr. Rajesh Kumar", 
      title: "Seasonal Eating According to Ayurveda",
      content: "Ayurveda emphasizes eating according to seasons. As we transition into autumn, focus on warm, grounding foods like root vegetables, warming spices, and cooked grains to balance increasing Vata.",
      time: "1 day ago",
      likes: 31,
      comments: 12
    }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-background transition-mystic ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="Ved-Aahaar" className="h-8 w-8" />
            <h1 className="text-2xl font-bold sanskrit-title gradient-text">Ved-Aahaar</h1>
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
              variant={activeTab === "doctor" ? "default" : "ghost"}
              onClick={() => setActiveTab("doctor")}
              className="sanskrit-title transition-mystic"
            >
              Vaidya
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className="sanskrit-title transition-mystic"
            >
              Swaroop
            </Button>
          </nav>

          <Button variant="outline" onClick={() => navigate("/")} className="transition-mystic">
            Logout
          </Button>
        </div>
      </header>

      <div className="vedic-border"></div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
                Welcome back, Arjun
              </h2>
              <p className="text-muted-foreground text-lg">
                Continue your Ayurvedic wellness journey
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
                  <h3 className="font-semibold mb-2">Recipes Tried</h3>
                  <p className="text-2xl font-bold text-secondary">15</p>
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
                {recipes.map((recipe, index) => (
                  <Card key={index} className="mandala-shadow transition-mystic hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sanskrit-title">{recipe.title}</CardTitle>
                        <ChefHat className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rasa</p>
                          <p className="text-sm">{recipe.rasa}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Guna</p>
                          <p className="text-sm">{recipe.guna}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-medium">{recipe.effect}</span>
                        <span className="text-muted-foreground">{recipe.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{recipe.calories} cal</Badge>
                        <p className="text-xs text-muted-foreground">by {recipe.author}</p>
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
                {doctorPosts.map((post, index) => (
                  <Card key={index} className="mandala-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold sanskrit-title">{post.author}</h4>
                            <span className="text-sm text-muted-foreground">{post.time}</span>
                          </div>
                          <h5 className="font-medium text-primary">{post.title}</h5>
                          <p className="text-muted-foreground">{post.content}</p>
                          <div className="flex items-center space-x-4 pt-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments}
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Health Goal</Label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option>Weight Management</option>
                      <option>Digestive Health</option>
                      <option>Energy & Vitality</option>
                      <option>Stress Management</option>
                      <option>General Wellness</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Concern</Label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option>Irregular Digestion</option>
                      <option>Low Energy</option>
                      <option>Sleep Issues</option>
                      <option>Stress & Anxiety</option>
                      <option>Joint Pain</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Food Preferences & Restrictions</Label>
                  <Textarea placeholder="e.g., allergic to nuts, prefer warm foods, avoid dairy..." />
                </div>
                
                <Button className="w-full mystic-glow transition-mystic" size="lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Diet Plan
                </Button>
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
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dark-mode"
                          checked={isDarkMode}
                          onCheckedChange={toggleTheme}
                        />
                        <Label htmlFor="dark-mode" className="flex items-center space-x-2">
                          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                          <span>Dark Mode</span>
                        </Label>
                      </div>
                      
                      <Button className="transition-mystic">
                        <Settings className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </div>
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