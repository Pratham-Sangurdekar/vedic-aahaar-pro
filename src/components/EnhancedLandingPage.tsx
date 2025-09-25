import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/ayurvedic-spices-hero.jpg";
import { 
  ArrowRight, 
  Leaf, 
  Calculator, 
  Users, 
  User, 
  Sparkles, 
  Heart, 
  Brain,
  ChefHat,
  Stethoscope,
  Zap,
  Shield,
  Star,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { t } from "@/utils/translations";
import ThemeToggle from "./ThemeToggle";
import { useInView } from "react-intersection-observer";

// Individual feature tile component with scroll animation
const FeatureTile = ({ feature, index, isReversed, language }: {
  feature: any;
  index: number;
  isReversed: boolean;
  language: "en" | "hi";
}) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section 
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 px-4 sm:px-6 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Content Side */}
          <div className={`space-y-6 ${isReversed ? 'lg:col-start-2' : ''}`}>
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('ancientWisdom', language)}
            </Badge>
            
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-4 sm:mb-6">
              {feature.title}
            </h2>
            
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              {feature.description}
            </p>

            <div className="space-y-3 sm:space-y-4">
              {feature.benefits.map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-center text-sm sm:text-lg">
                  <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-primary mr-2 sm:mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-6 sm:mt-8 mystic-glow transition-mystic w-full sm:w-auto">
              Learn More
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>

          {/* Visual Side */}
          <div className={`${isReversed ? 'lg:col-start-1' : ''}`}>
            <Card className="mandala-shadow transition-all duration-500 hover:scale-105 border-border/50 group">
              <CardContent className="p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className={`inline-flex items-center justify-center w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-br ${feature.color} rounded-full mb-6 sm:mb-8 text-white shadow-lg relative z-10`}>
                  <div className="scale-110 sm:scale-125 md:scale-150">
                    {feature.icon}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 sanskrit-title">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                    Revolutionary AI-powered approach to ancient wisdom
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const EnhancedLandingPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [doctorsRef, doctorsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      title: t('aiDietGenerator', language),
      description: "AI-powered personalized diet plans based on ancient Vedic principles and your unique constitution.",
      icon: <Brain className="h-8 w-8" />,
      color: "from-green-500 to-emerald-600",
      benefits: ["Personalized meal plans", "Dosha-based recommendations", "24/7 AI guidance"]
    },
    {
      title: t('calorieTracker', language),
      description: "Track calories with Rasa and Guna classification according to Ayurvedic nutritional science.",
      icon: <Calculator className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      benefits: ["Smart calorie tracking", "Ayurvedic food analysis", "Progress monitoring"]
    },
    {
      title: t('doctorConnectivity', language),
      description: "Real-time connection with certified Ayurvedic practitioners and nutrition experts.",
      icon: <Stethoscope className="h-8 w-8" />,
      color: "from-blue-500 to-purple-600",
      benefits: ["Real-time consultation", "Expert guidance", "Personalized care"]
    }
  ];

  const doctors = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Panchakarma & Digestive Health",
      experience: "15 years",
      degree: "BAMS, MD (Ayurveda)",
      rating: 4.9,
      patients: 1200
    },
    {
      name: "Dr. Rajesh Kumar",
      specialization: "Metabolic Disorders & Weight Management", 
      experience: "12 years",
      degree: "BAMS, PhD (Ayurvedic Nutrition)",
      rating: 4.8,
      patients: 950
    },
    {
      name: "Dr. Meera Nair",
      specialization: "Women's Health & Hormonal Balance",
      experience: "18 years", 
      degree: "BAMS, MD (Stree Roga)",
      rating: 4.9,
      patients: 1500
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Users", icon: <Users className="h-6 w-6" /> },
    { number: "500+", label: "Recipes", icon: <ChefHat className="h-6 w-6" /> },
    { number: "50+", label: "Expert Doctors", icon: <Stethoscope className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="px-4 sm:px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold sanskrit-title gradient-text">
              {t('heroTitle', language)}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")} 
              className="transition-mystic text-xs sm:text-sm px-2 sm:px-4"
            >
              {t('login', language)}
            </Button>
            <Button 
              onClick={() => navigate("/auth")} 
              className="transition-mystic text-xs sm:text-sm px-2 sm:px-4"
            >
              {t('register', language)}
            </Button>
          </div>
        </div>
      </header>

      <div className="vedic-border"></div>

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`
          }}
        />
        
        {/* Animated overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background/80" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold sanskrit-title text-white mb-4 animate-fade-in">
              {t('heroTitle', language)}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl sanskrit-title text-white/90 mb-2">
              वेद-आहार
            </p>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-5xl font-semibold text-white mb-6 animate-fade-in">
            {t('heroSubtitle', language)}
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in">
            {t('heroDescription', language)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary-glow text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold mystic-glow transition-mystic w-full sm:w-auto"
            >
              {t('getStarted', language)}
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-mystic w-full sm:w-auto"
            >
              Watch Demo
              <Sparkles className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.number}</p>
                <p className="text-white/80 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section - Full Width Horizontal Tiles */}
      <section className="space-y-0">
        {features.map((feature, index) => (
          <FeatureTile 
            key={index} 
            feature={feature} 
            index={index} 
            isReversed={index % 2 === 1}
            language={language}
          />
        ))}
      </section>

      {/* Enhanced Doctors Section */}
      <section 
        ref={doctorsRef}
        className={`py-12 sm:py-20 px-4 sm:px-6 bg-muted/30 transition-all duration-1000 ${
          doctorsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-primary/20">
              <Heart className="h-4 w-4 mr-2" />
              {t('expertGuidance', language)}
            </Badge>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-4 sm:mb-6">
              Meet Our Ayurvedic Experts
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from certified practitioners who blend traditional Ayurvedic knowledge with modern nutritional science
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {doctors.map((doctor, index) => (
              <Card 
                key={index} 
                className={`mandala-shadow transition-all duration-500 hover:scale-105 group ${
                  doctorsInView ? 'animate-scale-in' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 text-center relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-6 text-white shadow-lg">
                      <User className="h-12 w-12" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 sanskrit-title">
                      {doctor.name}
                    </h3>
                    
                    <p className="text-primary font-medium mb-2">
                      {doctor.specialization}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                      <span className="text-xs text-muted-foreground">({doctor.patients} patients)</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {doctor.experience} experience
                    </p>
                    
                    <Badge variant="secondary" className="text-xs mb-4">
                      {doctor.degree}
                    </Badge>

                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-mystic">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Consult Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-8 text-white animate-pulse">
            <Zap className="h-10 w-10" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold sanskrit-title gradient-text mb-4 sm:mb-6">
            {t('startYourJourney', language)}
          </h2>
          
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their health through personalized Ayurvedic nutrition powered by AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold mystic-glow transition-mystic w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-mystic w-full sm:w-auto"
            >
              Book Consultation
              <Heart className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-border bg-background">
        <div className="vedic-border"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold sanskrit-title gradient-text">
                  {t('heroTitle', language)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Bridging ancient Ayurvedic wisdom with modern nutritional science for holistic wellness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">Diet Generator</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Calorie Tracker</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Expert Network</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Real-time Chat</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">About Ayurveda</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Research</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">About</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Ved-Aahaar. Honoring the wisdom of Ayurveda for modern wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;