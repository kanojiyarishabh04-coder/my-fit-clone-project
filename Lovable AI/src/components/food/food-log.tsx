import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface LoggedFood {
  id: string;
  name: string;
  brand?: string;
  quantity: number; // in grams
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  logged_at: Date;
}

interface FoodLogProps {
  foods: LoggedFood[];
  onRemoveFood: (id: string) => void;
  onEditFood: (id: string, newQuantity: number) => void;
}

export const FoodLog = ({ foods, onRemoveFood, onEditFood }: FoodLogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>("");

  const handleStartEdit = (food: LoggedFood) => {
    setEditingId(food.id);
    setEditQuantity(food.quantity.toString());
  };

  const handleSaveEdit = (id: string) => {
    const quantity = parseInt(editQuantity);
    if (quantity > 0) {
      onEditFood(id, quantity);
    }
    setEditingId(null);
    setEditQuantity("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity("");
  };

  const calculateNutrition = (food: LoggedFood) => {
    const multiplier = food.quantity / 100;
    return {
      calories: Math.round(food.calories_per_100g * multiplier),
      protein: Math.round(food.protein_per_100g * multiplier * 10) / 10,
      carbs: Math.round(food.carbs_per_100g * multiplier * 10) / 10,
      fat: Math.round(food.fat_per_100g * multiplier * 10) / 10,
    };
  };

  const totalNutrition = foods.reduce(
    (total, food) => {
      const nutrition = calculateNutrition(food);
      return {
        calories: total.calories + nutrition.calories,
        protein: total.protein + nutrition.protein,
        carbs: total.carbs + nutrition.carbs,
        fat: total.fat + nutrition.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (foods.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-subtle">
        <div className="text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">No foods logged yet</h3>
          <p className="text-sm">Start by searching for foods above</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Summary */}
      <Card className="p-4 bg-muted border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Today's Total:</span>
          <div className="flex gap-4">
            <span className="font-medium">{totalNutrition.calories} cal</span>
            <span className="text-protein">{totalNutrition.protein}g P</span>
            <span className="text-carbs">{totalNutrition.carbs}g C</span>
            <span className="text-fat">{totalNutrition.fat}g F</span>
          </div>
        </div>
      </Card>

      {/* Food Items */}
      <div className="space-y-2">
        {foods.map((food) => {
          const nutrition = calculateNutrition(food);
          const isEditing = editingId === food.id;

          return (
            <Card key={food.id} className="p-4 hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{food.name}</h4>
                    {food.brand && (
                      <Badge variant="secondary" className="text-xs">
                        {food.brand}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-sm"
                          autoFocus
                        />
                        <span className="text-muted-foreground">g</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveEdit(food.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="h-6 px-2 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-muted-foreground">{food.quantity}g</span>
                        <span className="font-medium">{nutrition.calories} cal</span>
                        <span className="text-protein">{nutrition.protein}g protein</span>
                        <span className="text-carbs">{nutrition.carbs}g carbs</span>
                        <span className="text-fat">{nutrition.fat}g fat</span>
                      </>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartEdit(food)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveFood(food.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};