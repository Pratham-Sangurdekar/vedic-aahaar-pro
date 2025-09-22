import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/ayurvedic-spices-hero.jpg";
import { ArrowRight, Leaf, Calculator, Users, User, Sparkles, Heart, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Ayurvedic Diet Generator",
      description: "AI-powered personalized diet plans based on ancient Vedic principles and your unique constitution.",
      icon: <Leaf className="h-8 w-8" />,
      image: "Generate custom meal plans that balance your doshas and promote holistic wellness."
    },
    {
      title: "Ayurvedic Calorie Tracker", 
      description: "Track calories with Rasa and Guna classification according to Ayurvedic nutritional science.",
      icon: <Calculator className="h-8 w-8" />,
      image: "Monitor your nutrition through the lens of ancient wisdom with modern precision."
    },
    {
      title: "Doctors & Dietitians Network",
      description: "Connect with certified Ayurvedic practitioners and nutrition experts for personalized guidance.",
      icon: <Users className="h-8 w-8" />,
      image: "Expert guidance from qualified Ayurvedic doctors and certified nutritionists."
    }
  ];

  const doctors = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Panchakarma & Digestive Health",
      experience: "15 years",
      degree: "BAMS, MD (Ayurveda)"
    },
    {
      name: "Dr. Rajesh Kumar",
      specialization: "Metabolic Disorders & Weight Management", 
      experience: "12 years",
      degree: "BAMS, PhD (Ayurvedic Nutrition)"
    },
    {
      name: "Dr. Meera Nair",
      specialization: "Women's Health & Hormonal Balance",
      experience: "18 years", 
      degree: "BAMS, MD (Stree Roga)"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold sanskrit-title gradient-text">
              Ved-Aahaar
            </h1>
            <span className="text-sm text-muted-foreground sanskrit-title">वेद-आहार</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/auth")} className="transition-mystic">
              Login
            </Button>
            <Button onClick={() => navigate("/auth")} className="transition-mystic">
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Vedic Frieze Border */}
      <div className="vedic-border"></div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`
          }}
        />
        
        {/* Mystic overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background/80" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-bold sanskrit-title text-white mb-4">
              Ved-Aahaar
            </h1>
            <p className="text-xl md:text-2xl sanskrit-title text-white/90 mb-2">
              वेद-आहार
            </p>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
            Holistic Nutrition. Rooted in Ayurveda. Powered by AI.
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover personalized nutrition plans that honor ancient Vedic wisdom while embracing modern technology for optimal health and wellness.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg font-semibold mystic-glow transition-mystic"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Vedic Technology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold sanskrit-title gradient-text mb-6">
              Ancient Wisdom, Modern Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the perfect fusion of 5000-year-old Ayurvedic principles with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="mandala-shadow transition-mystic hover:scale-105 border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 sanskrit-title">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {feature.image}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-primary/20">
              <Heart className="h-4 w-4 mr-2" />
              Expert Guidance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold sanskrit-title gradient-text mb-6">
              Meet Our Ayurvedic Experts
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from certified practitioners who blend traditional Ayurvedic knowledge with modern nutritional science
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <Card key={index} className="mandala-shadow transition-mystic hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-6 text-white">
                    <User className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 sanskrit-title">
                    {doctor.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {doctor.experience} experience
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {doctor.degree}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-8 text-white">
            <Brain className="h-10 w-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold sanskrit-title gradient-text mb-6">
            Begin Your Ayurvedic Journey
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their health through personalized Ayurvedic nutrition
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white px-8 py-6 text-lg font-semibold mystic-glow transition-mystic"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="vedic-border"></div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold sanskrit-title gradient-text">Ved-Aahaar</span>
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
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">About Ayurveda</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Research</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 sanskrit-title">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-mystic">About</a></li>
                <li><a href="#" className="hover:text-primary transition-mystic">Privacy Policy</a></li>
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

export default LandingPage;