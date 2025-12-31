export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  doctorRemarks?: string;
  historyEntries?: PatientHistoryRecord[];
}

export interface PatientHistoryRecord {
  id: string;
  title: string;
  description: string;
  recordedAt: string;
}

export interface PatientHistoryCreateRequest {
  title: string;
  description: string;
  recordedAt: string;
}

export interface PatientPrediction {
  summary: string;
  riskScore?: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  doctorRemarks?: string;
}

export type UpdatePatientRequest = CreatePatientRequest;
