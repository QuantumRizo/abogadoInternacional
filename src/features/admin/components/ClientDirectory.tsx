import { useState, useMemo } from 'react';
import { useLegalCases } from '../hooks/useLegalCases';
import { LegalCaseRecord } from './LegalCaseRecord';
import { AddClientDialog } from './AddClientDialog';
import { AppointmentDialog } from './AppointmentDialog';
import type { Client } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, Trash2, FileText, UserPlus, Briefcase, CalendarPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

export const ClientDirectory = () => {
    const { clients, cases, appointments, updateClient, addClient, saveCase, saveAppointment, deleteAppointment, loading } = useLegalCases();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isApptDialogOpen, setIsApptDialogOpen] = useState(false);
    const [clientForAppt, setClientForAppt] = useState<Client | null>(null);

    // Filter Logic
    const filteredClients = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return clients.filter(p =>
            (p.name || '').toLowerCase().includes(search) ||
            (p.email || '').toLowerCase().includes(search)
        );
    }, [clients, searchTerm]);

    const handleOpenClient = (client: Client) => {
        setSelectedClient(client);
    };

    const handleDeleteClient = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("¡ADVERTENCIA!\n\nEsta acción eliminará permanentemente al cliente y su expediente.\n\n¿Estás seguro?")) {
            // function delete unimplemented in hook for now for safety as requested "wait for instruction"
            alert("Función de elminación desactivada temporalmente para seguridad.");
        }
    };

    const getActiveCase = (clientId: string) => {
        return cases.find(c => c.clientId === clientId && c.status === 'active');
    };

    const handleBookAppt = (client: Client, e: React.MouseEvent) => {
        e.stopPropagation();
        setClientForAppt(client);
        setIsApptDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative z-10 w-full md:w-[300px]">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                        <Search className="w-4 h-4 ml-2 text-gray-400" />
                        <Input
                            placeholder="Buscar cliente..."
                            className="border-none shadow-none focus-visible:ring-0 flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    className="bg-[#1c334a] hover:bg-[#2a4560] shadow-sm ml-auto md:ml-2 w-full md:w-auto mt-2 md:mt-0"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                </Button>
            </div>

            <Card className="shadow-lg border-t-4 border-t-[#1c334a]">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Directorio de Clientes
                        <Badge variant="secondary" className="ml-2">{filteredClients.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron clientes.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="min-w-[200px]">Cliente</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Caso Activo</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredClients.map((client) => {
                                            const activeCase = getActiveCase(client.id);

                                            return (
                                                <TableRow key={client.id} className="group hover:bg-gray-50 transition-colors">
                                                    <TableCell>
                                                        <div className="font-bold text-[#1c334a] text-lg">{client.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-600 flex flex-col gap-1">
                                                            <span className="flex items-center gap-2 text-xs"><Phone className="w-3 h-3" /> {client.phone}</span>
                                                            <span className="flex items-center gap-2 text-xs"><Mail className="w-3 h-3" /> {client.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {activeCase ? (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium text-sm truncate max-w-[200px]">{activeCase.title}</span>
                                                                <Badge variant="outline" className="w-fit text-[10px] border-green-200 bg-green-50 text-green-700">
                                                                    {activeCase.caseType}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm italic">Sin caso activo</span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-[#1c334a] hover:bg-[#2a4560] shadow-sm"
                                                                        onClick={() => handleOpenClient(client)}
                                                                    >
                                                                        <FileText className="w-4 h-4 md:mr-2" />
                                                                        <span className="hidden md:inline">Expediente</span>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-[#1c334a] text-[#1c334a] hover:bg-blue-50"
                                                                    onClick={(e) => handleBookAppt(client, e)}
                                                                >
                                                                    <CalendarPlus className="w-4 h-4 md:mr-2" />
                                                                    <span className="hidden md:inline">Agendar</span>
                                                                </Button>
                                                                <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto p-0">
                                                                    {selectedClient && (
                                                                        <LegalCaseRecord
                                                                            client={selectedClient}
                                                                            legalCase={getActiveCase(selectedClient.id)}
                                                                            appointments={appointments}
                                                                            onUpdateClient={updateClient}
                                                                            onSaveCase={saveCase}
                                                                            onSaveAppointment={saveAppointment}
                                                                            onDeleteAppointment={deleteAppointment}
                                                                        />
                                                                    )}
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-gray-300 hover:text-destructive"
                                                                onClick={(e) => handleDeleteClient(client.id, e)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {filteredClients.map((client) => {
                                    const activeCase = getActiveCase(client.id);
                                    return (
                                        <div key={client.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                            <div className="font-bold text-[#1c334a]">{client.name}</div>
                                            <div className="text-sm text-gray-500 flex flex-col gap-1">
                                                <span>{client.phone}</span>
                                                <span className="truncate">{client.email}</span>
                                            </div>
                                            {activeCase && (
                                                <div className="p-2 bg-gray-50 rounded border text-xs">
                                                    <div className="font-medium text-gray-700">{activeCase.title}</div>
                                                    <div className="text-gray-400 mt-1">{activeCase.caseType}</div>
                                                </div>
                                            )}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className="w-full bg-[#1c334a]"
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            // No trigger logic here if using manual dialog, but verify with the component's state
                                                        }}
                                                    >
                                                        Ver Expediente
                                                    </Button>
                                                </DialogTrigger>
                                                <Button
                                                    variant="outline"
                                                    className="w-full mt-2 border-[#1c334a] text-[#1c334a]"
                                                    onClick={(e) => handleBookAppt(client, e)}
                                                >
                                                    Agendar Cita
                                                </Button>
                                                <DialogContent className="max-w-[100vw] h-[100vh] p-0 rounded-none overflow-y-auto">
                                                    {selectedClient && (
                                                        <LegalCaseRecord
                                                            client={selectedClient}
                                                            legalCase={getActiveCase(selectedClient.id)}
                                                            appointments={appointments}
                                                            onUpdateClient={updateClient}
                                                            onSaveCase={saveCase}
                                                            onSaveAppointment={saveAppointment}
                                                            onDeleteAppointment={deleteAppointment}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddClientDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={addClient}
                onBookAppointment={() => { }}
            />

            <AppointmentDialog
                open={isApptDialogOpen}
                onOpenChange={setIsApptDialogOpen}
                initialClientData={clientForAppt}
                onSave={async (apptData, clientData) => {
                    await saveAppointment(apptData, clientData);
                    toast.success("Cita agendada correctamente");
                }}
            />
        </div>
    );
};
