import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppointmentFormProps {
  date: string;
  time: string;
  onSuccess: () => void;
}

export function AppointmentForm({ date, time, onSuccess }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        date,
        time,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        status: 'scheduled',
      });

      if (error) throw error;

      toast.success('¡Cita agendada exitosamente!', {
        description: `Tu cita está confirmada para el ${date} a las ${time}`,
      });
      
      onSuccess();
    } catch (error: any) {
      toast.error('Error al agendar la cita', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar Cita</CardTitle>
        <CardDescription>
          Fecha: {date} | Hora: {time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+52 123 456 7890"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Agendando...' : 'Confirmar Cita'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
