import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bomb, Gem } from "lucide-react";

interface MinesGridProps {
  mineCount: number;
  betAmount: number;
  onGameEnd: (won: boolean, multiplier: number) => void;
  onReset: () => void;
}

const GRID_SIZE = 25;

export const MinesGrid = ({ mineCount, betAmount, onGameEnd, onReset }: MinesGridProps) => {
  const [grid, setGrid] = useState<boolean[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hitMine, setHitMine] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    initializeGrid();
  }, [mineCount]);

  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(false);
    const minePositions = new Set<number>();
    
    while (minePositions.size < mineCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }
    
    minePositions.forEach(pos => {
      newGrid[pos] = true;
    });
    
    setGrid(newGrid);
    setRevealed(Array(GRID_SIZE).fill(false));
    setGameOver(false);
    setHitMine(false);
    setRevealedCount(0);
  };

  const calculateMultiplier = (safeRevealed: number): number => {
    const safeTiles = GRID_SIZE - mineCount;
    if (safeRevealed === 0) return 1;
    
    let multiplier = 1;
    for (let i = 0; i < safeRevealed; i++) {
      multiplier *= (safeTiles / (safeTiles - i)) * 1.08;
    }
    return multiplier;
  };

  const currentMultiplier = calculateMultiplier(revealedCount);

  const handleTileClick = (index: number) => {
    if (gameOver || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (grid[index]) {
      // Hit a mine
      setHitMine(true);
      setGameOver(true);
      // Reveal all mines
      const allRevealed = grid.map((isMine, i) => isMine || newRevealed[i]);
      setRevealed(allRevealed);
      onGameEnd(false, 0);
    } else {
      // Safe tile
      const newCount = revealedCount + 1;
      setRevealedCount(newCount);
      
      // Check if won (all safe tiles revealed)
      if (newCount === GRID_SIZE - mineCount) {
        setGameOver(true);
        onGameEnd(true, calculateMultiplier(newCount));
      }
    }
  };

  const handleCashOut = () => {
    if (revealedCount === 0 || gameOver) return;
    setGameOver(true);
    onGameEnd(true, currentMultiplier);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Current Multiplier</p>
          <p className="text-3xl font-bold text-accent">{currentMultiplier.toFixed(2)}x</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Potential Win</p>
          <p className="text-3xl font-bold text-success">
            {Math.floor(betAmount * currentMultiplier)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {grid.map((isMine, index) => (
          <Button
            key={index}
            variant="outline"
            className={`aspect-square p-0 h-16 text-2xl transition-all ${
              revealed[index]
                ? isMine
                  ? "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-success/20 text-success border-success"
                : "hover:bg-accent/20 hover:border-accent"
            } ${gameOver ? "cursor-not-allowed" : ""}`}
            onClick={() => handleTileClick(index)}
            disabled={gameOver}
          >
            {revealed[index] && (
              <span className="animate-scale-in">
                {isMine ? <Bomb className="w-6 h-6" /> : <Gem className="w-6 h-6" />}
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="flip"
          size="lg"
          onClick={handleCashOut}
          disabled={gameOver || revealedCount === 0}
          className="flex-1"
        >
          Cash Out ({Math.floor(betAmount * currentMultiplier)} coins)
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            initializeGrid();
            onReset();
          }}
        >
          New Game
        </Button>
      </div>
    </div>
  );
};
