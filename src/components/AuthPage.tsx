import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ArrowLeft } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [isLogin, setIsLogin] = useState(true);

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to patient dashboard
    navigate("/patient/dashboard");
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to doctor dashboard  
    navigate("/doctor/dashboard");
  };

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
            <img src={logoImage} alt="Ved-Aahaar" className="h-8 w-8" />
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
                      <Input id="name" type="text" placeholder="Enter your full name" required />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" required />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" placeholder="Age" min="1" max="120" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select required>
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
                        <Select>
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

                  <Button type="submit" className="w-full transition-mystic">
                    {isLogin ? "Sign In" : "Create Patient Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-name">Full Name</Label>
                        <Input id="doctor-name" type="text" placeholder="Dr. Full Name" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="degrees">Degree(s)</Label>
                        <Input id="degrees" placeholder="e.g., BAMS, MD (Ayurveda)" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input id="experience" type="number" placeholder="Years" min="0" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registration">Registration No.</Label>
                          <Input id="registration" placeholder="Reg. Number" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="college">College/Institute</Label>
                        <Input id="college" placeholder="Educational Institution" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select required>
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
                        <Label htmlFor="certificates">Upload Certificates</Label>
                        <div className="flex items-center justify-center w-full">
                          <Label
                            htmlFor="certificates"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-mystic"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> certificates
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 10MB)</p>
                            </div>
                            <Input id="certificates" type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                          </Label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input id="doctor-email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input id="doctor-password" type="password" placeholder="Enter your password" required />
                  </div>

                  <Button type="submit" className="w-full transition-mystic">
                    {isLogin ? "Sign In" : "Register as Doctor"}
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