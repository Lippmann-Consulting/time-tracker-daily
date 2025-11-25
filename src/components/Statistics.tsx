import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Break {
  start: string;
  end?: string;
}

export interface TimeRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  breaks?: Break[];
  notes?: string;
}

interface StatisticsProps {
  records: TimeRecord[];
}

export function Statistics({ records }: StatisticsProps) {
  const calculateStats = () => {
    let totalMs = 0;
    let completedDays = 0;
    let totalBreakMs = 0;

    records.forEach((record) => {
      if (record.checkOut) {
        const start = new Date(record.checkIn).getTime();
        const end = new Date(record.checkOut).getTime();
        let workMs = end - start;

        // Subtract breaks
        if (record.breaks) {
          record.breaks.forEach((breakItem) => {
            if (breakItem.end) {
              const breakStart = new Date(breakItem.start).getTime();
              const breakEnd = new Date(breakItem.end).getTime();
              const breakDuration = breakEnd - breakStart;
              workMs -= breakDuration;
              totalBreakMs += breakDuration;
            }
          });
        }

        totalMs += workMs;
        completedDays++;
      }
    });

    const totalHours = totalMs / (1000 * 60 * 60);
    const avgHours = completedDays > 0 ? totalHours / completedDays : 0;
    const totalBreakHours = totalBreakMs / (1000 * 60 * 60);

    return {
      totalHours: totalHours.toFixed(2),
      avgHours: avgHours.toFixed(2),
      completedDays,
      totalBreakHours: totalBreakHours.toFixed(2),
      activeDays: records.length,
    };
  };

  const stats = calculateStats();

  return (
    <section aria-labelledby="statistics-heading" className="space-y-4">
      <h2 id="statistics-heading" className="text-xl font-semibold text-foreground">
        Statistiken
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gesamtarbeitszeit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.totalHours}h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Durchschnitt/Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.avgHours}h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Abgeschlossene Tage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.completedDays}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gesamt Pausen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.totalBreakHours}h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Aktive Tage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.activeDays}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
