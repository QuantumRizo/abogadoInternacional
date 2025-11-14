import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CalendarProps {
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
}

// Horarios disponibles (9:00 - 18:00, cada hora)
const availableTimes = [
  '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function Calendar({ onSelectDateTime, selectedDate, selectedTime }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookedSlots();
  }, [currentMonth]);

  const loadBookedSlots = async () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data } = await supabase
      .from('appointments')
      .select('date, time')
      .eq('status', 'scheduled')
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (data) {
      const slots = new Set(data.map(slot => `${slot.date}_${slot.time}`));
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
    const date = formatDate(day);
    const today = new Date().toISOString().split('T')[0];
    return date >= today;
  };

  const isTimeBooked = (date: string, time: string) => {
    return bookedSlots.has(`${date}_${time}`);
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
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
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
                  className={`h-12 ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Horarios Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map(time => {
                const booked = isTimeBooked(selectedDate, time);
                const isSelected = selectedTime === time;

                return (
                  <Button
                    key={time}
                    variant={isSelected ? "default" : "outline"}
                    className={booked ? 'opacity-50 cursor-not-allowed line-through' : ''}
                    disabled={booked}
                    onClick={() => onSelectDateTime(selectedDate, time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
