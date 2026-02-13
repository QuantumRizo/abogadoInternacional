import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Briefcase } from "lucide-react";

interface AppointmentDialogProps {
    onSave: (appointmentData: any, clientData: any) => Promise<any>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialClientData?: { id: string, name: string, email: string, phone: string } | null;
}

export const AppointmentDialog = ({ onSave, open, onOpenChange, initialClientData }: AppointmentDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        date: '',
        time: '',
        reason: 'initial-consultation',
        notes: ''
    });

    useEffect(() => {
        if (open && initialClientData) {
            setFormData(prev => ({
                ...prev,
                clientId: initialClientData.id,
                clientName: initialClientData.name,
                date: '',
                time: '',
                reason: 'initial-consultation',
                notes: ''
            }));
        }
    }, [open, initialClientData]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.date || !formData.time || !formData.reason) {
            alert("Por favor complete fecha, hora y motivo.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData, initialClientData);
            onOpenChange(false);
        } catch (error: any) {
            alert(error.message || "Error al agendar cita");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#1c334a]">
                        <Calendar className="w-5 h-5" />
                        Agendar Nueva Cita / Audiencia
                    </DialogTitle>
                    <DialogDescription>
                        Programe un nuevo evento para {formData.clientName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="appt-date">Fecha *</Label>
                            <Input
                                id="appt-date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appt-time">Hora *</Label>
                            <Input
                                id="appt-time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleChange('time', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appt-reason">Motivo / Tipo de Evento *</Label>
                        <select
                            id="appt-reason"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.reason}
                            onChange={(e) => handleChange('reason', e.target.value)}
                        >
                            <option value="initial-consultation">Consulta Inicial</option>
                            <option value="hearing">Audiencia</option>
                            <option value="document-signing">Firma de Documentos</option>
                            <option value="follow-up">Seguimiento de Caso</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appt-notes">Notas Adicionales</Label>
                        <Textarea
                            id="appt-notes"
                            placeholder="Detalles sobre la audiencia o requerimientos..."
                            className="min-h-[100px]"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button className="bg-[#1c334a] hover:bg-[#2a4560]" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Confirmar Cita"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
