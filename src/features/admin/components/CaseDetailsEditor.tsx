import { useState } from 'react';
import type { LegalCase } from '../types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface CaseDetailsEditorProps {
    legalCase: Partial<LegalCase>;
    onSave: (caseData: Partial<LegalCase>) => void;
}

export const CaseDetailsEditor = ({ legalCase, onSave }: CaseDetailsEditorProps) => {
    const [formData, setFormData] = useState<Partial<LegalCase>>({
        title: '',
        caseType: 'Civil',
        status: 'active',
        courtNumber: '',
        judgeName: '',
        counterpart: '',
        ...legalCase
    });

    const handleChange = (field: keyof LegalCase, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        if (!formData.title) {
            toast.error("El título del caso es obligatorio");
            return;
        }
        onSave(formData);
        toast.success("Detalles del caso actualizados");
    };

    return (
        <div className="space-y-8">
            {/* Section 1: INFORMACIÓN DEL CASO */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1c334a] border-b pb-2">Información del Caso</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Título del Caso / Asunto *</Label>
                        <Input
                            placeholder="Ej. Divorcio Express - Juan Pérez vs María López"
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo de Juicio / Materia</Label>
                        <Select
                            value={formData.caseType || 'Otro'}
                            onValueChange={(val) => handleChange('caseType', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Civil">Civil</SelectItem>
                                <SelectItem value="Penal">Penal</SelectItem>
                                <SelectItem value="Laboral">Laboral</SelectItem>
                                <SelectItem value="Familiar">Familiar</SelectItem>
                                <SelectItem value="Mercantil">Mercantil</SelectItem>
                                <SelectItem value="Administrativo">Administrativo</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Estatus Actual</Label>
                        <Select
                            value={formData.status || 'active'}
                            onValueChange={(val) => handleChange('status', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Activo / En Proceso</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="closed">Cerrado / Sentencia</SelectItem>
                                <SelectItem value="archived">Archivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 2: DETALLES JUDICIALES */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-[#1c334a] border-b pb-2">Datos Judiciales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Número de Expediente</Label>
                        <Input
                            placeholder="Ej. 1234/2024"
                            value={formData.courtNumber || ''}
                            onChange={(e) => handleChange('courtNumber', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Juzgado / Instancia</Label>
                        <Input
                            placeholder="Ej. Juzgado 5to de lo Familiar"
                            value={formData.judgeName || ''}
                            onChange={(e) => handleChange('judgeName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Contraparte (Nombre / Abogado)</Label>
                        <Input
                            placeholder="Nombre de la parte contraria o su representante"
                            value={formData.counterpart || ''}
                            onChange={(e) => handleChange('counterpart', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleSave} className="bg-[#1c334a] text-white w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Guardar Detalles del Caso
                </Button>
            </div>
        </div>
    );
};
