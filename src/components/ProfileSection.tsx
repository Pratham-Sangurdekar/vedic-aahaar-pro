import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Camera, 
  Save, 
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Stethoscope,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/utils/translations';

interface PatientProfile {
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
  profile_pic_url?: string;
  created_at: string;
}

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  degree: string;
  institution: string;
  experience_years: number;
  specialization: string;
  certifications?: string;
  profile_pic_url?: string;
  created_at: string;
}

interface ProfileSectionProps {
  userType: 'patient' | 'doctor';
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userType }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTheme();
  const [profile, setProfile] = useState<PatientProfile | DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const tableName = userType === 'patient' ? 'patients' : 'doctors';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData(data);
      if (data.profile_pic_url) {
        setProfilePicPreview(data.profile_pic_url);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const tableName = userType === 'patient' ? 'patients' : 'doctors';
      let updateData = { ...formData };

      // Upload profile picture if changed
      if (profilePicFile) {
        const profilePicUrl = await uploadProfilePicture(profilePicFile);
        if (profilePicUrl) {
          updateData.profile_pic_url = profilePicUrl;
        }
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      setIsEditing(false);
      setProfilePicFile(null);

      toast({
        title: t('success', language),
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('error', language),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setProfilePicFile(null);
    setProfilePicPreview(profile?.profile_pic_url || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="sanskrit-title flex items-center gap-2">
                <User className="h-5 w-5" />
                {userType === 'patient' ? 'Personal Information' : 'Professional Information'}
              </CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Edit your profile information below' 
                  : 'View and manage your profile information'
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
                {profilePicPreview && (
                  <img 
                    src={profilePicPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold sanskrit-title">{profile.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {userType === 'doctor' && 'specialization' in profile && (
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Stethoscope className="h-4 w-4" />
                  <span>{profile.specialization}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              {userType === 'patient' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        disabled={!isEditing}
                        min="1"
                        max="120"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender || ''}
                        onValueChange={(value) => handleInputChange('gender', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                        disabled={!isEditing}
                        min="50"
                        max="250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                        disabled={!isEditing}
                        min="20"
                        max="300"
                      />
                    </div>
                  </div>
                </>
              )}

              {userType === 'doctor' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree(s)</Label>
                    <Input
                      id="degree"
                      value={formData.degree || ''}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.institution || ''}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">Years of Experience</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years || ''}
                        onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                        disabled={!isEditing}
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select
                        value={formData.specialization || ''}
                        onValueChange={(value) => handleInputChange('specialization', value)}
                        disabled={!isEditing}
                      >
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
                  </div>
                </>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                {userType === 'patient' ? (
                  <>
                    <Heart className="h-5 w-5" />
                    Health Information
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-5 w-5" />
                    Professional Details
                  </>
                )}
              </h4>

              {userType === 'patient' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="medical_history">Medical History</Label>
                    <Textarea
                      id="medical_history"
                      value={formData.medical_history || ''}
                      onChange={(e) => handleInputChange('medical_history', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Any health conditions, allergies, or ongoing treatments..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_preferences">Dietary Preferences</Label>
                    <Textarea
                      id="food_preferences"
                      value={formData.food_preferences || ''}
                      onChange={(e) => handleInputChange('food_preferences', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Food preferences, dietary choices, etc..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_restrictions">Food Restrictions</Label>
                    <Textarea
                      id="food_restrictions"
                      value={formData.food_restrictions || ''}
                      onChange={(e) => handleInputChange('food_restrictions', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Allergies, intolerances, restrictions..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {userType === 'doctor' && (
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications & Additional Qualifications</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications || ''}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Additional certifications, training, awards..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      
    </div>
  );
};

export default ProfileSection;
