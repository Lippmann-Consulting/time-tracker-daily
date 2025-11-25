import { useState, useRef } from "react";
import { Trash2, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeRecord } from "@/components/Statistics";

interface TimeEntryProps {
  record: TimeRecord;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const TimeEntry = ({ record, onDelete, onUpdateNotes }: TimeEntryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(record.notes || "");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const entryRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    const distance = e.targetTouches[0].clientX - touchStart;
    if (distance < 0) {
      setSwipeOffset(Math.max(distance, -100));
    }
  };

  const handleTouchEnd = () => {
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      onDelete(record.id);
    }
    
    setSwipeOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(record.id, editNotes);
    setIsEditing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let durationMs = end.getTime() - start.getTime();

    // Subtract breaks
    if (record.breaks) {
      record.breaks.forEach((breakItem) => {
        if (breakItem.end) {
          const breakStart = new Date(breakItem.start).getTime();
          const breakEnd = new Date(breakItem.end).getTime();
          durationMs -= (breakEnd - breakStart);
        }
      });
    }
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div 
      ref={entryRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="bg-card border border-border rounded-lg p-3 md:p-4 hover:shadow-md transition-all"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <time dateTime={record.date} className="text-sm text-muted-foreground font-medium">
              {formatDate(record.date)}
            </time>
            <div className="flex items-center gap-2">
              {record.checkOut && (
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {calculateDuration(record.checkIn, record.checkOut)}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                aria-label={isEditing ? "Bearbeitung abbrechen" : "Notizen bearbeiten"}
                className="h-8 w-8"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(record.id)}
                aria-label="Eintrag löschen"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1">
              <span className="text-muted-foreground">Check-In:</span>
              <time dateTime={record.checkIn} className="ml-2 font-semibold text-foreground">
                {formatTime(new Date(record.checkIn))}
              </time>
            </div>
            
            <div className="flex-1">
              <span className="text-muted-foreground">Check-Out:</span>
              <time dateTime={record.checkOut} className="ml-2 font-semibold text-foreground">
                {record.checkOut
                  ? formatTime(new Date(record.checkOut))
                  : "Läuft..."}
              </time>
            </div>
          </div>

          {record.breaks && record.breaks.length > 0 && (
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="font-medium">Pausen:</span> {record.breaks.length}x
            </div>
          )}

          {isEditing ? (
            <div className="pt-2 space-y-2">
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Notizen hinzufügen..."
                maxLength={500}
                rows={3}
                className="resize-none text-sm"
                aria-label="Notizen bearbeiten"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditNotes(record.notes || "");
                  }}
                >
                  Abbrechen
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                >
                  <Save className="h-4 w-4 mr-1" aria-hidden="true" />
                  Speichern
                </Button>
              </div>
            </div>
          ) : record.notes ? (
            <p className="text-sm text-muted-foreground pt-2 border-t border-border italic">
              {record.notes}
            </p>
          ) : null}
        </div>
      </div>
      
      {swipeOffset < -50 && (
        <div 
          className="absolute right-0 top-0 h-full bg-destructive text-destructive-foreground flex items-center px-4 rounded-r-lg"
          style={{ width: Math.abs(swipeOffset) }}
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
