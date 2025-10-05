import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MinesGrid } from "@/components/MinesGrid";
import { FlipHistory, FlipRecord } from "@/components/FlipHistory";
import { toast } from "sonner";
import { Coins, TrendingUp, Trophy, Bomb } from "lucide-react";

const STORAGE_KEY = "donutflip_data";
const INITIAL_BALANCE = 1000;

interface GameData {
  balance: number;
  history: FlipRecord[];
}

const Index = () => {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [betAmount, setBetAmount] = useState<string>("100");
  const [mineCount, setMineCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<FlipRecord[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data: GameData = JSON.parse(savedData);
      setBalance(data.balance);
      setHistory(
        data.history.map((record) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        }))
      );
    }
  }, []);

  // Save data to localStorage
  const saveData = (newBalance: number, newHistory: FlipRecord[]) => {
    const data: GameData = {
      balance: newBalance,
      history: newHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleStartGame = () => {
    const amount = parseInt(betAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance!");
      return;
    }

    setBalance(balance - amount);
    setIsPlaying(true);
  };

  const handleGameEnd = (won: boolean, multiplier: number) => {
    const amount = parseInt(betAmount);
    const winAmount = won ? Math.floor(amount * multiplier) : 0;
    const newBalance = balance + winAmount;

    const record: FlipRecord = {
      id: Date.now().toString(),
      amount: won ? winAmount - amount : amount,
      result: won ? "win" : "lose",
      timestamp: new Date(),
    };

    setBalance(newBalance);
    const newHistory = [record, ...history].slice(0, 50);
    setHistory(newHistory);
    saveData(newBalance, newHistory);

    if (won) {
      toast.success(`You won ${winAmount - amount} coins! 🎉`, {
        className: "bg-success text-success-foreground",
      });
    } else {
      toast.error(`You lost ${amount} coins 💣`, {
        className: "bg-destructive text-destructive-foreground",
      });
    }

    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
  };

  const resetBalance = () => {
    setBalance(INITIAL_BALANCE);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.info("Balance reset to 1000 coins");
  };

  const totalWins = history.filter((r) => r.result === "win").length;
  const totalLosses = history.filter((r) => r.result === "lose").length;
  const winRate = history.length > 0 ? ((totalWins / history.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
            DonutMines
          </h1>
          <p className="text-xl text-muted-foreground">
            Reveal tiles and multiply your bet - but avoid the mines!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <Card className="p-6 border-primary/50 glow">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold text-accent">{balance}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-success/50">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-success">{winRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-secondary/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Flips</p>
                <p className="text-2xl font-bold text-secondary">{history.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Mines Interface */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-8 border-primary/50 glow-intense">
            {!isPlaying ? (
              <div className="w-full space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bet Amount</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter bet amount"
                    className="text-center text-lg font-semibold"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount("100")}
                  >
                    100
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount("250")}
                  >
                    250
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount("500")}
                  >
                    500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(balance.toString())}
                    disabled={balance === 0}
                  >
                    All In
                  </Button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">Number of Mines</label>
                    <div className="flex items-center gap-2">
                      <Bomb className="w-4 h-4 text-destructive" />
                      <span className="text-lg font-bold text-destructive">{mineCount}</span>
                    </div>
                  </div>
                  <Slider
                    value={[mineCount]}
                    onValueChange={(value) => setMineCount(value[0])}
                    min={1}
                    max={23}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 mine</span>
                    <span>23 mines</span>
                  </div>
                </div>

                <Button
                  variant="flip"
                  size="xl"
                  onClick={handleStartGame}
                  className="w-full"
                >
                  START GAME
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetBalance}
                  className="w-full"
                >
                  Reset Balance
                </Button>
              </div>
            ) : (
              <MinesGrid
                mineCount={mineCount}
                betAmount={parseInt(betAmount)}
                onGameEnd={handleGameEnd}
                onReset={handleReset}
              />
            )}
          </Card>
        </div>

        {/* History */}
        <div className="max-w-2xl mx-auto">
          <FlipHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default Index;
