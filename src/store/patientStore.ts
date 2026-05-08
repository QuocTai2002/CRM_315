import { create } from 'zustand';
import type { Patient, Lifecycle, Encounter } from '@/types';

interface PatientStore {
  selectedPatient: Patient | null;
  activeLifecycle: Lifecycle | null;
  activeEncounter: Encounter | null;
  searchQuery: string;
  setSelectedPatient: (patient: Patient | null) => void;
  setActiveLifecycle: (lifecycle: Lifecycle | null) => void;
  setActiveEncounter: (encounter: Encounter | null) => void;
  setSearchQuery: (query: string) => void;
  clearSelection: () => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  selectedPatient: null,
  activeLifecycle: null,
  activeEncounter: null,
  searchQuery: '',
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setActiveLifecycle: (lifecycle) => set({ activeLifecycle: lifecycle }),
  setActiveEncounter: (encounter) => set({ activeEncounter: encounter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSelection: () => set({ selectedPatient: null, activeLifecycle: null, activeEncounter: null }),
}));
