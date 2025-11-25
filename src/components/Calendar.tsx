import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

// --- SECCIÓN DE IMPORTACIÓN REAL (Descomentar en tu proyecto) ---
// import { supabase } from '@/integrations/supabase/client';

// --- MOCK PARA PREVISUALIZACIÓN (Borrar en tu proyecto) ---
const supabase = {
  from: (table: string) => ({
    select: (fields: string) => ({
      eq: (field: string, value: any) => ({
        gte: (field: string, value: any) => ({
          lte: async (field: string, value: any) => {
            console.log('Fetching slots for', value);
            return { data: [] }; // Retornar array vacío para demo
          }
        })
      })
    })
  })
};
// -----------------------------------------------------------

interface CalendarProps {
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
}

// Configuración de Horarios por día de la semana (0 = Domingo, 1 = Lunes, ...)
const weeklySchedule: Record<number, string[]> = {
  0: [], // Domingo: Cerrado
  1: ['13:00', '14:00', '15:00', '16:00'], // Lunes: 1pm a 4pm
  2: ['09:00', '10:00', '16:00'],          // Martes: 9-10am, 10-11am, 4-5pm
  3: ['09:00', '10:00', '11:00', '12:00'], // Miércoles: 9am a 12pm
  4: ['13:00', '14:00', '15:00', '16:00'], // Jueves: 1pm a 4pm
  5: ['13:00', '14:00', '15:00', '16:00'], // Viernes: 1pm a 4pm
  6: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] // Sábado: 9am a 4pm
};

export function Calendar({ onSelectDateTime, selectedDate, selectedTime }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [dailyAvailableTimes, setDailyAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    loadBookedSlots();
  }, [currentMonth]);

  // Sincronizar el mes del calendario si se selecciona una fecha lejana manualmente
  useEffect(() => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate + 'T00:00:00');
      // Si la fecha seleccionada está en un mes diferente al mostrado, actualizamos la vista
      if (dateObj.getMonth() !== currentMonth.getMonth() || dateObj.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
      }
      
      const dayOfWeek = dateObj.getDay();
      setDailyAvailableTimes(weeklySchedule[dayOfWeek] || []);
    } else {
      setDailyAvailableTimes([]);
    }
  }, [selectedDate]);

  const loadBookedSlots = async () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // @ts-ignore - Mock bypass
    const { data } = await supabase
      .from('appointments')
      .select('date, time')
      .eq('status', 'scheduled')
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (data) {
      const slots = new Set(data.map((slot: any) => `${slot.date}_${slot.time}`));
      setBookedSlots(slots);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isDateAvailable = (day: number) => {
    const dateStr = formatDate(day);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const today = new Date().toISOString().split('T')[0];
    
    // Deshabilitar si es pasado
    if (dateStr < today) return false;

    // Deshabilitar Domingos (0)
    if (dateObj.getDay() === 0) return false;

    return true;
  };

  const isTimeBooked = (date: string, time: string) => {
    return bookedSlots.has(`${date}_${time}`);
  };

  const getDayWarning = (dateStr: string) => {
    if (!dateStr) return null;
    const dateObj = new Date(dateStr + 'T00:00:00');
    if (dateObj.getDay() === 0) {
      return "⚠️ Los domingos estamos cerrados.";
    }
    return null;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Calendario */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className={`text-center font-semibold text-sm p-2 ${day === 'Dom' ? 'text-destructive/50' : 'text-muted-foreground'}`}>
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, index) => {
              if (!day) return <div key={index} />;
              
              const date = formatDate(day);
              const available = isDateAvailable(day);
              const isSelected = selectedDate === date;

              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-12 ${!available ? 'opacity-30 cursor-not-allowed bg-muted' : ''}`}
                  disabled={!available}
                  onClick={() => onSelectDateTime(date, '')}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

            {/* Horarios disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Horarios Disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opción 1: Botones predefinidos */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              {dailyAvailableTimes.length > 0 ? (
                dailyAvailableTimes.map(time => {
                  const booked = selectedDate ? isTimeBooked(selectedDate, time) : false;
                  const isSelected = selectedTime === time;
                  const isDisabled = !selectedDate || booked;

                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      className={booked ? 'opacity-50 cursor-not-allowed line-through' : ''}
                      disabled={isDisabled}
                      onClick={() => selectedDate && onSelectDateTime(selectedDate, time)}
                    >
                      {time}
                    </Button>
                  );
                })
              ) : (
                selectedDate && (
                  <div className="col-span-3 text-center py-4 text-muted-foreground bg-muted/20 rounded-lg text-sm">
                    {new Date(selectedDate + 'T00:00:00').getDay() === 0 
                      ? "Cerrado los domingos." 
                      : "No hay horarios predefinidos para este día."}
                  </div>
                )
              )}
            </div>
            {!selectedDate && (
              <p className="text-xs text-muted-foreground text-center">
                Selecciona un día en el calendario o usa la selección manual abajo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Separador */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 py-1 text-muted-foreground font-medium">
            Si no ves un horario que te convenga, puedes escribir uno abajo
          </span>
        </div>
      </div>

      {/* --- NUEVO CARD: Selección Manual (100% hasta abajo) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Escribir tu propio horario</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manual-date" className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5" />
                Fecha
              </Label>
              <Input
                id="manual-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate || ''}
                onChange={(e) => onSelectDateTime(e.target.value, selectedTime || '')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-time" className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                Hora
              </Label>
              <Input 
                id="custom-time"
                type="text"
                placeholder="Ej. 14:30"
                value={!dailyAvailableTimes.includes(selectedTime || '') ? selectedTime || '' : ''}
                onChange={(e) => onSelectDateTime(selectedDate || '', e.target.value)}
              />
            </div>
          </div>

          {selectedDate && getDayWarning(selectedDate) && (
            <p className="text-xs text-destructive font-medium text-center">
              {getDayWarning(selectedDate)}
            </p>
          )}

          {!selectedDate && (
            <p className="text-xs text-amber-600 text-center">
              ⚠️ Selecciona una fecha para continuar.
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}