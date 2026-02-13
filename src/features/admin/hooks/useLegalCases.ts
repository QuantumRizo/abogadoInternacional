import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, LegalCase, Appointment, OFFICES } from '../types';

const APP_ID = 'abogado';

export const useLegalCases = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [cases, setCases] = useState<LegalCase[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Clients
            const { data: clientsData, error: clientsError } = await supabase
                .from('patients') // Table name is still 'patients'
                .select('*')
                .eq('app_id', APP_ID);

            if (clientsError) throw clientsError;

            // 2. Fetch Legal Cases
            const { data: casesData, error: casesError } = await supabase
                .from('legal_cases')
                .select('*')
                .eq('app_id', APP_ID);

            // If table doesn't exist yet, we might get an error, be graceful
            if (casesError && casesError.code !== 'PGRST116') { // PGRST116 is 406 Not Acceptable sometimes? No, 42P01 is undefined table.
                console.error("Error fetching cases", casesError);
            }

            // 3. Fetch Appointments
            const { data: apptsData, error: apptsError } = await supabase
                .from('appointments')
                .select('*')
                .eq('app_id', APP_ID);

            if (apptsError) throw apptsError;

            // Map Clients (Patients table)
            const mappedClients: Client[] = (clientsData || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                email: p.email,
                phone: p.phone,
                notes: p.notes,
                // Parse address if stored in JSON or columns? 
                // Assuming medical_history JSON might be used for address for now or just generic fields
                // For now, simple mapping
                appId: p.app_id
            }));

            // Map Cases
            const mappedCases: LegalCase[] = (casesData || []).map((c: any) => ({
                id: c.id,
                clientId: c.client_id,
                title: c.title,
                caseType: c.case_type,
                status: c.status,
                courtNumber: c.court_number,
                judgeName: c.judge_name,
                counterpart: c.counterpart,
                timeline: c.timeline, // JSONB
                documents: c.documents, // JSONB
                appId: c.app_id,
                createdAt: c.created_at
            }));

            // Map Appointments
            const mappedAppts: Appointment[] = (apptsData || []).map((a: any) => ({
                id: a.id,
                clientId: a.patient_id,
                officeId: a.hospital_id,
                reason: a.reason,
                date: a.date.split('T')[0],
                time: new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                status: a.status,
                notes: a.notes,
                appId: a.app_id,
                clientName: mappedClients.find(c => c.id === a.patient_id)?.name
            }));

            setClients(mappedClients);
            setCases(mappedCases);
            setAppointments(mappedAppts);

        } catch (error) {
            console.error('Error fetching legal data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addClient = async (clientData: any) => {
        try {
            const { data, error } = await supabase
                .from('patients')
                .insert([{
                    name: clientData.name,
                    email: clientData.email || null,
                    phone: clientData.phone,
                    app_id: APP_ID
                }])
                .select()
                .single();

            if (error) throw error;
            await fetchData();
            return data;
        } catch (error) {
            console.error("Error adding client:", error);
            throw error;
        }
    };

    const updateClient = async (client: Client) => {
        try {
            const { error } = await supabase
                .from('patients')
                .update({
                    name: client.name,
                    phone: client.phone,
                    email: client.email,
                    notes: client.notes
                })
                .eq('id', client.id);

            if (error) throw error;
            await fetchData();
        } catch (error) { // Fixed: catch syntax
            console.error('Error updating client', error);
        }
    };

    const saveCase = async (caseData: Partial<LegalCase>) => {
        try {
            // Transform camelCase to snake_case for DB
            const dbPayload = {
                client_id: caseData.clientId,
                title: caseData.title,
                case_type: caseData.caseType,
                status: caseData.status,
                court_number: caseData.courtNumber,
                judge_name: caseData.judgeName,
                counterpart: caseData.counterpart,
                timeline: caseData.timeline,
                documents: caseData.documents,
                app_id: APP_ID
            };

            if (caseData.id) {
                const { error } = await supabase
                    .from('legal_cases')
                    .update(dbPayload)
                    .eq('id', caseData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('legal_cases')
                    .insert([dbPayload]);
                if (error) throw error;
            }
            await fetchData();
        } catch (error) {
            console.error('Error saving case', error);
            throw error;
        }
    };

    const saveAppointment = async (appointmentData: any, clientData: any) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .insert([{
                    patient_id: appointmentData.clientId,
                    hospital_id: appointmentData.officeId || OFFICES[0].id,
                    reason: appointmentData.reason,
                    notes: appointmentData.notes,
                    date: `${appointmentData.date}T${appointmentData.time}:00`,
                    status: 'scheduled',
                    app_id: APP_ID
                }]);

            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error('Error saving appointment', error);
            throw error;
        }
    };

    const deleteAppointment = async (id: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);
            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error('Error deleting appointment', error);
            throw error;
        }
    };

    const updateAppointmentStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error('Error updating appointment status', error);
            throw error;
        }
    };

    const updateAppointment = async (id: string, updates: any) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({
                    date: updates.date,
                    time: updates.time,
                    reason: updates.reason,
                    notes: updates.notes,
                    status: updates.status
                })
                .eq('id', id);
            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error('Error updating appointment', error);
            throw error;
        }
    };

    return {
        clients,
        cases,
        appointments,
        offices: OFFICES,
        loading,
        addClient,
        updateClient,
        saveCase,
        saveAppointment,
        deleteAppointment,
        updateAppointmentStatus,
        updateAppointment,
        refresh: fetchData
    };
};
