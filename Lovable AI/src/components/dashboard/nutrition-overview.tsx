import { MacroCard } from "./macro-card";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";

interface NutritionData {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

interface NutritionOverviewProps {
  data: NutritionData;
}

export const NutritionOverview = ({ data }: NutritionOverviewProps) => {
  const caloriePercentage = Math.min((data.calories.current / data.calories.target) * 100, 100);
  const remaining = Math.max(data.calories.target - data.calories.current, 0);

  return (
    <div className="space-y-6">
      {/* Main Calorie Card */}
      <Card className="p-8 bg-gradient-primary text-primary-foreground border-0 shadow-strong">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Today's Calories</h2>
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {data.calories.current}
              </div>
              <div className="text-primary-foreground/80">
                of {data.calories.target} kcal
              </div>
              <div className="text-sm text-primary-foreground/70">
                {remaining} kcal remaining
              </div>
            </div>
          </div>
          
          <ProgressRing
            percentage={caloriePercentage}
            size={140}
            strokeWidth={8}
            color="white"
            backgroundColor="rgba(255,255,255,0.2)"
          >
            <div className="text-center text-white">
              <div className="text-xl font-bold">{Math.round(caloriePercentage)}%</div>
              <div className="text-xs opacity-80">complete</div>
            </div>
          </ProgressRing>
        </div>
      </Card>

      {/* Macro Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MacroCard
          label="Protein"
          current={data.protein.current}
          target={data.protein.target}
          unit="g"
          color="hsl(var(--protein))"
        />
        <MacroCard
          label="Carbs"
          current={data.carbs.current}
          target={data.carbs.target}
          unit="g"
          color="hsl(var(--carbs))"
        />
        <MacroCard
          label="Fat"
          current={data.fat.current}
          target={data.fat.target}
          unit="g"
          color="hsl(var(--fat))"
        />
      </div>
    </div>
  );
};