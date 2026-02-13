import { useState } from 'react';
import { ClientDirectory } from './ClientDirectory';
import { LegalOverview } from './LegalOverview';
import { LegalCalendar } from './LegalCalendar';
import { AddClientDialog } from './AddClientDialog';
import { AppointmentDialog } from './AppointmentDialog';
import { useLegalCases } from '../hooks/useLegalCases';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserPlus, LogOut, Calendar as CalendarIcon, Menu, Search, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";

export const AdminDashboard = () => {
    const { addClient, saveAppointment } = useLegalCases();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [isApptDialogOpen, setIsApptDialogOpen] = useState(false);
    const [clientForAppt, setClientForAppt] = useState<any>(null);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <div className="space-y-8 bg-gray-50/30 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-[#1c334a] text-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-[#1c334a] text-white border-r-gray-700 w-[240px] p-0">
                                <div className="flex flex-col h-full py-6">
                                    <div className="px-6 mb-8">
                                        <h2 className="text-xl font-bold">Menú Abogado</h2>
                                    </div>
                                    <nav className="flex-1 px-4 space-y-2">
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Tablero
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <CalendarIcon className="mr-2 h-4 w-4" /> Calendario
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Users className="mr-2 h-4 w-4" /> Directorio
                                        </Button>
                                    </nav>
                                    <div className="p-4 border-t border-gray-700">
                                        <Button variant="ghost" className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20" onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold hidden md:block">Admin</h1>
                        <span className="md:hidden font-bold">Admin</span>
                    </div>

                    {/* Global Search Bar */}
                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-400" />
                            <Input
                                placeholder="Buscar cliente por nombre o teléfono..."
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white focus:text-[#1c334a] focus:placeholder:text-gray-400 transition-all rounded-full h-10 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsAddClientOpen(true)}
                            className="bg-white text-[#1c334a] hover:bg-gray-100 shadow-md transition-all hover:scale-105 active:scale-95 hidden md:flex"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                        <Button
                            onClick={() => setIsApptDialogOpen(true)}
                            className="bg-white/10 hover:bg-white/20 text-white border-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Nueva Cita</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="hidden md:flex bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg border shadow-sm w-full md:w-auto overflow-x-auto flex justify-start md:justify-center">
                        <TabsTrigger value="overview" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Tablero
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Calendario
                        </TabsTrigger>
                        <TabsTrigger value="directory" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <Users className="w-4 h-4 mr-2" />
                            Directorio
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="focus-visible:outline-none">
                        <LegalOverview />
                    </TabsContent>

                    <TabsContent value="calendar" className="focus-visible:outline-none">
                        <LegalCalendar />
                    </TabsContent>

                    <TabsContent value="directory" className="focus-visible:outline-none">
                        <ClientDirectory />
                    </TabsContent>
                </Tabs>
            </div>

            <AddClientDialog
                open={isAddClientOpen}
                onOpenChange={setIsAddClientOpen}
                onSave={addClient}
                onBookAppointment={(clientData) => {
                    setClientForAppt(clientData);
                    setIsApptDialogOpen(true);
                }}
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
