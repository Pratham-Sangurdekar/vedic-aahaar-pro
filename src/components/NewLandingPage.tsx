import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calculator, MessageSquare, Users, Star, ArrowRight, FileText, Brain, Heart, Download, Play, ChefHat, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ayurvedicSpicesHero from '@/assets/ayurvedic-spices-hero.jpg';
import calorieTracker from '@/assets/calorie_tracker.jpg';
import utensil2 from '@/assets/utensil2.jpg';
import gyan from '@/assets/gyan.jpg';
import expert from '@/assets/expert.jpg';

import tracker from '@/assets/tracker.jpg';
import Navbar from './Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import ConsultationModal from './ConsultationModal';

const NewLandingPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
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

      {/* Divider below header */}
      <div className="vedic-border" />

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
        
        {/* Removed inner divider; global divider placed under navbar */}
        
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="sanskrit-title text-6xl md:text-8xl font-bold mb-4 text-white drop-shadow-lg">
            {language === 'en' ? 'Ved-Aahaar' : 'वेद-आहार'}
          </h1>
          <p className="text-xl md:text-l text-white/90 mb-8 max-w-l mx-auto leading-relaxed">
            {language === 'en' 
              ? 'वेद आहार - Ancient Ayurvedic wisdom meets modern technology for personalized nutrition and holistic wellness '
              : 'प्राचीन आयुर्वेदिक ज्ञान और आधुनिक तकनीक का संगम—व्यक्तिगत पोषण और समग्र स्वास्थ्य के लिए'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="cta"
              className="px-8 py-4 text-lg mystic-glow transition-mystic"
              onClick={handleBookConsultation}
            >
              {language === 'en' ? 'Book Consultation' : 'परामर्श बुक करें'}
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="hero"
              className="px-8 py-4 text-lg transition-mystic"
              onClick={handleGetStarted}
            >
              {language === 'en' ? 'Begin Your Journey' : 'अपनी यात्रा शुरू करें'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

      </section>

      {/* Yojan - AI Diet Generator Section (centered style to match Recipes/Gyan) */}
      <section 
        id="diet-generator" 
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible['diet-generator'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <img src={calorieTracker} alt="Herbs and spices" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/85 to-white/0" />
        </div>
        <div className="relative container mx-auto max-w-7xl text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <Brain className="h-10 w-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            {language === 'en' ? 'AI-Powered Diet Generator' : 'एआई संचालित आहार जनरेटर'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-l mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Personalized Ayurvedic meal plans crafted by AI that understands your constitution, goals, and preferences.'
              : 'एआई द्वारा बनाए गए व्यक्तिगत आयुर्वेदिक आहार योजनाएँ जो आपकी प्रकृति, लक्ष्यों और पसंद को समझती हैं।'}
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-12 max-w-3xl">
            <li className="text-white/90">{language === 'en' ? 'Dosha-based planning' : 'दोष आधारित योजना'}</li>
            <li className="text-white/90">{language === 'en' ? 'Custom recipes with benefits' : 'लाभों सहित कस्टम रेसिपी'}</li>
            <li className="text-white/90">{language === 'en' ? 'Seasonal recommendations' : 'मौसमी अनुशंसाएँ'}</li>
          </ul>
         

          {/* Mini Chart Card (Dosha Bars) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="mandala-shadow border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vata</span>
                    <div className="w-56 h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-emerald-500 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pitta</span>
                    <div className="w-56 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-amber-500 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kapha</span>
                    <div className="w-56 h-2 bg-cyan-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-cyan-500 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ankh - Calorie Tracker Section (centered style) */}
      <section 
        id="calorie-tracker" 
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible['calorie-tracker'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <img src={tracker} alt="Healthy ingredients" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-black/0" />
        </div>
        <div className="relative container mx-auto max-w-7xl text-right">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <Calculator className="h-10 w-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            {language === 'en' ? 'Ayurvedic Calorie Tracker' : 'आयुर्वेदिक कैलोरी ट्रैकर'}
          </h2>
          <h3 className="text-xl text-muted-foreground mb-6 max-w-l text-right ">
            {language === 'en' 
              ? 'Track your daily nutrition with rasa and guna analysis. Maintain balance according to Ayurvedic wisdom.'
              : 'रसा और गुण के विश्लेषण के साथ अपना दैनिक पोषण ट्रैक करें। आयुर्वेदिक सिद्धांतों के अनुसार संतुलन बनाए रखें।'}
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-12 max-w-3xl ml-right text-right">
            <li className="text-white/90">{language === 'en' ? 'Six-taste balancing' : 'षड्रस संतुलन'}</li>
            <li className="text-white/90">{language === 'en' ? 'Guna (qualities) analysis' : 'गुणों का विश्लेषण'}</li>
            <li className="text-white/90">{language === 'en' ? 'Daily progress monitoring' : 'दैनिक प्रगति निगरानी'}</li>
          </ul>
          

          {/* Mini Chart Card (Rasa Percentages) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="mandala-shadow border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[
                    { label: language === 'en' ? 'Sweet (Madhura)' : 'मधुर', value: '65%' },
                    { label: language === 'en' ? 'Sour (Amla)' : 'आम्ल', value: '15%' },
                    { label: language === 'en' ? 'Salty (Lavana)' : 'लवण', value: '10%' },
                    { label: language === 'en' ? 'Pungent (Katu)' : 'कटु', value: '8%' },
                    { label: language === 'en' ? 'Bitter (Tikta)' : 'तिक्त', value: '6%' },
                    { label: language === 'en' ? 'Astringent (Kashaya)' : 'कषाय', value: '4%' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-amber-200/50 dark:border-amber-800/30">
                      <div className="text-xs text-muted-foreground mb-2">{item.label}</div>
                      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div className="h-2 bg-amber-500 rounded-full" style={{width: item.value}}></div>
                      </div>
                      <div className="text-right text-xs mt-1 text-muted-foreground">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sambandh - Doctor Connectivity Section (centered style) */}
      <section 
        id="doctor-connectivity" 
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible['doctor-connectivity'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <img src={expert} alt="Consultation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/0" />
        </div>
        <div className="relative container mx-auto max-w-7xl text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            {language === 'en' ? 'Expert Connectivity & Real-Time Chat' : 'विशेषज्ञ कनेक्टिविटी और रीयल-टाइम चैट'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-left leading-relaxed">
            {language === 'en' 
              ? 'Connect with certified Ayurvedic practitioners for consultations, share files, and get expert advice.'
              : 'प्रमाणित आयुर्वेदिक विशेषज्ञों से परामर्श करें, फ़ाइलें साझा करें और विशेषज्ञ सलाह प्राप्त करें।'}
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-12 max-w-3xl">
            <li className="text-white/90">{language === 'en' ? 'Real-time doctor chat' : 'रीयल-टाइम डॉक्टर चैट'}</li>
            <li className="text-white/90">{language === 'en' ? 'File/PDF sharing' : 'फ़ाइल/पीडीएफ साझा करना'}</li>
            <li className="text-white/90">{language === 'en' ? 'Consultation scheduling' : 'परामर्श शेड्यूलिंग'}</li>
          </ul>
          

          {/* Mini Chart Card (Doctor Availability) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="mandala-shadow border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">DS</div>
                      <div>
                        <div className="text-sm font-medium">Dr. Sunita Sharma</div>
                        <div className="text-xs text-muted-foreground">{language === 'en' ? 'Digestive Health' : 'पाचन स्वास्थ्य'}</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{language === 'en' ? 'Online' : 'ऑनलाइन'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs">RK</div>
                      <div>
                        <div className="text-sm font-medium">Dr. Rajesh Kumar</div>
                        <div className="text-xs text-muted-foreground">{language === 'en' ? 'Metabolic Specialist' : 'मेटाबॉलिक विशेषज्ञ'}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{language === 'en' ? 'Available' : 'उपलब्ध'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <br />
            <Button 
            size="lg" 
            variant="cta"
            onClick={() => handleFeatureClick('doctor-connectivity')}
            className="px-8 py-4 text-lg transition-mystic shadow-lg hover:shadow-xl"
          >
            {language === 'en' ? 'Find a Doctor' : 'डॉक्टर खोजें'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          </div>
        </div>
      </section>

      
      {/* Recipes Section - Horizontal */}
      <section 
        id="recipes-section" 
        className="relative py-20 px-4"
      >
        <div className="absolute inset-0">
          <img src={utensil2} alt="Recipe spread" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-black/0" />
        </div>
        <div className="relative container mx-auto max-w-7xl text-right">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <ChefHat className="h-10 w-10" />
          </div>
          
          
          
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            Ayurvedic Recipes
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3l text-right">
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
          
          
        </div>
      </section>

      {/* Gyan Section - Horizontal */}
      <section 
        id="gyan-section" 
        className="relative py-20 px-4"
      >
        <div className="absolute inset-0">
          <img src={gyan} alt="Scrolls and learning" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/0" />
        </div>
        <div className="relative container mx-auto max-w-7xl text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-8 text-white shadow-lg animate-pulse">
            <BookOpen className="h-10 w-10" />
          </div>
          
         
          
          <h2 className="text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-6">
            Ayurvedic Gyan
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
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
              © 2025 Ved-Aahaar. All rights reserved. Made by CodeBlooders for holistic wellness.
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