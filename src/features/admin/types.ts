
export interface LawyerOffice {
    id: string;
    name: string;
    address: string;
}

export type AppointmentReason = 'initial-consultation' | 'hearing' | 'document-signing' | 'follow-up';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    homePhone?: string;
    occupation?: string;
    address?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    appId?: string;
    legalCases?: LegalCase[]; // Join manually if needed
}

export interface LegalCase {
    id: string;
    clientId: string;
    title: string;
    caseType: 'Civil' | 'Penal' | 'Laboral' | 'Familiar' | 'Mercantil' | 'Administrativo' | 'Otro';
    status: 'active' | 'closed' | 'archived' | 'pending';
    courtNumber?: string;
    judgeName?: string;
    counterpart?: string;
    timeline?: CaseEvent[];
    documents?: CaseDocument[];
    appId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CaseEvent {
    date: string;
    title: string;
    description: string;
}

export interface CaseDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
}

export interface Appointment {
    id: string;
    clientId: string; // Mapped from patient_id
    officeId?: string; // Mapped from hospital_id
    reason: AppointmentReason;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    status: 'scheduled' | 'cancelled' | 'completed' | 'no-show'; // Mapped from DB status
    notes?: string;
    appId?: string;
    clientName?: string; // Denormalized
}

export const OFFICES: LawyerOffice[] = [
    {
        id: 'despacho-principal',
        name: 'Oficina Principal',
        address: 'Dirección del Despacho'
    }
];
