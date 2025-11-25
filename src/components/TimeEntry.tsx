import { Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TimeEntryProps {
  date: string;
  checkIn: string;
  checkOut?: string;
  duration?: string;
  type: "checkin" | "checkout" | "complete";
}

export const TimeEntry = ({ date, checkIn, checkOut, duration, type }: TimeEntryProps) => {
  const getColorClass = () => {
    switch (type) {
      case "complete":
        return "border-l-success bg-success/5";
      case "checkin":
        return "border-l-accent bg-accent/5";
      default:
        return "border-l-muted bg-muted/20";
    }
  };

  return (
    <Card className={`p-3 md:p-4 border-l-4 transition-all hover:shadow-md ${getColorClass()}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="space-y-2 flex-1 w-full">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="font-medium truncate">{date}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-success flex-shrink-0" />
              <span className="font-semibold text-foreground">Kommen:</span>
              <span className="text-muted-foreground">{checkIn}</span>
            </div>
            
            {checkOut && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                <span className="font-semibold text-foreground">Gehen:</span>
                <span className="text-muted-foreground">{checkOut}</span>
              </div>
            )}
          </div>
        </div>
        
        {duration && (
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-xs text-muted-foreground mb-1">Arbeitszeit</div>
            <div className="text-base md:text-lg font-bold text-primary">{duration}</div>
          </div>
        )}
      </div>
    </Card>
  );
};
