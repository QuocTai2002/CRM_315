export interface Patient {
  id: string;
  code: string;
  fullName: string;
  gender: 'male' | 'female';
  dob: string;
  phone: string;
  avatar: string;
  isMember: boolean;
}

export interface Membership {
  id: string;
  patientId: string;
  branchId: string;
  specialty: string;
  cardCode: string;
  type: string;
  expiredAt: string;
  status: 'active' | 'expired' | 'suspended';
}

export type LifecycleProgram = 'maternity' | 'vaccination' | 'pediatric' | 'gynecology';

export interface Lifecycle {
  id: string;
  patientId: string;
  program: LifecycleProgram;
  specialty: string;
  stage: string;
  status: 'active' | 'completed' | 'cancelled';
  startedAt: string;
  endedAt: string | null;
}

export type StageStatus = 'done' | 'active' | 'upcoming' | 'missed';

export interface LifecycleStage {
  id: string;
  lifecycleId: string;
  title: string;
  sequence: number;
  status: StageStatus;
  date?: string;
  recommendedServices: string[];
}

export interface Encounter {
  id: string;
  patientId: string;
  specialty: string;
  visitType: string;
  doctor: string;
  visitDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  service: string;
  doctor: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Recommendation {
  id: string;
  lifecycleId: string;
  stage: string;
  serviceName: string;
  priority: 'high' | 'medium' | 'low';
  price: number;
  reason: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  encounterId: string;
  specialty: string;
  doctor: string;
  diagnosis: string;
  services: string[];
  result: string;
  visitDate: string;
  reExamDate: string;
  lifecycle?: string;
}
