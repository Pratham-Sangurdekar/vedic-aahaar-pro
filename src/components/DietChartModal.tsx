import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Download, Edit, Save, X, Utensils, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateDietPDF } from '@/utils/pdfGenerator';

interface DietChartData {
  id?: string;
  patient_id: string;
  breakfast: {
    items: string[];
    calories: number;
    rasa: string[];
    timing: string;
  };
  lunch: {
    items: string[];
    calories: number;
    rasa: string[];
    timing: string;
  };
  dinner: {
    items: string[];
    calories: number;
    rasa: string[];
    timing: string;
  };
  snacks: {
    items: string[];
    calories: number;
    rasa: string[];
    timing: string;
  };
  totalCalories: number;
  ayurvedicPrinciples: string[];
  seasonalNotes: string;
  doshaBalance: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  restrictions: string[];
  recommendations: string;
  duration: string;
  generatedAt: string;
}

interface DietChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietChart: DietChartData | null;
  patientName?: string;
  patientId?: string;
  onSave?: (updatedChart: DietChartData) => void;
  onAttachToChat?: (chartId: string) => void;
  canEdit?: boolean;
}

const DietChartModal: React.FC<DietChartModalProps> = ({
  isOpen,
  onClose,
  dietChart,
  patientName,
  patientId,
  onSave,
  onAttachToChat,
  canEdit = false
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedChart, setEditedChart] = useState<DietChartData | null>(dietChart);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setEditedChart(dietChart);
  }, [dietChart]);

  const handleSave = async () => {
    if (!editedChart || !patientId) return;

    setLoading(true);
    try {
      const chartData = {
        patient_id: patientId,
        generated_diet: editedChart as any,
      };

      if (editedChart.id) {
        // Update existing chart
        const { error } = await supabase
          .from('diet_charts')
          .update(chartData)
          .eq('id', editedChart.id);

        if (error) throw error;
      } else {
        // Create new chart
        const { data, error } = await supabase
          .from('diet_charts')
          .insert(chartData)
          .select()
          .single();

        if (error) throw error;
        setEditedChart(prev => prev ? { ...prev, id: data.id } : null);
      }

      setIsEditing(false);
      onSave?.(editedChart);
      
      toast({
        title: 'Diet Chart Saved',
        description: 'The diet chart has been saved successfully.',
      });
    } catch (error: any) {
      console.error('Error saving diet chart:', error);
      toast({
        title: 'Save Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!editedChart) return;

    try {
      // Create a temporary patient object for PDF generation
      const tempPatient = {
        name: patientName || 'Patient',
        age: 30, // Default values since we don't have this info
        gender: 'Not specified',
      };
      
      // Create a temporary diet chart object compatible with the PDF generator
      const tempDietChart = {
        goal: 'Balanced Ayurvedic Diet',
        concern: 'Overall wellness',
        restrictions: editedChart.restrictions.join(', ') || 'None',
        generated_at: editedChart.generatedAt,
        recommendations: [editedChart.recommendations],
      };
      
      await generateDietPDF(tempPatient, tempDietChart);
      
      toast({
        title: 'PDF Downloaded',
        description: 'Diet chart PDF has been downloaded successfully.',
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAttachToChat = async () => {
    if (!editedChart?.id) {
      toast({
        title: 'Save Required',
        description: 'Please save the diet chart first before attaching to chat.',
        variant: 'destructive',
      });
      return;
    }

    onAttachToChat?.(editedChart.id);
    toast({
      title: 'Attached to Chat',
      description: 'Diet chart has been attached to the chat conversation.',
    });
  };

  const updateMealField = (meal: keyof Pick<DietChartData, 'breakfast' | 'lunch' | 'dinner' | 'snacks'>, field: string, value: any) => {
    if (!editedChart) return;
    
    setEditedChart(prev => prev ? {
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value
      }
    } : null);
  };

  const rasaColors = {
    'Sweet': 'bg-green-100 text-green-800',
    'Sour': 'bg-yellow-100 text-yellow-800',
    'Salty': 'bg-blue-100 text-blue-800',
    'Bitter': 'bg-gray-100 text-gray-800',
    'Pungent': 'bg-red-100 text-red-800',
    'Astringent': 'bg-purple-100 text-purple-800',
  };

  const MealCard = ({ 
    mealName, 
    mealData, 
    onUpdate 
  }: { 
    mealName: string; 
    mealData: DietChartData['breakfast']; 
    onUpdate: (field: string, value: any) => void;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Utensils className="h-5 w-5" />
          {mealName}
          <Badge variant="outline" className="ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            {mealData.timing}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Food Items:</h4>
          {isEditing ? (
            <Textarea
              value={mealData.items.join('\n')}
              onChange={(e) => onUpdate('items', e.target.value.split('\n').filter(item => item.trim()))}
              placeholder="Enter food items, one per line"
              className="min-h-[100px]"
            />
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {mealData.items.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Calories: </span>
            {isEditing ? (
              <input
                type="number"
                value={mealData.calories}
                onChange={(e) => onUpdate('calories', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border rounded"
              />
            ) : (
              <Badge variant="secondary">{mealData.calories} kcal</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <Users className="h-4 w-4 inline mr-1" />
            Serves 1
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Rasa (Tastes):</h4>
          <div className="flex flex-wrap gap-2">
            {mealData.rasa.map((taste, index) => (
              <Badge 
                key={index} 
                className={rasaColors[taste as keyof typeof rasaColors] || 'bg-gray-100 text-gray-800'}
              >
                {taste}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!editedChart) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ayurvedic Diet Chart - {patientName}</span>
            <div className="flex gap-2">
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={loading} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedChart(dietChart);
                        }} 
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </>
              )}
              <Button onClick={handleDownloadPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {onAttachToChat && (
                <Button onClick={handleAttachToChat} variant="outline" size="sm">
                  Attach to Chat
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Diet Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{editedChart.totalCalories}</div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{editedChart.duration}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-muted-foreground">Meals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{editedChart.ayurvedicPrinciples.length}</div>
                <div className="text-sm text-muted-foreground">Principles</div>
              </div>
            </CardContent>
          </Card>

          {/* Dosha Balance */}
          <Card>
            <CardHeader>
              <CardTitle>Dosha Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(editedChart.doshaBalance).map(([dosha, percentage]) => (
                  <div key={dosha} className="text-center">
                    <div className="text-lg font-semibold capitalize">{dosha}</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full ${
                          dosha === 'vata' ? 'bg-blue-500' : 
                          dosha === 'pitta' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MealCard 
              mealName="Breakfast" 
              mealData={editedChart.breakfast}
              onUpdate={(field, value) => updateMealField('breakfast', field, value)}
            />
            <MealCard 
              mealName="Lunch" 
              mealData={editedChart.lunch}
              onUpdate={(field, value) => updateMealField('lunch', field, value)}
            />
            <MealCard 
              mealName="Snacks" 
              mealData={editedChart.snacks}
              onUpdate={(field, value) => updateMealField('snacks', field, value)}
            />
            <MealCard 
              mealName="Dinner" 
              mealData={editedChart.dinner}
              onUpdate={(field, value) => updateMealField('dinner', field, value)}
            />
          </div>

          <Separator />

          {/* Ayurvedic Principles */}
          <Card>
            <CardHeader>
              <CardTitle>Ayurvedic Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {editedChart.ayurvedicPrinciples.map((principle, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {principle}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedChart.recommendations}
                  onChange={(e) => setEditedChart(prev => prev ? { ...prev, recommendations: e.target.value } : null)}
                  placeholder="Enter dietary recommendations"
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm leading-relaxed">{editedChart.recommendations}</p>
              )}
            </CardContent>
          </Card>

          {/* Seasonal Notes */}
          {editedChart.seasonalNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedChart.seasonalNotes}
                    onChange={(e) => setEditedChart(prev => prev ? { ...prev, seasonalNotes: e.target.value } : null)}
                    placeholder="Enter seasonal notes"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{editedChart.seasonalNotes}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Restrictions */}
          {editedChart.restrictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {editedChart.restrictions.map((restriction, index) => (
                    <Badge key={index} variant="destructive" className="text-sm">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DietChartModal;