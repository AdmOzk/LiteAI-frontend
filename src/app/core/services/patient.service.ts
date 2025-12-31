import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import {
  CreatePatientRequest,
  Patient,
  PatientHistoryCreateRequest,
  PatientPrediction,
  UpdatePatientRequest
} from '../models/patient.models';
import { catchError, map, of } from 'rxjs';

function determineRiskLevel(
  prediction: PatientPrediction
): PatientPrediction['riskLevel'] {
  const score = prediction.riskScore;
  if (typeof score === 'number') {
    if (score > 0.5) return 'high';
    if (score > 0.4) return 'medium';
    return 'low';
   }
   //estetik buton

  const provided = prediction.riskLevel?.toLowerCase();
  if (provided === 'high' || provided === 'medium') return provided;
  return 'low';
}

function normalizePrediction(prediction: PatientPrediction): PatientPrediction {
  return {
    ...prediction,
    recommendations: prediction.recommendations ?? [],
    riskLevel: determineRiskLevel(prediction)
  };
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private readonly http: HttpClient) {}

  getPatients() {
    return this.http.get<Patient[]>(`${API_BASE_URL}/Patients`).pipe(catchError(() => of([])));
  }

  getPatient(id: string) {
  return this.http.get<Patient>(`${API_BASE_URL}/Patients/${id}`);
}

  createPatient(payload: CreatePatientRequest) {
    return this.http.post<Patient>(`${API_BASE_URL}/Patients`, payload);
  }

  updatePatient(id: string, payload: UpdatePatientRequest) {
    return this.http.put<Patient>(`${API_BASE_URL}/Patients/${id}`, payload);
  }

  deletePatient(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/Patients/${id}`);
  }

  addHistoryEntry(patientId: string, payload: PatientHistoryCreateRequest) {
    return this.http.post(`${API_BASE_URL}/Patients/${patientId}/history`, payload);
  }

  // with dummy.
  getPrediction(id: string) {
    return this.http
      .get<PatientPrediction>(`${API_BASE_URL}/Prediction/${id}`)
      .pipe(
        catchError(() =>
          of<PatientPrediction>({
            summary: 'Stable condition. Continue monitoring vitals daily.',
            riskScore: 0.18,
            riskLevel: 'low',
            recommendations: [
              'Keep hydration logs updated.',
              'Schedule follow-up visit next week.',
              'Monitor heart rate and blood pressure twice daily.'
            ]
          })
        ),
        map(normalizePrediction)
      );
  }
}
