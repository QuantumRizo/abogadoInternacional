import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
// Agregamos CheckCircle (completado) y Trash2 (eliminar)
import { Calendar, X, LogOut, Clock, Phone, Mail, Tag, CheckCircle, Trash2 } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  appointment_type: string;
  // Agregamos 'completed' a los estados posibles
  status: 'scheduled' | 'cancelled' | 'completed';
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
    // @ts-ignore
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) toast.error('Error al cargar las citas');
    else setAppointments(data as any || []);
  };

const loadTakenTimes = async (date: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .eq('status', 'scheduled');

    if (error) {
      console.error('Error cargando horarios ocupados:', error);
      setTakenTimes([]);
    } else {
      // Extraemos solo el string de la hora
      setTakenTimes(data?.map((a: any) => a.time) || []);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    if (error) toast.error(error.message);

    setIsLoading(false);
  };

  // 1. Función para Cancelar (Mantiene el registro pero con status cancelado)
  const handleCancelAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) toast.error('Error al cancelar');
    else {
      toast.success('Cita cancelada');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    }
  };

  // 2. NUEVA: Función para Completar (Verde)
  const handleCompleteAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', id);

    if (error) toast.error('Error al completar cita');
    else {
      toast.success('¡Cita completada exitosamente!');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
    }
  };

  // 3. NUEVA: Función para Eliminar (Rojo - Borrado definitivo)
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cita permanentemente?')) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) toast.error('Error al eliminar la cita');
    else {
      toast.success('Cita eliminada permanentemente');
      // Filtramos la cita de la lista local para que desaparezca inmediatamente
      setAppointments(prev => prev.filter(a => a.id !== id));
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
      setAppointments(appointments.map(a => 
        a.id === selectedAppointment.id ? { ...a, date: newDate, time: newTime } : a
      ));
      setRescheduleOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

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
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER */}
      <div className="bg-primary text-primary-foreground py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button variant="ghost" onClick={handleLogout} className="hover:bg-primary-foreground/10">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* LISTA DE CITAS */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Gestión de Citas</h2>

        <div className="grid gap-4">
          {appointments.map((a) => {
            // Lógica de estilos según estado
            const isCancelled = a.status === 'cancelled';
            const isCompleted = a.status === 'completed';
            
            // Clases base para la tarjeta
            let cardClasses = "transition-all duration-200";
            if (isCancelled) cardClasses += " opacity-50 bg-destructive/5 border-destructive/20";
            // Si está completada: fondo grisáceo (muted), borde verde suave
            if (isCompleted) cardClasses += " bg-muted/50 border-green-200 dark:border-green-900";

            return (
              <Card key={a.id} className={cardClasses}>
                <CardContent className="py-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                  
                  <div className="space-y-3 w-full">
                    {/* Info Principal */}
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                        <span className={isCompleted ? "text-muted-foreground line-through decoration-green-500/50" : ""}>
                          {a.name}
                        </span>
                        
                        {/* Badges de Estado */}
                        {isCancelled && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/20">
                            Cancelada
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Completada
                          </span>
                        )}
                      </div>
                      
                      {/* Tipo de Cita */}
                      {a.appointment_type && (
                        <div className={`flex items-center text-sm font-medium mt-1 ${isCompleted ? "text-muted-foreground" : "text-primary"}`}>
                          <Tag className="h-3.5 w-3.5 mr-1.5" />
                          {a.appointment_type}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {a.date} a las {a.time}
                      </p>
                    </div>

                    {/* Info de Contacto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t w-full max-w-lg">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-3.5 w-3.5" />
                        <a href={`tel:${a.phone}`} className="hover:text-primary hover:underline transition-colors">
                          {a.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-3.5 w-3.5" />
                        <a href={`mailto:${a.email}`} className="hover:text-primary hover:underline transition-colors">
                          {a.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex flex-wrap gap-2 sm:flex-col md:flex-row w-full sm:w-auto pt-2 sm:pt-0 justify-end">
                    
                    {/* Solo mostrar Reagendar/Cancelar si NO está completada ni cancelada */}
                    {a.status === 'scheduled' && (
                      <>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white" 
                          size="sm" 
                          onClick={() => handleCompleteAppointment(a.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Completar
                        </Button>

                        <Button variant="secondary" size="sm" onClick={() => openReschedule(a)}>
                          <Clock className="h-4 w-4 mr-1" /> Reagendar
                        </Button>

                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleCancelAppointment(a.id)}>
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                      </>
                    )}

                    {/* Botón Eliminar (Siempre visible o solo para completadas/canceladas según preferencia, aquí lo dejo siempre visible pero destacado en rojo sólido si el estado ya es final) */}
                    {(isCancelled || isCompleted) && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteAppointment(a.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
            );
          })}
          
          {appointments.length === 0 && (
             <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
               <p className="text-muted-foreground">No hay citas registradas.</p>
             </div>
          )}
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