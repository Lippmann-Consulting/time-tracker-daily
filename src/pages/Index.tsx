import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TimeEntry } from "@/components/TimeEntry";
import { Clock, LogIn, LogOut, Coffee, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Statistics, TimeRecord } from "@/components/Statistics";
import ChatbotWidget from "@/components/ChatbotWidget";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const Index = () => {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBreak, setCurrentBreak] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedRecords = localStorage.getItem("timeRecords");
    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords);
        setTimeRecords(parsed);
        
        const activeRecord = parsed.find((r: TimeRecord) => !r.checkOut);
        if (activeRecord) {
          setCurrentSession(activeRecord.id);
        }
      } catch (error) {
        console.error("Error parsing stored records:", error);
      }
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saveRecords = (records: TimeRecord[]) => {
    localStorage.setItem("timeRecords", JSON.stringify(records));
    setTimeRecords(records);
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

  const handleCheckIn = () => {
    const now = new Date();
    const newRecord: TimeRecord = {
      id: crypto.randomUUID(),
      date: now.toISOString().split("T")[0],
      checkIn: now.toISOString(),
      breaks: [],
      notes: notes.trim() || undefined,
    };
    
    const updatedRecords = [newRecord, ...timeRecords];
    saveRecords(updatedRecords);
    setCurrentSession(newRecord.id);
    setNotes("");
    
    // Konfetti-Effekt beim erfolgreichen Check-In
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Konfetti von beiden Seiten
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
    
    // Zusätzlicher Burst-Effekt in der Mitte
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        angle: 60,
        spread: 55
      });
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        angle: 120,
        spread: 55
      });
    }, 100);
    
    toast({
      title: "Check-In erfolgreich",
      description: "Arbeitszeit wird jetzt erfasst",
    });
  };

  const handleCheckOut = () => {
    if (!currentSession) return;

    if (currentBreak) {
      handleEndBreak();
    }

    const updatedRecords = timeRecords.map((record) =>
      record.id === currentSession
        ? { ...record, checkOut: new Date().toISOString(), notes: notes.trim() || record.notes }
        : record
    );
    
    saveRecords(updatedRecords);
    setCurrentSession(null);
    setNotes("");
    
    toast({
      title: "Check-Out erfolgreich",
      description: "Arbeitszeit wurde gespeichert",
    });
  };

  const handleStartBreak = () => {
    if (!currentSession) return;

    const breakId = crypto.randomUUID();
    const now = new Date();
    
    const updatedRecords = timeRecords.map((record) => {
      if (record.id === currentSession) {
        const breaks = record.breaks || [];
        return {
          ...record,
          breaks: [...breaks, { start: now.toISOString() }],
        };
      }
      return record;
    });
    
    saveRecords(updatedRecords);
    setCurrentBreak(breakId);
    
    toast({
      title: "Pause gestartet",
      description: "Pausenzeit wird erfasst",
    });
  };

  const handleEndBreak = () => {
    if (!currentSession || !currentBreak) return;

    const now = new Date();
    
    const updatedRecords = timeRecords.map((record) => {
      if (record.id === currentSession && record.breaks) {
        const breaks = [...record.breaks];
        const lastBreak = breaks[breaks.length - 1];
        if (lastBreak && !lastBreak.end) {
          lastBreak.end = now.toISOString();
        }
        return { ...record, breaks };
      }
      return record;
    });
    
    saveRecords(updatedRecords);
    setCurrentBreak(null);
    
    toast({
      title: "Pause beendet",
      description: "Arbeitszeit läuft wieder",
    });
  };

  const handleDeleteRecord = (id: string) => {
    const updatedRecords = timeRecords.filter((record) => record.id !== id);
    saveRecords(updatedRecords);
    
    toast({
      title: "Eintrag gelöscht",
      description: "Der Zeiteintrag wurde entfernt",
    });
  };

  const handleUpdateNotes = (id: string, newNotes: string) => {
    const updatedRecords = timeRecords.map((record) =>
      record.id === id ? { ...record, notes: newNotes } : record
    );
    saveRecords(updatedRecords);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" aria-hidden="true" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Zeiterfassung
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Aktuelle Zeit</p>
                <time className="text-xl md:text-2xl font-semibold text-foreground" dateTime={currentTime.toISOString()}>
                  {formatTime(currentTime)}
                </time>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <section aria-labelledby="time-tracking-heading" className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <h2 id="time-tracking-heading" className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
              Arbeitszeit erfassen
            </h2>
            
            {!currentSession && (
              <div className="mb-4">
                <Label htmlFor="notes-input" className="text-foreground">
                  Notizen (optional)
                </Label>
                <Textarea
                  id="notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="z.B. Meeting mit Chef, Projekt XY..."
                  maxLength={500}
                  className="mt-2 resize-none"
                  rows={3}
                  aria-describedby="notes-hint"
                />
                <p id="notes-hint" className="text-xs text-muted-foreground mt-1">
                  {notes.length}/500 Zeichen
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {!currentSession ? (
                <Button
                  onClick={handleCheckIn}
                  className="flex-1 h-14 md:h-16 text-base md:text-lg font-semibold bg-orange-500 hover:bg-green-500 text-white touch-manipulation active:scale-95 transition-all duration-300 light-chain-border relative"
                  aria-label="Arbeitsbeginn erfassen"
                >
                  <LogIn className="mr-2 h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                  Check-In
                </Button>
              ) : (
                <>
                  {!currentBreak ? (
                    <Button
                      onClick={handleStartBreak}
                      variant="outline"
                      className="flex-1 h-14 md:h-16 text-base md:text-lg font-semibold border-2 touch-manipulation active:scale-95 transition-transform"
                      aria-label="Pause beginnen"
                    >
                      <Coffee className="mr-2 h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={handleEndBreak}
                      className="flex-1 h-14 md:h-16 text-base md:text-lg font-semibold bg-warning hover:bg-warning/90 text-warning-foreground touch-manipulation active:scale-95 transition-transform"
                      aria-label="Pause beenden"
                    >
                      <Coffee className="mr-2 h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                      Pause beenden
                    </Button>
                  )}
                  <Button
                    onClick={handleCheckOut}
                    className="flex-1 h-14 md:h-16 text-base md:text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground touch-manipulation active:scale-95 transition-transform"
                    aria-label="Arbeitsende erfassen"
                  >
                    <LogOut className="mr-2 h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                    Check-Out
                  </Button>
                </>
              )}
            </div>
            
            {currentSession && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20" role="status" aria-live="polite">
                <p className="text-foreground font-medium text-center">
                  ⏱️ Arbeitszeit läuft seit {formatTime(new Date(timeRecords.find(r => r.id === currentSession)?.checkIn || ''))}
                  {currentBreak && <span className="ml-2 text-warning">(Pause läuft)</span>}
                </p>
              </div>
            )}
          </section>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className="touch-manipulation"
              aria-expanded={showStats}
              aria-controls="statistics-section"
            >
              <TrendingUp className="mr-2 h-5 w-5" aria-hidden="true" />
              {showStats ? "Statistiken ausblenden" : "Statistiken anzeigen"}
            </Button>
          </div>
          
          {showStats && (
            <div id="statistics-section">
              <Statistics records={timeRecords} />
            </div>
          )}

          <section aria-labelledby="entries-heading" className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <h2 id="entries-heading" className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
              Zeiteinträge
            </h2>
            
            {timeRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Noch keine Zeiteinträge vorhanden. Starte mit einem Check-In!
              </p>
            ) : (
              <ul className="space-y-3" role="list">
                {timeRecords.map((record) => (
                  <li key={record.id}>
                    <TimeEntry 
                      record={record} 
                      onDelete={handleDeleteRecord}
                      onUpdateNotes={handleUpdateNotes}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
};

export default Index;
