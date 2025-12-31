import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly route = inject(ActivatedRoute);
  readonly patientId = signal<string | null>(null);

  readonly submitting = signal(false);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly editing = signal(false);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
    doctorRemarks: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.editing.set(true);
    this.loading.set(true);
    this.patientService
      .getPatient(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (patient) => {
          this.patientId.set(patient.id);
          this.form.reset({
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: patient.birthDate,
            doctorRemarks: patient.doctorRemarks ?? ''
          });
        },
        error: () => this.error.set('Unable to load patient details.')
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const payload = this.form.getRawValue();

    const request$ = this.editing() && this.patientId()
      ? this.patientService.updatePatient(this.patientId()!, payload)
      : this.patientService.createPatient(payload);

    request$.subscribe({
      next: (patient) =>
        this.router.navigate(this.editing() ? ['/patients', patient.id] : ['/patients']),
      error: () => {
        this.error.set('Unable to save patient right now.');
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false)
    });
  }
}
