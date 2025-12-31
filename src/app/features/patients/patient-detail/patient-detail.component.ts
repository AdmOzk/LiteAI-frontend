import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Patient,
  PatientHistoryCreateRequest,
  PatientHistoryRecord,
  PatientPrediction
} from '../../../core/models/patient.models';
import { PatientService } from '../../../core/services/patient.service';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly patient = signal<Patient | null>(null);
  readonly history = signal<PatientHistoryRecord[]>([]);
  readonly prediction = signal<PatientPrediction | null>(null);
  readonly loading = signal(true);
  readonly aiLoading = signal(false);
  readonly savingHistory = signal(false);
  readonly historyError = signal('');

  readonly historyForm = this.fb.nonNullable.group({
    title: ['Follow-up note', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    recordedAt: [this.defaultRecordedAt(), Validators.required]
  });

  readonly initials = computed(() => {
    const p = this.patient();
    if (!p) return '';
    return `${p.firstName.charAt(0) ?? ''}${p.lastName.charAt(0) ?? ''}`.toUpperCase();
  });

  constructor(private readonly route: ActivatedRoute, private readonly patientService: PatientService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadPatient(id);
  }

  //estetik amaclı
  riskTone(level: PatientPrediction['riskLevel'] | undefined) {
    switch (level) {
      case 'high':
        return 'risk-high';
      case 'medium':
        return 'risk-medium';
      default:
        return 'risk-low';
    }
  }

  refreshPrediction() {
    const id = this.patient()?.id;
    if (!id) return;

    this.aiLoading.set(true);
    this.patientService.getPrediction(id).subscribe((prediction) => {
      this.prediction.set(prediction);
      this.aiLoading.set(false);
    });
  }

  addHistoryEntry() {
    const patient = this.patient();
    if (!patient) return;

    if (this.historyForm.invalid) {
      this.historyForm.markAllAsTouched();
      return;
    }

    const timestamp = this.historyForm.controls.recordedAt.value
      ? new Date(this.historyForm.controls.recordedAt.value)
      : new Date();
    const payload: PatientHistoryCreateRequest = {
      title: this.historyForm.controls.title.value.trim(),
      description: this.historyForm.controls.description.value.trim(),
      recordedAt: timestamp.toISOString()
    };

    this.savingHistory.set(true);
    this.historyError.set('');

    this.patientService
      .addHistoryEntry(patient.id, payload)
      .pipe(
        switchMap(() => this.patientService.getPatient(patient.id)),
        finalize(() => this.savingHistory.set(false))
      )
      .subscribe({
        next: (updated) => {
          this.patient.set(updated);
          this.history.set(updated.historyEntries ?? []);
          this.historyForm.reset({
            title: 'Follow-up note',
            description: '',
            recordedAt: this.defaultRecordedAt()
          });
        },
        error: () => {
          this.historyError.set('Could not save history. Please try again.');
        }
      });
  }

  private defaultRecordedAt() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }

  private loadPatient(id: string) {
    this.loading.set(true);
    this.patientService.getPatient(id).subscribe((patient) => {
      this.patient.set(patient);
      this.history.set(patient.historyEntries ?? []);
      this.loading.set(false);
    });
  }
}
