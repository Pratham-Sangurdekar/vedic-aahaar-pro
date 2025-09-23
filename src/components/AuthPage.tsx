import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    userType: currentUserType, 
    loading, 
    signInPatient, 
    signInDoctor, 
    signUpPatient, 
    signUpDoctor 
  } = useAuth();
  
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (user && currentUserType) {
      if (currentUserType === 'patient') {
        navigate('/patient/dashboard');
      } else if (currentUserType === 'doctor') {
        navigate('/doctor/dashboard');
      }
    }
  }, [user, currentUserType, navigate]);

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isLogin) {
      const { error } = await signInPatient(email, password);
      if (!error) {
        navigate('/patient/dashboard');
      }
    } else {
      const name = formData.get('name') as string;
      const age = parseInt(formData.get('age') as string);
      const gender = formData.get('gender') as string;
      const food_preferences = formData.get('dietary') as string;

      const { error } = await signUpPatient({
        name,
        email,
        password,
        age,
        gender,
        food_preferences,
      });
      
      if (!error) {
        setIsLogin(true);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('doctor-email') as string;
    const password = formData.get('doctor-password') as string;

    if (isLogin) {
      const { error } = await signInDoctor(email, password);
      if (!error) {
        navigate('/doctor/dashboard');
      }
    } else {
      const name = formData.get('doctor-name') as string;
      const degree = formData.get('degrees') as string;
      const institution = formData.get('college') as string;
      const experience_years = parseInt(formData.get('experience') as string);
      const specialization = formData.get('specialization') as string;
      const certifications = formData.get('certifications') as string;

      const { error } = await signUpDoctor({
        name,
        email,
        password,
        degree,
        institution,
        experience_years,
        specialization,
        certifications,
      });
      
      if (!error) {
        setIsLogin(true);
      }
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-6">
      {/* Mystical background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute -top-12 left-0 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold sanskrit-title gradient-text">Ved-Aahaar</h1>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back to your wellness journey" : "Begin your Ayurvedic wellness journey"}
          </p>
        </div>

        <Card className="mandala-shadow border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="sanskrit-title text-2xl">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Access your personalized Ayurvedic wellness platform" 
                : "Join the Ved-Aahaar community for holistic nutrition guidance"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="patient" onValueChange={(value) => setUserType(value as "patient" | "doctor")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="sanskrit-title">Patient</TabsTrigger>
                <TabsTrigger value="doctor" className="sanskrit-title">Doctor</TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" type="text" placeholder="Enter your full name" required />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" name="age" type="number" placeholder="Age" min="1" max="120" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select name="gender" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dietary">Dietary Preferences</Label>
                        <Select name="dietary">
                          <SelectTrigger>
                            <SelectValue placeholder="Select dietary preferences" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="omnivore">Omnivore</SelectItem>
                            <SelectItem value="jain">Jain</SelectItem>
                            <SelectItem value="raw">Raw Food</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full transition-mystic">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </>
                    ) : (
                      isLogin ? "Sign In" : "Create Patient Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-name">Full Name</Label>
                        <Input id="doctor-name" name="doctor-name" type="text" placeholder="Dr. Full Name" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="degrees">Degree(s)</Label>
                        <Input id="degrees" name="degrees" placeholder="e.g., BAMS, MD (Ayurveda)" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input id="experience" name="experience" type="number" placeholder="Years" min="0" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="college">College/Institute</Label>
                          <Input id="college" name="college" placeholder="Educational Institution" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select name="specialization" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
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

                      <div className="space-y-2">
                        <Label htmlFor="certifications">Certifications (Optional)</Label>
                        <Input id="certifications" name="certifications" placeholder="e.g., Certified Ayurvedic Practitioner" />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input id="doctor-email" name="doctor-email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input id="doctor-password" name="doctor-password" type="password" placeholder="Enter your password" required />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full transition-mystic">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </>
                    ) : (
                      isLogin ? "Sign In" : "Register as Doctor"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-primary transition-mystic"
              >
                {isLogin 
                  ? "Don't have an account? Create one" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;