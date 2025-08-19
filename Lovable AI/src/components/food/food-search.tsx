import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

interface FoodSearchProps {
  onAddFood: (food: FoodItem, quantity: number) => void;
}

// Mock food database
const MOCK_FOODS: FoodItem[] = [
  {
    id: "1",
    name: "Chicken Breast",
    brand: "Generic",
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6
  },
  {
    id: "2",
    name: "Brown Rice",
    brand: "Generic",
    calories_per_100g: 123,
    protein_per_100g: 2.6,
    carbs_per_100g: 23,
    fat_per_100g: 0.9
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Fage",
    calories_per_100g: 59,
    protein_per_100g: 10,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4
  },
  {
    id: "4",
    name: "Banana",
    brand: "Generic",
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 23,
    fat_per_100g: 0.3
  },
  {
    id: "5",
    name: "Almonds",
    brand: "Generic",
    calories_per_100g: 579,
    protein_per_100g: 21,
    carbs_per_100g: 22,
    fat_per_100g: 50
  }
];

export const FoodSearch = ({ onAddFood }: FoodSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = MOCK_FOODS.filter(food =>
        food.name.toLowerCase().includes(term.toLowerCase()) ||
        food.brand?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleAddFood = (food: FoodItem) => {
    // Default to 100g serving
    onAddFood(food, 100);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-card border-border focus:ring-primary"
        />
      </div>

      {isSearching && (
        <div className="text-center text-muted-foreground py-4">
          Searching...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchResults.map((food) => (
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
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{food.calories_per_100g} cal</span>
                    <span className="text-protein">{food.protein_per_100g}g protein</span>
                    <span className="text-carbs">{food.carbs_per_100g}g carbs</span>
                    <span className="text-fat">{food.fat_per_100g}g fat</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    per 100g
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddFood(food)}
                  className="ml-4 bg-primary hover:bg-primary-glow transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};