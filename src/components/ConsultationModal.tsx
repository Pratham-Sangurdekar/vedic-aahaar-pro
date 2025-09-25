import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    preferred_timing: '',
    wants_browse_doctors: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, we'll use notifications table to store consultation requests
      // until consultation_requests table is properly created
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: '00000000-0000-0000-0000-000000000000', // System user ID
          user_type: 'admin',
          title: 'New Consultation Request',
          message: `${formData.name} (${formData.email}) requested consultation: ${formData.reason}`,
          type: 'consultation_request'
        }]);

      if (error) throw error;

      toast({
        title: "Consultation Request Submitted",
        description: "We'll contact you within 24 hours to schedule your consultation.",
      });

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        reason: '',
        preferred_timing: '',
        wants_browse_doctors: false,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit consultation request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sanskrit-title text-xl gradient-text">
            Book Ayurvedic Consultation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Consultation</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Brief description of your health concerns or goals..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timing">Preferred Timing</Label>
            <Input
              id="timing"
              value={formData.preferred_timing}
              onChange={(e) => handleInputChange('preferred_timing', e.target.value)}
              placeholder="e.g., Weekday mornings, Weekend afternoons"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="browse"
              checked={formData.wants_browse_doctors}
              onCheckedChange={(checked) => handleInputChange('wants_browse_doctors', checked as boolean)}
            />
            <Label htmlFor="browse" className="text-sm">
              I'd like to browse doctor profiles before consultation
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;