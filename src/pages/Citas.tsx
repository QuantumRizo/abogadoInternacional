import { useState } from 'react';
import { Calendar } from '@/components/Calendar';
import { AppointmentForm } from '@/components/AppointmentForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Citas() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectDateTime = (date: string, time: string) => {
    setSelectedDate(date);
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSuccess = () => {
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-primary-foreground hover:text-primary-foreground/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <h1 className="text-4xl font-bold">Agenda tu Cita</h1>
          <p className="text-primary-foreground/80 mt-2">
            Selecciona una fecha y hora disponible para tu consulta
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Calendar
              onSelectDateTime={handleSelectDateTime}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>

          <div>
            {selectedDate && selectedTime ? (
              <AppointmentForm
                date={selectedDate}
                time={selectedTime}
                onSuccess={handleSuccess}
              />
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Selecciona una fecha y hora para continuar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
