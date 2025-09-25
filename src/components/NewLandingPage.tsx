import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calculator, MessageSquare, Users, Star, ArrowRight, FileText, Brain, Heart, Download, Play, ChefHat, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ayurvedicSpicesHero from '@/assets/ayurvedic-spices-hero.jpg';
import Navbar from './Navbar';
import ConsultationModal from './ConsultationModal';

const NewLandingPage = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = ['hero', 'diet-generator', 'calorie-tracker', 'doctor-connectivity', 'chat-feature'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (userType === 'patient') {
        navigate('/patient/dashboard');
      } else if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleFeatureClick = (feature: string) => {
    if (user) {
      if (userType === 'patient') {
        navigate('/patient/dashboard');
      } else if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleBookConsultation = () => {
    // Always show consultation modal for booking
    setIsConsultationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Aarambh */}
      <section 
        id="hero" 
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <img
            src={ayurvedicSpicesHero}
            alt="Ayurvedic spices in traditional bowls"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Vedic frieze divider */}
        <div className="absolute top-20 left-0 right-0 vedic-border"></div>
        
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="sanskrit-title text-6xl md:text-8xl font-bold mb-4 text-white drop-shadow-lg">
            Ved-Aahaar
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            वेद आहार - Ancient Ayurvedic wisdom meets modern technology for personalized nutrition and holistic wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="cta"
              className="px-8 py-4 text-lg mystic-glow transition-mystic"
              onClick={handleBookConsultation}
            >
              Book Consultation
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="hero"
              className="px-8 py-4 text-lg transition-mystic"
              onClick={handleGetStarted}
            >
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

      </section>

      {/* Yojan - AI Diet Generator Section */}
      <section 
        id="diet-generator" 
        className={`min-h-screen w-full py-20 px-4 transition-all duration-1000 ${
          isVisible['diet-generator'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } bg-background`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Brain className="h-4 w-4 mr-2" />
                Yojan - AI Powered
              </Badge>
              
              <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
                AI-Powered Diet Generator
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                Experience personalized Ayurvedic meal plans crafted by AI that understands your unique constitution, health goals, and dietary preferences. Get custom recipes with detailed ingredient benefits and step-by-step preparation guidance.
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Personalized dosha-based meal planning</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Custom recipes with Ayurvedic benefits</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Seasonal ingredient recommendations</span>
                </div>
              </div>

              <Button 
                size="lg" 
                variant="cta"
                className="mt-8 transition-mystic"
                onClick={() => handleFeatureClick('diet-generator')}
              >
                Try Generator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Visual Side - Mock UI Screenshot */}
            <div className="relative">
              <Card className="mandala-shadow transition-all duration-500 hover:scale-105 border-border/50">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-8 text-white shadow-lg">
                      <Brain className="h-16 w-16" />
                    </div>
                    
                    <h3 className="text-3xl font-semibold mb-4 sanskrit-title">
                      Smart AI Analysis
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Advanced algorithms analyze your constitution and generate personalized Ayurvedic meal plans
                    </p>
                    
                    {/* Mock UI Elements */}
                    <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vata Balance:</span>
                        <div className="w-24 h-2 bg-green-200 rounded-full">
                          <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pitta Balance:</span>
                        <div className="w-24 h-2 bg-yellow-200 rounded-full">
                          <div className="w-18 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Kapha Balance:</span>
                        <div className="w-24 h-2 bg-blue-200 rounded-full">
                          <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ankh - Calorie Tracker Section */}
      <section 
        id="calorie-tracker" 
        className={`min-h-screen w-full py-20 px-4 transition-all duration-1000 ${
          isVisible['calorie-tracker'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } bg-muted/20`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Side - Mock UI Screenshot */}
            <div className="relative order-2 lg:order-1">
              <Card className="mandala-shadow transition-all duration-500 hover:scale-105 border-border/50">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-8 text-white shadow-lg">
                      <Calculator className="h-16 w-16" />
                    </div>
                    
                    <h3 className="text-3xl font-semibold mb-4 sanskrit-title">
                      Ayurvedic Tracking
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Track calories with Rasa and Guna classification according to ancient nutritional wisdom
                    </p>
                    
                    {/* Mock Daily Log */}
                    <div className="bg-muted rounded-lg p-4 text-left space-y-3">
                      <div className="text-sm font-medium text-center mb-2">Today's Intake</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sweet (Madhura):</span>
                        <Badge variant="secondary">65%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sour (Amla):</span>
                        <Badge variant="secondary">15%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Salty (Lavana):</span>
                        <Badge variant="secondary">10%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pungent (Katu):</span>
                        <Badge variant="secondary">8%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Side */}
            <div className="space-y-6 order-1 lg:order-2">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Calculator className="h-4 w-4 mr-2" />
                Ankh - Ayurvedic Analytics
              </Badge>
              
              <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
                Ayurvedic Calorie Tracker
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                Track your daily nutrition with Ayurvedic principles, including rasa and guna analysis. Monitor macro and micronutrients while maintaining perfect balance according to ancient wisdom and your unique constitution.
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Six-taste (Rasa) balance tracking</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Guna (qualities) analysis</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Daily progress monitoring</span>
                </div>
              </div>

              <Button 
                size="lg" 
                variant="cta"
                className="mt-8 transition-mystic"
                onClick={() => handleFeatureClick('calorie-tracker')}
              >
                Track Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sambandh - Doctor Connectivity Section */}
      <section 
        id="doctor-connectivity" 
        className={`min-h-screen w-full py-20 px-4 transition-all duration-1000 ${
          isVisible['doctor-connectivity'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } bg-background`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Sambandh - Doctor Network
              </Badge>
              
              <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
                Expert Connectivity & Real-Time Chat
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                Connect with certified Ayurvedic practitioners for personalized guidance, consultations, and real-time chat support. Share files, receive custom diet charts, and get expert advice whenever you need it.
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Real-time chat with certified doctors</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>File sharing and PDF attachments</span>
                </div>
                <div className="flex items-center text-lg">
                  <Sparkles className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span>Personalized consultation scheduling</span>
                </div>
              </div>

              <Button 
                size="lg" 
                variant="cta"
                className="mt-8 transition-mystic"
                onClick={() => handleFeatureClick('doctor-connectivity')}
              >
                Find a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Visual Side - Doctor Profiles */}
            <div className="relative">
              <Card className="mandala-shadow transition-all duration-500 hover:scale-105 border-border/50">
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
                  
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 text-white shadow-lg">
                        <MessageSquare className="h-16 w-16" />
                      </div>
                      <h3 className="text-3xl font-semibold sanskrit-title">
                        Expert Network
                      </h3>
                    </div>
                    
                    {/* Mock Doctor Cards */}
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          DS
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Dr. Sunita Sharma</div>
                          <div className="text-sm text-muted-foreground">Digestive Health Expert</div>
                        </div>
                        <Badge variant="secondary">Online</Badge>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                          RK
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Dr. Rajesh Kumar</div>
                          <div className="text-sm text-muted-foreground">Metabolic Specialist</div>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Chat Feature Section */}
      <section 
        id="chat-feature" 
        className={`w-full py-20 px-4 transition-all duration-1000 ${
          isVisible['chat-feature'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } bg-muted/20`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
              Instant Consults & File Exchange
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience seamless communication with your Ayurvedic practitioners through our advanced real-time chat system with file sharing capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="mandala-shadow transition-all duration-500 hover:scale-105">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Messaging</h3>
                <p className="text-muted-foreground">Real-time chat with typing indicators and read receipts</p>
              </CardContent>
            </Card>

            <Card className="mandala-shadow transition-all duration-500 hover:scale-105">
              <CardContent className="p-6 text-center">
                <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">PDF Exchange</h3>
                <p className="text-muted-foreground">Share diet charts, prescriptions, and medical documents</p>
              </CardContent>
            </Card>

            <Card className="mandala-shadow transition-all duration-500 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Follow-up Care</h3>
                <p className="text-muted-foreground">Appointment scheduling and continuous health monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recipes Section - Horizontal */}
      <section 
        id="recipes-section" 
        className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20"
      >
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <ChefHat className="h-10 w-10" />
          </div>
          
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            <ChefHat className="h-4 w-4 mr-2" />
            Traditional Recipes Collection
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            Ayurvedic Recipes
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover time-honored recipes crafted to balance your doshas and nourish your body. Each recipe includes detailed ingredient benefits, preparation methods, and seasonal recommendations from certified Ayurvedic practitioners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            {[
              { 
                title: "Golden Turmeric Milk", 
                dosha: "Vata & Kapha", 
                time: "5 mins",
                description: "Anti-inflammatory nighttime elixir with warm spices"
              },
              { 
                title: "Tri-Dosha Kitchari", 
                dosha: "All Doshas", 
                time: "30 mins",
                description: "Complete protein meal with rice, lentils, and healing spices"
              },
              { 
                title: "Cooling Mint Chutney", 
                dosha: "Pitta", 
                time: "10 mins",
                description: "Refreshing digestive aid perfect for summer meals"
              }
            ].map((recipe, index) => (
              <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-orange-200 dark:border-orange-800/30 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{recipe.title}</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">Best for {recipe.dosha}</p>
                <p className="text-xs text-muted-foreground mb-3">⏱️ {recipe.time}</p>
                <p className="text-sm text-muted-foreground">{recipe.description}</p>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            variant="cta"
            onClick={() => handleFeatureClick('recipes')}
            className="px-8 py-4 text-lg transition-mystic shadow-lg hover:shadow-xl"
          >
            Explore All Recipes
            <ChefHat className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Gyan Section - Horizontal */}
      <section 
        id="gyan-section" 
        className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20"
      >
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <BookOpen className="h-10 w-10" />
          </div>
          
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <BookOpen className="h-4 w-4 mr-2" />
            Ancient Wisdom Knowledge Center
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            Ayurvedic Gyan
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Dive deep into the fundamentals of Ayurveda through interactive learning modules. Master the principles of constitutional analysis, seasonal eating, rasa balance, and the timeless science of holistic healing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
            {[
              { 
                title: "Dosha Constitution", 
                icon: "🧘‍♂️",
                lessons: "12 Lessons",
                description: "Understand Vata, Pitta, and Kapha fundamentals"
              },
              { 
                title: "Six Tastes (Rasa)", 
                icon: "👅", 
                lessons: "8 Lessons",
                description: "Master the art of taste balancing for health"
              },
              { 
                title: "Seasonal Eating", 
                icon: "🌱", 
                lessons: "6 Lessons",
                description: "Align your diet with natural rhythms"
              },
              { 
                title: "Food Combining", 
                icon: "🍽️", 
                lessons: "10 Lessons",
                description: "Learn proper food combinations for digestion"
              }
            ].map((module, index) => (
              <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-emerald-200 dark:border-emerald-800/30 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                <div className="text-3xl mb-4">{module.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{module.title}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">{module.lessons}</p>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            variant="cta"
            onClick={() => handleFeatureClick('gyan')}
            className="px-8 py-4 text-lg transition-mystic shadow-lg hover:shadow-xl"
          >
            Begin Learning Journey
            <BookOpen className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-8 text-white animate-pulse">
            <Sparkles className="h-10 w-10" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            Begin Your Ayurvedic Journey
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their health through personalized Ayurvedic nutrition powered by AI and guided by expert practitioners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="cta"
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold transition-mystic"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleBookConsultation}
              className="px-8 py-4 text-lg font-semibold transition-mystic"
            >
              Book Consultation
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-border bg-background">
        <div className="vedic-border"></div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold sanskrit-title gradient-text text-lg">Ved-Aahaar</h4>
              <p className="text-muted-foreground text-sm">
                Bridging ancient Ayurvedic wisdom with modern nutritional science for holistic wellness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#diet-generator" className="hover:text-primary transition-mystic">Diet Generator</a></li>
                <li><a href="#calorie-tracker" className="hover:text-primary transition-mystic">Calorie Tracker</a></li>
                <li><a href="#doctor-connectivity" className="hover:text-primary transition-mystic">Doctor Network</a></li>
                <li><a href="/recipes" className="hover:text-primary transition-mystic">Recipes</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">Newsletter</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Community</a></li>
                <li><a href="/gyan" className="hover:text-primary transition-mystic">Gyan Center</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Ved-Aahaar. All rights reserved. Made with ❤️ for holistic wellness.
            </p>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </div>
  );
};

export default NewLandingPage;