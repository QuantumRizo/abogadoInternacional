import { useState } from 'react';
import { useLegalCases } from '../hooks/useLegalCases';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User, Calendar, Edit2, Check, Briefcase } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
    isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

export const LegalCalendar = () => {
    const { appointments, clients, updateAppointmentStatus, updateAppointment } = useLegalCases();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    // Calendar generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const getDayAppointments = (day: Date) => {
        return appointments.filter(a =>
            isSameDay(parseISO(a.date), day) &&
            a.status !== 'cancelled'
        ).sort((a, b) => a.time.localeCompare(b.time));
    };

    const handleStatusChange = async (apptId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        try {
            await updateAppointmentStatus(apptId, newStatus);
            toast.success("Estado actualizado");
        } catch (e) {
            toast.error('Error al actualizar estado');
        }
    };

    const startEditing = (appt: any) => {
        setIsEditing(true);
        setEditDate(appt.date);
        setEditTime(appt.time);
        setSelectedAppointmentId(appt.id);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setSelectedAppointmentId(null);
    };

    const saveReschedule = async () => {
        if (!selectedAppointmentId || !editDate || !editTime) return;

        try {
            await updateAppointment(selectedAppointmentId, {
                date: editDate,
                time: editTime
            });
            setIsEditing(false);
            setSelectedAppointmentId(null);
            toast.success("Cita reprogramada");
        } catch (e) {
            toast.error('Error al reprogramar');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-500';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-500';
            default: return 'bg-blue-100 text-blue-800 border-blue-500';
        }
    };

    return (
        <Card className="h-full border shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-4 space-y-4 md:space-y-0">
                <CardTitle className="text-xl font-bold capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </CardTitle>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>Hoy</Button>
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
                <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-7 bg-gray-50 border-b text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {weekDays.map(day => <div key={day}>{day}</div>)}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[120px]">
                        {calendarDays.map((day, idx) => {
                            const dayAppts = getDayAppointments(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`
                                        border-b border-r p-2 transition-colors hover:bg-gray-50/50 flex flex-col gap-1 relative overflow-hidden
                                        ${!isCurrentMonth ? 'bg-gray-50/30 text-gray-400' : 'bg-white'}
                                        ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
                                        ${isToday(day) ? 'bg-blue-50/30' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-[#1c334a] text-white' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {dayAppts.length > 0 && (
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{dayAppts.length}</Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 mt-1 overflow-y-auto no-scrollbar">
                                        {dayAppts.slice(0, 3).map(apt => (
                                            <Dialog key={apt.id} onOpenChange={(open) => !open && cancelEditing()}>
                                                <DialogTrigger asChild>
                                                    <button className={`text-[10px] text-left px-1.5 py-1 rounded truncate w-full border-l-2 font-medium ${getStatusColor(apt.status)}`}>
                                                        {apt.time} - {apt.clientName?.split(' ')[0] || 'Cita'}
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{isEditing ? 'Reprogramar Evento' : 'Detalles del Evento'}</DialogTitle>
                                                    </DialogHeader>

                                                    {isEditing ? (
                                                        <div className="space-y-4 py-2">
                                                            <div className="grid gap-2">
                                                                <Label>Nueva Fecha</Label>
                                                                <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label>Nuevo Horario</Label>
                                                                <Input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                                                            </div>
                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <Button variant="outline" size="sm" onClick={cancelEditing}>Cancelar</Button>
                                                                <Button size="sm" onClick={saveReschedule} className="bg-[#1c334a]">Guardar</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
                                                                <span className="text-sm font-medium">Estado:</span>
                                                                <select
                                                                    className="h-8 rounded-md border text-xs px-2"
                                                                    value={apt.status}
                                                                    onChange={(e) => handleStatusChange(apt.id, e)}
                                                                >
                                                                    <option value="confirmed">Confirmada</option>
                                                                    <option value="cancelled">Cancelada</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><User className="w-5 h-5" /></div>
                                                                <div>
                                                                    <div className="font-bold">{apt.clientName}</div>
                                                                    <div className="text-xs text-gray-500">{apt.reason}</div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded"><Calendar className="w-4 h-4" /> {apt.date}</div>
                                                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded"><Clock className="w-4 h-4" /> {apt.time}</div>
                                                            </div>
                                                            <Button variant="outline" size="sm" onClick={() => startEditing(apt)}>Reprogramar</Button>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
