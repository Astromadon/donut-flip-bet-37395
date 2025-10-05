import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface FlipRecord {
  id: string;
  amount: number;
  result: "win" | "lose";
  timestamp: Date;
}

interface FlipHistoryProps {
  history: FlipRecord[];
}

export const FlipHistory = ({ history }: FlipHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Flip History</h3>
        <p className="text-muted-foreground text-center py-8">
          No flips yet. Start playing to see your history!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Flip History</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${record.result === "win" ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {record.result === "win" ? "🎉" : "💥"}
                </span>
                <div>
                  <p className={`font-semibold ${record.result === "win" ? "text-success" : "text-destructive"}`}>
                    {record.result === "win" ? "Won" : "Lost"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {record.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`font-bold text-lg ${record.result === "win" ? "text-success" : "text-destructive"}`}>
                {record.result === "win" ? "+" : "-"}
                {record.amount}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
