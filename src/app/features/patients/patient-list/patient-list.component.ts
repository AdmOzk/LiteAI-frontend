import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Patient } from '../../../core/models/patient.models';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  readonly patients = signal<Patient[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly hasPatients = computed(() => this.patients().length > 0);

  constructor(private readonly patientService: PatientService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set('');
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients.set(data),
      error: () => this.error.set('Unable to load patients at the moment.'),
      complete: () => this.loading.set(false)
    });
  }

  delete(patient: Patient) {
    if (!confirm(`Delete ${patient.firstName} ${patient.lastName}?`)) {
      return;
    }
    this.patientService.deletePatient(patient.id).subscribe({
      next: () => this.refresh(),
      error: () => this.error.set('Delete failed. Please retry.')
    });
  }
}
