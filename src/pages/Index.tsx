import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimeEntry } from "@/components/TimeEntry";
import { LogIn, LogOut, Clock } from "lucide-react";
import { toast } from "sonner";

interface TimeRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

const Index = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [currentSession, setCurrentSession] = useState<TimeRecord | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("timeRecords");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRecords(parsed);
      
      const active = parsed.find((r: TimeRecord) => !r.checkOut);
      if (active) {
        setCurrentSession(active);
      }
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saveRecords = (newRecords: TimeRecord[]) => {
    localStorage.setItem("timeRecords", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const [inHours, inMinutes, inSeconds] = checkIn.split(":").map(Number);
    const [outHours, outMinutes, outSeconds] = checkOut.split(":").map(Number);

    const inTotalSeconds = inHours * 3600 + inMinutes * 60 + inSeconds;
    const outTotalSeconds = outHours * 3600 + outMinutes * 60 + outSeconds;
    
    const diffSeconds = outTotalSeconds - inTotalSeconds;
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleCheckIn = () => {
    if (currentSession) {
      toast.error("Sie sind bereits eingecheckt!");
      return;
    }

    const now = new Date();
    const newRecord: TimeRecord = {
      id: Date.now().toString(),
      date: formatDate(now),
      checkIn: formatTime(now),
    };

    const newRecords = [newRecord, ...records];
    saveRecords(newRecords);
    setCurrentSession(newRecord);
    toast.success("Erfolgreich eingecheckt!");
  };

  const handleCheckOut = () => {
    if (!currentSession) {
      toast.error("Sie sind nicht eingecheckt!");
      return;
    }

    const now = new Date();
    const updatedRecord = {
      ...currentSession,
      checkOut: formatTime(now),
    };

    const newRecords = records.map((r) =>
      r.id === currentSession.id ? updatedRecord : r
    );

    saveRecords(newRecords);
    setCurrentSession(null);
    toast.success("Erfolgreich ausgecheckt!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h1 className="text-xl md:text-3xl font-bold text-foreground">Zeiterfassung</h1>
            </div>
            <div className="text-right">
              <div className="text-xs md:text-sm text-muted-foreground">Aktuelle Zeit</div>
              <div className="text-lg md:text-2xl font-semibold text-foreground">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Check-in/out Section */}
        <div className="mb-8 md:mb-12">
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 border">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                {currentSession ? "Sie sind eingecheckt" : "Bereit zum Einchecken"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {currentSession
                  ? `Eingecheckt seit ${currentSession.checkIn}`
                  : "Starten Sie Ihren Arbeitstag"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="success"
                size="xl"
                onClick={handleCheckIn}
                disabled={!!currentSession}
                className="w-full sm:w-auto sm:min-w-[200px] touch-manipulation"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Kommen
              </Button>
              <Button
                variant="accent"
                size="xl"
                onClick={handleCheckOut}
                disabled={!currentSession}
                className="w-full sm:w-auto sm:min-w-[200px] touch-manipulation"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Gehen
              </Button>
            </div>
          </div>
        </div>

        {/* Time Entries List */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
            Zeiteinträge
          </h2>

          {records.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-base md:text-lg text-muted-foreground">
                Noch keine Zeiteinträge vorhanden
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Checken Sie ein, um Ihre Arbeitszeit zu erfassen
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {records.map((record) => (
                <TimeEntry
                  key={record.id}
                  date={record.date}
                  checkIn={record.checkIn}
                  checkOut={record.checkOut}
                  duration={
                    record.checkOut
                      ? calculateDuration(record.checkIn, record.checkOut)
                      : undefined
                  }
                  type={
                    !record.checkOut
                      ? "checkin"
                      : record.checkOut
                      ? "complete"
                      : "checkout"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
