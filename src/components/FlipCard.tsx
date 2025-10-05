import { useState } from "react";
import { Card } from "@/components/ui/card";

interface FlipCardProps {
  isFlipping: boolean;
  result: "win" | "lose" | null;
}

export const FlipCard = ({ isFlipping, result }: FlipCardProps) => {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 perspective-1000">
      <Card
        className={`
          absolute inset-0 flex items-center justify-center
          border-2 transition-all duration-300
          ${isFlipping ? "animate-flip" : ""}
          ${result === "win" ? "border-success glow-success animate-win" : ""}
          ${result === "lose" ? "border-destructive animate-lose" : ""}
          ${!result ? "border-primary glow" : ""}
        `}
      >
        <div className="text-6xl md:text-7xl font-bold">
          {result === null && "?"}
          {result === "win" && "🎉"}
          {result === "lose" && "💥"}
        </div>
      </Card>
    </div>
  );
};
