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

  useEffect(() => {
    if (user?.id) {
      fetchFoodLogs();
      fetchRecipes();
    }
  }, [user?.id, selectedDate]);

  useEffect(() => {
    calculateTotalCalories();
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
      const logData = {
        patient_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: mealTime,
        quantity: parseFloat(quantity),
        ...(selectedRecipe ? 
          { recipe_id: selectedRecipe } : 
          { 
            custom_food_name: customFoodName,
            custom_food_calories: parseInt(customCalories) || 0
          }
        )
      };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Food Logging</h2>
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
              <Button>
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
                      <Input
                        id="customFood"
                        value={customFoodName}
                        onChange={(e) => {
                          setCustomFoodName(e.target.value);
                          setSelectedRecipe('');
                        }}
                        placeholder="Enter food name"
                      />
                      <Input
                        type="number"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        placeholder="Calories per serving"
                        disabled={!customFoodName}
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

      {/* Date Picker and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="space-y-3">
              {foodLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{log.time}</Badge>
                      <h4 className="font-medium">
                        {log.recipe?.title || log.custom_food_name}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {log.quantity} serving{log.quantity !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {((log.recipe?.calories_per_serving || log.custom_food_calories || 0) * log.quantity)} calories
                    </div>
                  </div>
                  <div className="flex gap-2">
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