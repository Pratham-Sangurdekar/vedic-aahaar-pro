import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Heart, 
  Clock, 
  Users, 
  ChefHat, 
  Plus, 
  Star,
  Filter,
  Utensils,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  author_id?: string;
  rasa?: string;
  cuisine?: string;
  diet_type?: string;
  calories_per_serving?: number;
  cooking_time_minutes?: number;
  difficulty_level?: string;
  image_url?: string;
  created_at: string;
  is_favorited?: boolean;
}

const RecipesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [showDoctorRecipes, setShowDoctorRecipes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDietType, setSelectedDietType] = useState('');
  const [selectedRasa, setSelectedRasa] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'time' | 'calories'>('newest');

  const userType = user?.email?.includes('@doctor.') ? 'doctor' : 'patient';

  // Form state for adding recipes
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    rasa: '',
    cuisine: '',
    diet_type: '',
    calories_per_serving: '',
    cooking_time_minutes: '',
    difficulty_level: '',
  });

  // Separate doctor and website recipes
  const [doctorRecipes, setDoctorRecipes] = useState<any[]>([]);
  const [websiteRecipes, setWebsiteRecipes] = useState<any[]>([]);



  useEffect(() => {
    // Always fetch DB recipes on mount or user change
    fetchRecipes().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // When recipes change, split into doctor and website recipes
  useEffect(() => {
    setDoctorRecipes(recipes.filter(r => r.author_id && r.author_id !== ''));
    const website = recipes.filter(r => !r.author_id || r.author_id === '');
    if (website.length === 0) {
      setWebsiteRecipes(generateSampleRecipes(60));
    } else {
      setWebsiteRecipes(website);
    }
  }, [recipes]);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCuisine, selectedDietType, selectedRasa, selectedDifficulty, showFavoritesOnly]);

  const fetchRecipes = async (pageNum = 1) => {
    setLoading(true);
    try {
      const from = (pageNum - 1) * 20;
      const to = from + 19;

      // First, get recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      // Merge with sample recipes if needed (for website recipes)
      let merged: any[] = [];
      if (recipesData && recipesData.length > 0) {
        // Add DB recipes
        merged = recipesData.map((s: any) => ({
          ...s,
          author_id: s.author_id || '',
          calories_per_serving: s.calories_per_serving || 0,
          cooking_time_minutes: s.cooking_time_minutes || 0,
          created_at: s.created_at || new Date().toISOString(),
          cuisine: s.cuisine || '',
          description: s.description || '',
          diet_type: s.diet_type || '',
          difficulty_level: s.difficulty_level || '',
          image_url: s.image_url || '',
          is_favorited: s.is_favorited || false,
          ingredients: s.ingredients || [],
          instructions: s.instructions || '',
          rasa: s.rasa || '',
          title: s.title
        }));
        // Optionally, add sample recipes if you want to always show some website recipes
        // merged = [...merged, ...generateSampleRecipes(10)];
      } else {
        // If no DB recipes, show samples
        merged = generateSampleRecipes(60);
      }

      if (pageNum === 1) {
        setRecipes(merged as any);
      } else {
        setRecipes((prev: any[]) => [...prev, ...merged]);
      }

      setHasMore(merged.length === 20); // pagination applies only to DB items
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      // Fallback to curated samples so the page is never blank
      if (pageNum === 1) {
        const samples = generateSampleRecipes(60);
        setRecipes(samples);
        setHasMore(false);
      }
      toast({
        title: 'Offline Mode',
        description: 'Showing curated Ayurvedic recipes while loading from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine && selectedCuisine !== 'all') {
      filtered = filtered.filter(recipe => recipe.cuisine === selectedCuisine);
    }

    if (selectedDietType && selectedDietType !== 'all') {
      filtered = filtered.filter(recipe => recipe.diet_type === selectedDietType);
    }

    if (selectedRasa && selectedRasa !== 'all') {
      filtered = filtered.filter(recipe => recipe.rasa === selectedRasa);
    }

    if (selectedDifficulty && selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty_level === selectedDifficulty);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(recipe => recipe.is_favorited);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'time':
          return (a.cooking_time_minutes || 0) - (b.cooking_time_minutes || 0);
        case 'calories':
          return (a.calories_per_serving || 0) - (b.calories_per_serving || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredRecipes(filtered);
  };

  // Generate curated sample Ayurvedic recipes to display when DB has few
  function generateSampleRecipes(count: number): Recipe[] {
    const titles = [
      'Golden Turmeric Milk', 'Tri-Dosha Kitchari', 'Cooling Mint Chutney', 'Ginger Lemon Tea', 'Moong Dal Khichdi',
      'Masala Buttermilk', 'Ayurvedic Vegetable Stew', 'Cumin-Coriander-Fennel Tea', 'Sesame Jaggery Ladoo', 'Ajwain Carom Soup',
      'Saunf Digestive Tea', 'Ghee Rice (Pitta Soothing)', 'Tulsi Holy Basil Tea', 'Pitta-Cooling Cucumber Raita', 'Vata-Pacifying Sweet Potato Mash',
      'Kapha-Balancing Barley Soup', 'Spiced Apple Stew', 'Cardamom Saffron Kheer', 'Mung Bean Soup', 'Coriander Lemon Quinoa',
      'Triphala Fruit Mix', 'Jeera Alu (Light)', 'Drumstick Leaf Stir-Fry', 'Ash Gourd Soup', 'Bottle Gourd Dal',
      'Fenugreek Thepla (Light)', 'Sprouted Moong Salad', 'Coconut Mint Chutney', 'Panchphoron Veggies', 'Ragi Porridge',
      'Rice Idli (Light)', 'Lemon Rice (Light Oil)', 'Curry Leaf Chutney', 'Millet Upma', 'Vegetable Dalia',
      'Cabbage Stir-Fry', 'Palak Moong Dal', 'Pudina Chaas', 'Til Chikki (Small)', 'Amaranth Khichdi',
      'Beetroot Raita', 'Cucumber Mint Cooler', 'Pomegranate Raita', 'Sathu Maavu Porridge', 'Sweet Poha (Light)',
      'Lauki Halwa (Low Sugar)', 'Handvo (Light)', 'Karela Stir-Fry (Mild)', 'Methi Dal (Mild)', 'Drumstick Sambar (Light)'
    ];
    const rasas = ['Sweet', 'Sour', 'Salty', 'Bitter', 'Pungent', 'Astringent'];
    const difficulties = ['Easy', 'Medium'];
    const now = new Date().toISOString();
    const items: Recipe[] = [];
    for (let i = 0; i < Math.min(count, titles.length); i++) {
      items.push({
        id: `sample-${i}`,
        title: titles[i],
        description: 'Ayurvedic-inspired preparation focusing on dosha balance with gentle spices and easy digestion.',
        ingredients: [
          '1 cup primary ingredient',
          '1 tsp ghee or sesame oil',
          '1/2 tsp cumin',
          '1/4 tsp turmeric',
          'Salt to taste'
        ],
        instructions: 'Warm ghee, temper spices, add main ingredient and cook until tender. Adjust seasoning and serve warm.',
        rasa: rasas[i % rasas.length],
        cuisine: 'Indian',
        diet_type: 'Vegetarian',
        calories_per_serving: 180 + (i % 5) * 40,
        cooking_time_minutes: 10 + (i % 6) * 5,
        difficulty_level: difficulties[i % difficulties.length],
        image_url: undefined,
        author_id: undefined,
        created_at: now,
        is_favorited: false,
      });
    }
    return items;
  }

  const toggleFavorite = async (recipeId: string) => {
    if (!user?.id) {
      toast({
        title: 'Login Required',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      if (recipe.is_favorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('recipe_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('recipe_favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          });

        if (error) throw error;
      }

      // Update local state
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, is_favorited: !recipe.is_favorited }
          : recipe
      ));

      toast({
        title: recipe.is_favorited ? 'Removed from favorites' : 'Added to favorites',
        description: recipe.is_favorited 
          ? 'Recipe removed from your favorites' 
          : 'Recipe added to your favorites',
      });
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || userType !== 'doctor') {
      toast({
        title: 'Permission Denied',
        description: 'Only doctors can add recipes',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
          instructions: newRecipe.instructions,
          author_id: user.id,
          rasa: newRecipe.rasa,
          cuisine: newRecipe.cuisine,
          diet_type: newRecipe.diet_type,
          calories_per_serving: parseInt(newRecipe.calories_per_serving) || null,
          cooking_time_minutes: parseInt(newRecipe.cooking_time_minutes) || null,
          difficulty_level: newRecipe.difficulty_level,
        });

      if (error) throw error;

      toast({
        title: 'Recipe Added',
        description: 'Your recipe has been added successfully',
      });

      setIsAddModalOpen(false);
      setNewRecipe({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        rasa: '',
        cuisine: '',
        diet_type: '',
        calories_per_serving: '',
        cooking_time_minutes: '',
        difficulty_level: '',
      });
      
      fetchRecipes();
    } catch (error: any) {
      console.error('Error adding recipe:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const cuisines = ['Indian', 'South Indian', 'North Indian', 'Gujarati', 'Rajasthani', 'Kashmiri', 'Bengali'];
  const dietTypes = ['Vegetarian', 'Vegan', 'Satvik', 'Gluten-Free', 'Dairy-Free'];
  const rasas = ['Sweet', 'Sour', 'Salty', 'Bitter', 'Pungent', 'Astringent'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRasaColor = (rasa: string) => {
    const colors: Record<string, string> = {
      'Sweet': 'bg-green-100 text-green-800',
      'Sour': 'bg-yellow-100 text-yellow-800',
      'Salty': 'bg-blue-100 text-blue-800',
      'Bitter': 'bg-gray-100 text-gray-800',
      'Pungent': 'bg-red-100 text-red-800',
      'Astringent': 'bg-purple-100 text-purple-800',
    };
    return colors[rasa] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        
        {userType === 'doctor' && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddRecipe} className="space-y-4">
                <div>
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    value={newRecipe.title}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the recipe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cuisine">Cuisine</Label>
                    <Select value={newRecipe.cuisine} onValueChange={(value) => setNewRecipe(prev => ({ ...prev, cuisine: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        {cuisines.map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select value={newRecipe.diet_type} onValueChange={(value) => setNewRecipe(prev => ({ ...prev, diet_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Diet Types</SelectItem>
                        {dietTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rasa">Primary Rasa (Taste)</Label>
                    <Select value={newRecipe.rasa} onValueChange={(value) => setNewRecipe(prev => ({ ...prev, rasa: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rasa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rasas</SelectItem>
                        {rasas.map(rasa => (
                          <SelectItem key={rasa} value={rasa}>{rasa}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={newRecipe.difficulty_level} onValueChange={(value) => setNewRecipe(prev => ({ ...prev, difficulty_level: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories per Serving</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newRecipe.calories_per_serving}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, calories_per_serving: e.target.value }))}
                      placeholder="Enter calories"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                    <Input
                      id="cookingTime"
                      type="number"
                      value={newRecipe.cooking_time_minutes}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, cooking_time_minutes: e.target.value }))}
                      placeholder="Enter time in minutes"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                  <Textarea
                    id="ingredients"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                    placeholder="1 cup rice&#10;2 tbsp ghee&#10;1 tsp turmeric"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Step by step cooking instructions..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Add Recipe
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>


      {/* Search, Filters, and Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" size="sm" onClick={() => setShowFavoritesOnly(v => !v)}>
                  <Heart className={`h-4 w-4 mr-1 ${showFavoritesOnly ? 'text-red-500' : ''}`} />
                  Favorites
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="time">Cooking Time</SelectItem>
                    <SelectItem value="calories">Calories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant={showDoctorRecipes ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowDoctorRecipes(true)}
                >
                  Doctor Uploaded
                </Button>
                <Button
                  variant={!showDoctorRecipes ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowDoctorRecipes(false)}
                >
                  Website Recipes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {cuisines.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDietType} onValueChange={setSelectedDietType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Diet Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Diet Types</SelectItem>
                  {dietTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRasa} onValueChange={setSelectedRasa}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tastes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tastes</SelectItem>
                  {rasas.map(rasa => (
                    <SelectItem key={rasa} value={rasa}>{rasa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {(showDoctorRecipes ? doctorRecipes : websiteRecipes).length} recipe{(showDoctorRecipes ? doctorRecipes : websiteRecipes).length !== 1 ? 's' : ''}  showing
      </div>

      {/* Recipes Grid */}
      {loading && (showDoctorRecipes ? doctorRecipes : websiteRecipes).length === 0 ? (
        <div className="text-center py-12">Loading recipes...</div>
      ) : (showDoctorRecipes ? doctorRecipes : websiteRecipes).length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No recipes found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showDoctorRecipes ? doctorRecipes : websiteRecipes).map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                {recipe.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg leading-tight">{recipe.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${recipe.is_favorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {recipe.rasa && (
                        <Badge className={getRasaColor(recipe.rasa)} variant="secondary">
                          {recipe.rasa}
                        </Badge>
                      )}
                      {recipe.diet_type && (
                        <Badge variant="outline">{recipe.diet_type}</Badge>
                      )}
                      {recipe.difficulty_level && (
                        <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                          {recipe.difficulty_level}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {recipe.cooking_time_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.cooking_time_minutes}m</span>
                          </div>
                        )}
                        {recipe.calories_per_serving && (
                          <div className="flex items-center gap-1">
                            <Utensils className="h-4 w-4" />
                            <span>{recipe.calories_per_serving} cal</span>
                          </div>
                        )}
                      </div>
                      {recipe.cuisine && (
                        <Badge variant="outline" className="text-xs">
                          {recipe.cuisine}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && filteredRecipes.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchRecipes(nextPage);
            }}
            disabled={loading}
          >
            Load More Recipes
          </Button>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl mb-2">{selectedRecipe.title}</DialogTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {selectedRecipe.cooking_time_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{selectedRecipe.cooking_time_minutes} minutes</span>
                        </div>
                      )}
                      {selectedRecipe.calories_per_serving && (
                        <div className="flex items-center gap-1">
                          <Utensils className="h-4 w-4" />
                          <span>{selectedRecipe.calories_per_serving} calories</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>1 serving</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(selectedRecipe.id)}
                  >
                    <Heart className={`h-5 w-5 ${selectedRecipe.is_favorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {selectedRecipe.image_url && (
                  <img
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                {selectedRecipe.description && (
                  <p className="text-muted-foreground">{selectedRecipe.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.rasa && (
                    <Badge className={getRasaColor(selectedRecipe.rasa)}>
                      {selectedRecipe.rasa}
                    </Badge>
                  )}
                  {selectedRecipe.diet_type && (
                    <Badge variant="outline">{selectedRecipe.diet_type}</Badge>
                  )}
                  {selectedRecipe.cuisine && (
                    <Badge variant="outline">{selectedRecipe.cuisine}</Badge>
                  )}
                  {selectedRecipe.difficulty_level && (
                    <Badge className={getDifficultyColor(selectedRecipe.difficulty_level)}>
                      {selectedRecipe.difficulty_level}
                    </Badge>
                  )}
                </div>

                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Ingredients:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecipe.instructions && (
                  <div>
                    <h4 className="font-semibold mb-3">Instructions:</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedRecipe.instructions}</p>
                    </div>
                  </div>
                )}

                {userType === 'patient' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Diet Plan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Utensils className="h-4 w-4 mr-2" />
                      Log as Meal
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Temporary error boundary for debugging
class RecipesPageErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('RecipesPage runtime error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: 'red', padding: 24 }}>
          <h2>RecipesPage Runtime Error</h2>
          <pre>{this.state.error && this.state.error.message}</pre>
          <pre>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const RecipesPageWithBoundary = (props: any) => (
  <RecipesPageErrorBoundary>
    <RecipesPage {...props} />
  </RecipesPageErrorBoundary>
);

export default RecipesPageWithBoundary;