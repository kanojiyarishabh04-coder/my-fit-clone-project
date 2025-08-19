import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  className?: string;
}

export const MacroCard = ({ 
  label, 
  current, 
  target, 
  unit, 
  color,
  className 
}: MacroCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <Card className={cn(
      "p-6 bg-gradient-subtle border-0 shadow-medium transition-all duration-300 hover:shadow-strong hover:scale-105",
      className
    )}>
      <div className="flex flex-col items-center text-center space-y-4">
        <ProgressRing
          percentage={percentage}
          size={100}
          strokeWidth={6}
          color={color}
          className="mb-2"
        >
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{current}</div>
            <div className="text-xs text-muted-foreground">of {target}</div>
          </div>
        </ProgressRing>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
            {label}
          </h3>
          <p className="text-xs text-muted-foreground">
            {remaining} {unit} remaining
          </p>
        </div>
      </div>
    </Card>
  );
};