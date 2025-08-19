import { useState } from "react";
import { Calendar, Target, TrendingUp, User } from "lucide-react";
import { NutritionOverview } from "@/components/dashboard/nutrition-overview";
import { FoodSearch } from "@/components/food/food-search";
import { FoodLog, LoggedFood } from "@/components/food/food-log";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Mock user goals
  const userGoals = {
    calories: { current: 0, target: 2200 },
    protein: { current: 0, target: 165 },
    carbs: { current: 0, target: 275 },
    fat: { current: 0, target: 73 },
  };

  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [nutritionData, setNutritionData] = useState(userGoals);

  const updateNutritionData = (foods: LoggedFood[]) => {
    const totals = foods.reduce(
      (acc, food) => {
        const multiplier = food.quantity / 100;
        return {
          calories: acc.calories + Math.round(food.calories_per_100g * multiplier),
          protein: acc.protein + Math.round(food.protein_per_100g * multiplier * 10) / 10,
          carbs: acc.carbs + Math.round(food.carbs_per_100g * multiplier * 10) / 10,
          fat: acc.fat + Math.round(food.fat_per_100g * multiplier * 10) / 10,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setNutritionData({
      calories: { current: totals.calories, target: userGoals.calories.target },
      protein: { current: totals.protein, target: userGoals.protein.target },
      carbs: { current: totals.carbs, target: userGoals.carbs.target },
      fat: { current: totals.fat, target: userGoals.fat.target },
    });
  };

  const handleAddFood = (food: any, quantity: number) => {
    const newLoggedFood: LoggedFood = {
      id: `${Date.now()}-${Math.random()}`,
      name: food.name,
      brand: food.brand,
      quantity,
      calories_per_100g: food.calories_per_100g,
      protein_per_100g: food.protein_per_100g,
      carbs_per_100g: food.carbs_per_100g,
      fat_per_100g: food.fat_per_100g,
      logged_at: new Date(),
    };

    const updatedFoods = [...loggedFoods, newLoggedFood];
    setLoggedFoods(updatedFoods);
    updateNutritionData(updatedFoods);
  };

  const handleRemoveFood = (id: string) => {
    const updatedFoods = loggedFoods.filter(food => food.id !== id);
    setLoggedFoods(updatedFoods);
    updateNutritionData(updatedFoods);
  };

  const handleEditFood = (id: string, newQuantity: number) => {
    const updatedFoods = loggedFoods.map(food =>
      food.id === id ? { ...food, quantity: newQuantity } : food
    );
    setLoggedFoods(updatedFoods);
    updateNutritionData(updatedFoods);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">FitTracker</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="text-sm font-medium text-foreground">{today}</div>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Nutrition Overview */}
          <NutritionOverview data={nutritionData} />

          {/* Food Logging */}
          <Tabs defaultValue="log" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="log" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Food Log
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Add Food
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="log" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Today's Food Log</h2>
                  <div className="text-sm text-muted-foreground">
                    {loggedFoods.length} item{loggedFoods.length !== 1 ? 's' : ''} logged
                  </div>
                </div>
                <FoodLog
                  foods={loggedFoods}
                  onRemoveFood={handleRemoveFood}
                  onEditFood={handleEditFood}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="search" className="mt-6">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Add Food</h2>
                  <p className="text-sm text-muted-foreground">
                    Search our database to log your meals and track your nutrition
                  </p>
                </div>
                <FoodSearch onAddFood={handleAddFood} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
