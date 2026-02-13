import { useState } from 'react';
import type { Client, Appointment, LegalCase } from '@/features/admin/types';
import { CaseDetailsEditor } from './CaseDetailsEditor';
import { AppointmentDialog } from './AppointmentDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Phone, Mail, Clock, Calendar, Briefcase, File as FileIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface LegalCaseRecordProps {
    client: Client;
    legalCase?: LegalCase; // The active case
    appointments: Appointment[];
    onUpdateClient: (client: Client) => Promise<any>;
    onSaveCase: (caseData: Partial<LegalCase>) => Promise<any>;
    onSaveAppointment: (apptData: any, clientData: any) => Promise<any>;
    onDeleteAppointment: (id: string) => Promise<any>;
}

export const LegalCaseRecord = ({
    client: initialClient,
    legalCase: initialCase,
    appointments,
    onUpdateClient,
    onSaveCase,
    onSaveAppointment,
    onDeleteAppointment
}: LegalCaseRecordProps) => {
    const [client, setClient] = useState<Client>(initialClient);
    const [activeCase, setActiveCase] = useState<Partial<LegalCase>>(initialCase || {
        clientId: initialClient.id,
        status: 'active',
        title: `Caso de ${initialClient.name}`
    });
    const [generalNotes, setGeneralNotes] = useState<string>(initialClient.notes || '');
    const [isApptDialogOpen, setIsApptDialogOpen] = useState(false);

    // Refresh local state when props change
    if (initialClient.id !== client.id) {
        setClient(initialClient);
        setGeneralNotes(initialClient.notes || '');
        setActiveCase(initialCase || {
            clientId: initialClient.id,
            status: 'active',
            title: `Caso de ${initialClient.name}`
        });
    }

    const handleSaveCaseDetails = async (caseData: Partial<LegalCase>) => {
        try {
            const updated = { ...activeCase, ...caseData };
            await onSaveCase(updated);
            setActiveCase(updated);
            // Toast handled in child or here? Child showed success.
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar detalles del caso");
        }
    };

    const handleSaveGeneralNotes = async () => {
        try {
            const updated = { ...client, notes: generalNotes };
            await onUpdateClient(updated);
            setClient(updated);
            toast.success("Notas del cliente guardadas");
        } catch (error) {
            console.error("Error saving notes", error);
            toast.error("Error al guardar las notas");
        }
    };

    // Filter appointments for this client
    const clientAppointments = appointments
        .filter(a => a.clientId === client.id)
        .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

    return (
        <div className="flex flex-col h-[80vh]">
            {/* Header */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 border-b">
                <div className="w-16 h-16 rounded-full bg-[#1c334a] text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm">
                    {client.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1c334a]">{client.name}</h2>
                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border shadow-sm">
                            <Phone className="w-4 h-4" /> {client.phone}
                        </span>
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border shadow-sm text-xs">
                            <Mail className="w-4 h-4" /> {client.email}
                        </span>
                        {activeCase?.status && (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-md border shadow-sm text-xs font-bold ${activeCase.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-700'}`}>
                                <Briefcase className="w-4 h-4" />
                                {activeCase.status === 'active' ? 'Caso Activo' : activeCase.status}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-hidden bg-white">
                <Tabs defaultValue="details" className="h-full flex flex-col">
                    <div className="px-6 pt-4 border-b bg-white">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-full md:max-w-[650px] gap-2 md:gap-0 h-auto md:h-10">
                            <TabsTrigger value="details">Detalles del Caso</TabsTrigger>
                            <TabsTrigger value="documents">Documentos</TabsTrigger>
                            <TabsTrigger value="timeline">Agenda / Eventos</TabsTrigger>
                            <TabsTrigger value="notes">Notas Internas</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        {/* TAB 1: DETALLES DEL CASO */}
                        <TabsContent value="details" className="mt-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                        Expediente Legal
                                    </CardTitle>
                                    <CardDescription>
                                        Información general del juicio, juzgado y estatus actual.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CaseDetailsEditor legalCase={activeCase} onSave={handleSaveCaseDetails} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: DOCUMENTOS (New) */}
                        <TabsContent value="documents" className="mt-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileIcon className="w-5 h-5 text-blue-600" />
                                        Documentos y Evidencia
                                    </CardTitle>
                                    <CardDescription>
                                        Repositorio de archivos digitales del caso (PDFs, Imágenes).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <Upload className="w-10 h-10 mb-2 text-gray-400" />
                                        <p className="font-medium">Arrastra archivos aquí o haz clic para subir</p>
                                        <p className="text-xs mt-1">Soporta PDF, JPG, PNG (Máx 10MB)</p>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold mb-3">Archivos Recientes</h4>
                                        {/* Placeholder list until we implement real storage */}
                                        <div className="text-sm text-gray-500 italic">No hay documentos cargados aún.</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: TIMELINE / CITAS */}
                        <TabsContent value="timeline" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                Bitácora de Eventos
                                            </CardTitle>
                                            <CardDescription>
                                                Historial de audiencias, citas y vencimientos de términos.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-[#1c334a] hover:bg-[#2a4560]"
                                            onClick={() => setIsApptDialogOpen(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agendar
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {clientAppointments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No hay eventos registrados.
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50">
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead>Hora</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {clientAppointments.map((appt) => (
                                                    <TableRow key={appt.id}>
                                                        <TableCell className="font-medium">
                                                            {format(parseISO(appt.date), 'dd MMM yyyy', { locale: es })}
                                                        </TableCell>
                                                        <TableCell>{appt.time}</TableCell>
                                                        <TableCell>
                                                            {appt.reason}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <Badge variant={appt.status === 'cancelled' ? 'destructive' : 'default'} className={`text-xs ${appt.status !== 'cancelled' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                                                                    {appt.status === 'cancelled' ? 'Cancelada' : 'Confirmada'}
                                                                </Badge>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-300 hover:text-destructive"
                                                                    onClick={async () => {
                                                                        if (window.confirm("¿Eliminar este evento?")) {
                                                                            await onDeleteAppointment(appt.id);
                                                                            toast.success("Evento eliminado");
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: NOTAS */}
                        <TabsContent value="notes" className="mt-0 h-full flex flex-col">
                            <Card className="flex-1 flex flex-col shadow-sm border-t-0 rounded-t-none">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <div className="p-2 bg-yellow-100/50 rounded-lg text-yellow-700">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                Notas del Cliente
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                Notas generales, observaciones y comentarios privados.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 p-0 flex flex-col relative min-h-[400px]">
                                    <div className="absolute inset-0 p-6">
                                        <textarea
                                            className="w-full h-full resize-none bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-white leading-8 p-4 text-base text-gray-700 focus:outline-none focus:ring-0 border-0"
                                            placeholder="Escriba aquí las notas sobre el cliente..."
                                            value={generalNotes}
                                            onChange={(e) => setGeneralNotes(e.target.value)}
                                            style={{
                                                backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                                                backgroundSize: '100% 32px',
                                                lineHeight: '32px'
                                            }}
                                        ></textarea>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 italic">
                                        * Estas notas son internas del despacho.
                                    </span>
                                    <Button
                                        onClick={handleSaveGeneralNotes}
                                        disabled={generalNotes === (client.notes || '')}
                                        className={`${generalNotes !== (client.notes || '') ? 'bg-[#1c334a] hover:bg-[#2a4560]' : 'bg-gray-300 text-gray-500'}`}
                                    >
                                        {generalNotes !== (client.notes || '') ? 'Guardar Cambios' : 'Sin cambios'}
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>

            <AppointmentDialog
                open={isApptDialogOpen}
                onOpenChange={setIsApptDialogOpen}
                initialClientData={client}
                onSave={async (apptData, clientData) => {
                    await onSaveAppointment(apptData, clientData);
                    toast.success("Evento agendado correctamente");
                }}
            />
        </div>
    );
};
