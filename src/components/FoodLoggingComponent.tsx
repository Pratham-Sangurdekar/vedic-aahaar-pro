import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon, Utensils, Trash2, Edit, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FoodLog {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  recipe_id?: string;
  custom_food_name?: string;
  custom_food_calories?: number;
  custom_food_carbs?: number | string;
  custom_food_protein?: number | string;
  custom_food_fats?: number | string;
  custom_food_fibre?: number | string;
  custom_food_sugar?: number | string;
  custom_food_sodium?: number | string;
  custom_food_calcium?: number | string;
  custom_food_iron?: number | string;
  custom_food_vitamin_c?: number | string;
  custom_food_folate?: number | string;
  quantity: number;
  created_at: string;
  recipe?: {
    title: string;
    calories_per_serving?: number;
  };
}

interface Recipe {
  id: string;
  title: string;
  calories_per_serving?: number;
}

// Placeholder dosha logic: assign random or simple values for demo
const getDoshaEffect = (foodName: string) => {
  // Replace with real mapping if available
  const vataFoods = ['oats', 'banana', 'rice'];
  const pittaFoods = ['tomato', 'onion', 'garlic'];
  const kaphaFoods = ['potato', 'cheese', 'yogurt'];
  const name = foodName.toLowerCase();
  return {
    vata: vataFoods.some(f => name.includes(f)) ? 1 : 0,
    pitta: pittaFoods.some(f => name.includes(f)) ? 1 : 0,
    kapha: kaphaFoods.some(f => name.includes(f)) ? 1 : 0,
  };
};

const FoodLoggingComponent: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [totalCalories, setTotalCalories] = useState(0);

  // Form state
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [mealTime, setMealTime] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState<any | null>(null);
  const [fetchingNutrition, setFetchingNutrition] = useState(false);
  const [doshaBalance, setDoshaBalance] = useState({ vata: 0, pitta: 0, kapha: 0 });

  useEffect(() => {
    if (user?.id) {
      fetchFoodLogs();
      fetchRecipes();
    }
  }, [user?.id, selectedDate]);

  useEffect(() => {
    calculateTotalCalories();
    // Calculate dosha balance
    let vata = 0, pitta = 0, kapha = 0;
    foodLogs.forEach(log => {
      const foodName = log.recipe?.title || log.custom_food_name || '';
      const effect = getDoshaEffect(foodName);
      vata += effect.vata * log.quantity;
      pitta += effect.pitta * log.quantity;
      kapha += effect.kapha * log.quantity;
    });
    setDoshaBalance({ vata, pitta, kapha });
  }, [foodLogs]);

  const fetchFoodLogs = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select(`
          *,
          recipe:recipes(title, calories_per_serving)
        `)
        .eq('patient_id', user.id)
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .order('time', { ascending: true });

      if (error) throw error;
      setFoodLogs(data as FoodLog[] || []);
    } catch (error: any) {
      console.error('Error fetching food logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch food logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, calories_per_serving')
        .order('title');

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
    }
  };

  const calculateTotalCalories = () => {
    const total = foodLogs.reduce((sum, log) => {
      let calories = 0;
      if (log.recipe?.calories_per_serving) {
        calories = log.recipe.calories_per_serving;
      } else if (log.custom_food_calories) {
        calories = log.custom_food_calories;
      }
      return sum + (calories * log.quantity);
    }, 0);
    setTotalCalories(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || (!selectedRecipe && !customFoodName)) return;

    setLoading(true);
    try {
      let logData: any = {
        patient_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: mealTime,
        quantity: parseFloat(quantity),
      };
      if (selectedRecipe) {
        logData.recipe_id = selectedRecipe;
      } else if (customFoodName) {
        // If nutritionInfo is available, use it
        if (nutritionInfo) {
          logData = {
            ...logData,
            custom_food_name: customFoodName,
            custom_food_calories: nutritionInfo["Calories (kcal)"] || 0,
            custom_food_carbs: nutritionInfo["Carbohydrates (g)"] || 0,
            custom_food_protein: nutritionInfo["Protein (g)"] || 0,
            custom_food_fats: nutritionInfo["Fats (g)"] || 0,
            custom_food_fibre: nutritionInfo["Fibre (g)"] || 0,
            custom_food_sugar: nutritionInfo["Free Sugar (g)"] || 0,
            custom_food_sodium: nutritionInfo["Sodium (mg)"] || 0,
            custom_food_calcium: nutritionInfo["Calcium (mg)"] || 0,
            custom_food_iron: nutritionInfo["Iron (mg)"] || 0,
            custom_food_vitamin_c: nutritionInfo["Vitamin C (mg)"] || 0,
            custom_food_folate: nutritionInfo["Folate (碌g)"] || 0,
          };
        } else {
          logData = {
            ...logData,
            custom_food_name: customFoodName,
            custom_food_calories: parseInt(customCalories) || 0
          };
        }
      }

      if (editingLog) {
        const { error } = await supabase
          .from('food_logs')
          .update(logData)
          .eq('id', editingLog.id);

        if (error) throw error;
        toast({
          title: 'Food log updated',
          description: 'Your food entry has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('food_logs')
          .insert(logData);

        if (error) throw error;
        toast({
          title: 'Food logged',
          description: 'Your food entry has been recorded successfully.',
        });
      }

      resetForm();
      fetchFoodLogs();
    } catch (error: any) {
      console.error('Error saving food log:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch nutrition info from backend for custom food
  const fetchNutritionInfo = async () => {
    if (!customFoodName) return;
    setFetchingNutrition(true);
    setNutritionInfo(null);
    try {
      const res = await fetch('http://localhost:8002/track-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food_items: [customFoodName] })
      });
      const data = await res.json();
      console.log('Nutrition API response:', data);
      // Try to parse result as JSON or CSV
      let nutrition = null;
      try {
        nutrition = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch {
        nutrition = data.result;
      }
      setNutritionInfo(Array.isArray(nutrition) ? nutrition[0] : nutrition);
      if (!nutrition || Object.keys(nutrition).length === 0) {
        toast({ title: 'No nutrition info found', description: 'No data returned for this food.' });
      }
      if (nutrition && nutrition.error) {
        toast({ title: 'Error', description: nutrition.error });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Could not fetch nutrition info.' });
    } finally {
      setFetchingNutrition(false);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      toast({
        title: 'Food log deleted',
        description: 'The food entry has been removed.',
      });
      
      fetchFoodLogs();
    } catch (error: any) {
      console.error('Error deleting food log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete food log',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setSelectedRecipe('');
    setCustomFoodName('');
    setCustomCalories('');
    setQuantity('1');
    setMealTime('');
    setEditingLog(null);
    setIsAddModalOpen(false);
  };

  const startEdit = (log: FoodLog) => {
    setEditingLog(log);
    if (log.recipe_id) {
      setSelectedRecipe(log.recipe_id);
    } else {
      setCustomFoodName(log.custom_food_name || '');
      setCustomCalories(log.custom_food_calories?.toString() || '');
    }
    setQuantity(log.quantity.toString());
    setMealTime(log.time);
    setIsAddModalOpen(true);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Date', 'Time', 'Food Item', 'Quantity', 'Calories per Serving', 'Total Calories'],
      ...foodLogs.map(log => [
        format(selectedDate, 'yyyy-MM-dd'),
        log.time,
        log.recipe?.title || log.custom_food_name || 'Unknown',
        log.quantity,
        log.recipe?.calories_per_serving || log.custom_food_calories || 0,
        (log.recipe?.calories_per_serving || log.custom_food_calories || 0) * log.quantity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `food-log-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'CSV Exported',
      description: 'Your food log has been exported successfully.',
    });
  };

  const mealTimes = [
    { value: '06:00', label: 'Early Morning (6:00 AM)' },
    { value: '08:00', label: 'Breakfast (8:00 AM)' },
    { value: '10:30', label: 'Mid-Morning (10:30 AM)' },
    { value: '12:30', label: 'Lunch (12:30 PM)' },
    { value: '16:00', label: 'Afternoon Snack (4:00 PM)' },
    { value: '19:00', label: 'Dinner (7:00 PM)' },
    { value: '21:00', label: 'Evening (9:00 PM)' },
  ];

  // --- Daily Nutrient Summary ---
  const nutrientFields = [
    { key: 'carbs', label: 'Carbs (g)', field: 'custom_food_carbs' },
    { key: 'protein', label: 'Protein (g)', field: 'custom_food_protein' },
    { key: 'fats', label: 'Fats (g)', field: 'custom_food_fats' },
    { key: 'fibre', label: 'Fibre (g)', field: 'custom_food_fibre' },
    { key: 'sugar', label: 'Sugar (g)', field: 'custom_food_sugar' },
    { key: 'sodium', label: 'Sodium (mg)', field: 'custom_food_sodium' },
    { key: 'calcium', label: 'Calcium (mg)', field: 'custom_food_calcium' },
    { key: 'iron', label: 'Iron (mg)', field: 'custom_food_iron' },
    { key: 'vitamin_c', label: 'Vitamin C (mg)', field: 'custom_food_vitamin_c' },
    { key: 'folate', label: 'Folate (μg)', field: 'custom_food_folate' },
  ];

  // Calculate daily totals for each nutrient
  const dailyNutrientTotals: Record<string, number> = {};
  nutrientFields.forEach(({ field }) => {
    dailyNutrientTotals[field] = foodLogs.reduce((sum, log) => {
      // Only sum for custom foods
      const val = log[field as keyof FoodLog];
      const qty = log.quantity || 1;
      if (log.custom_food_name && val && !isNaN(Number(val))) {
        return sum + Number(val) * qty;
      }
      return sum;
    }, 0);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">Food Logging</h2>
          <p className="text-muted-foreground">Track your daily food intake</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsAddModalOpen(true); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Food Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLog ? 'Edit Food Entry' : 'Add Food Entry'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="mealTime">Meal Time</Label>
                  <Select value={mealTime} onValueChange={setMealTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal time" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTimes.map(time => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Food Type</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="recipe">Select from Recipes</Label>
                      <Select 
                        value={selectedRecipe} 
                        onValueChange={(value) => {
                          setSelectedRecipe(value);
                          setCustomFoodName('');
                          setCustomCalories('');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a recipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipes.map(recipe => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.title} {recipe.calories_per_serving && `(${recipe.calories_per_serving} cal)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">OR</div>

                    <div className="space-y-2">
                      <Label htmlFor="customFood">Custom Food Item</Label>
                      <div className="flex gap-2">
                        <Input
                          id="customFood"
                          value={customFoodName}
                          onChange={(e) => {
                            setCustomFoodName(e.target.value);
                            setSelectedRecipe('');
                            setNutritionInfo(null);
                          }}
                          placeholder="Enter food name"
                        />
                        <Button type="button" size="sm" onClick={fetchNutritionInfo} disabled={!customFoodName || fetchingNutrition}>
                          {fetchingNutrition ? 'Fetching...' : 'Get Info'}
                        </Button>
                      </div>
                      {nutritionInfo && (
                        <div className="mt-2 p-2 border rounded bg-muted">
                          <div className="font-medium">Nutrition Info:</div>
                          <div>Calories: {nutritionInfo["Calories (kcal)"] || 'N/A'} kcal</div>
                          <div>Carbs: {nutritionInfo["Carbohydrates (g)"] || 'N/A'} g</div>
                          <div>Protein: {nutritionInfo["Protein (g)"] || 'N/A'} g</div>
                          <div>Fats: {nutritionInfo["Fats (g)"] || 'N/A'} g</div>
                          {/* Add more fields as needed */}
                        </div>
                      )}
                      <Input
                        type="number"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        placeholder="Calories per serving"
                        disabled={!customFoodName || !!nutritionInfo}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity (servings)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {editingLog ? 'Update' : 'Add'} Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

  {/* Date Picker, Summary, Dosha Balance */}
  <div className="flex flex-col gap-6">
        {/* Daily Nutrient Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nutrient Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs">
              {nutrientFields.map(({ label, field }) => (
                <div className="flex justify-between" key={field}>
                  <span>{label}:</span>
                  <span className="font-medium">{dailyNutrientTotals[field]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Dosha Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dosha Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Vata:</span>
                <Badge variant="secondary" className="text-lg">{doshaBalance.vata}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pitta:</span>
                <Badge variant="secondary" className="text-lg">{doshaBalance.pitta}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Kapha:</span>
                <Badge variant="secondary" className="text-lg">{doshaBalance.kapha}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Calories:</span>
                <Badge variant="secondary" className="text-lg">
                  {totalCalories} kcal
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Meals Logged:</span>
                <span className="font-medium">{foodLogs.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calorie Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {totalCalories} / 2000 kcal
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Food Entries for {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : foodLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No food entries for this date. Add your first meal!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {foodLogs.map((log) => (
                <div
                  key={log.id}
                  className="w-full p-4 border rounded-lg bg-white shadow flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline">{log.time}</Badge>
                    <h4 className="font-medium break-words">
                      {log.recipe?.title || log.custom_food_name}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {log.quantity} serving{log.quantity !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {((log.recipe?.calories_per_serving || log.custom_food_calories || 0) * log.quantity)} calories
                  </div>
                  {/* Detailed nutrition info for custom foods */}
                  {log.custom_food_name && (
                    <div className="text-xs text-muted-foreground mt-1 flex flex-col gap-1">
                      <div>Carbs: {log.custom_food_carbs || 'N/A'} g</div>
                      <div>Protein: {log.custom_food_protein || 'N/A'} g</div>
                      <div>Fats: {log.custom_food_fats || 'N/A'} g</div>
                      <div>Fibre: {log.custom_food_fibre || 'N/A'} g</div>
                      <div>Sugar: {log.custom_food_sugar || 'N/A'} g</div>
                      <div>Sodium: {log.custom_food_sodium || 'N/A'} mg</div>
                      <div>Calcium: {log.custom_food_calcium || 'N/A'} mg</div>
                      <div>Iron: {log.custom_food_iron || 'N/A'} mg</div>
                      <div>Vit C: {log.custom_food_vitamin_c || 'N/A'} mg</div>
                      <div>Folate: {log.custom_food_folate || 'N/A'}</div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(log)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(log.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodLoggingComponent;