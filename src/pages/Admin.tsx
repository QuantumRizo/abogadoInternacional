import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, X, LogOut, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  status: 'scheduled' | 'cancelled';
}

export default function Admin() {
  const { user, loading, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // modal reagendar
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [takenTimes, setTakenTimes] = useState<string[]>([]);

  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    if (user) loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) toast.error('Error al cargar las citas');
    else setAppointments(data || []);
  };

  const loadTakenTimes = async (date: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .eq('status', 'scheduled');

    setTakenTimes(data?.map(d => d.time) || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    if (error) toast.error(error.message);

    setIsLoading(false);
  };

  const handleCancelAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) toast.error('Error al cancelar la cita');
    else {
      toast.success('Cita cancelada');
      loadAppointments();
    }
  };

  const openReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    loadTakenTimes(appointment.date);
    setRescheduleOpen(true);
  };

  const handleReschedule = async () => {
    if (!selectedAppointment) return;

    const { error } = await supabase
      .from('appointments')
      .update({ date: newDate, time: newTime })
      .eq('id', selectedAppointment.id);

    if (error) toast.error('Error al reagendar');
    else {
      toast.success('Cita reagendada correctamente');
      loadAppointments();
      setRescheduleOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>Inicia sesión</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <Input
                placeholder="Contraseña"
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <Button className="w-full" type="submit">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* LISTA DE CITAS */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Citas Agendadas</h2>

        <div className="grid gap-4">
          {appointments.map((a) => (
            <Card key={a.id} className={a.status === 'cancelled' ? 'opacity-50' : ''}>
              <CardContent className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{a.name}</div>
                  <p className="text-sm text-muted-foreground">
                    {a.date} — {a.time}
                  </p>
                </div>

                {a.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openReschedule(a)}>
                      <Clock className="h-4 w-4 mr-1" /> Reagendar
                    </Button>

                    <Button variant="destructive" onClick={() => handleCancelAppointment(a.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL REAGENDAR */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Cita</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nueva Fecha</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  loadTakenTimes(e.target.value);
                }}
              />
            </div>

            <div>
              <Label>Nueva Hora</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((t) => {
                  const disabled = takenTimes.includes(t) && t !== selectedAppointment?.time;

                  return (
                    <Button
                      key={t}
                      variant={t === newTime ? 'default' : 'outline'}
                      disabled={disabled}
                      onClick={() => setNewTime(t)}
                    >
                      {t}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button className="w-full" onClick={handleReschedule}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
