import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seafarer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seafarer-modal.component.html',
  styleUrls: ['./seafarer-modal.component.scss'],
})
export class SeafarerModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  activeSection: string = 'personal';

  seafarerForm = this.fb.group({
    entity: this.fb.group({
      EmployeeName: [''],
      Nationality: [''],
      BirthDate: [''],
      Age: [''],
      PlaceOfBirth: [''],
      Religion: [''],
      MaritalStatus: [''],
      NameOfSpouse: [''],
      NoOfChildren: [''],
      BodyWeight: [''],
      Height: [''],
      NearestAirport: [''],
      Remarks: [''],
    }),
    Qualifications: this.fb.array([]),
    Certificates: this.fb.array([]),
    Languages: this.fb.array([]),
    References: this.fb.array([]),
    WorkExperiences: this.fb.array([]),
  });

  get qualifications() {
    return this.seafarerForm.get('Qualifications') as FormArray;
  }
  get certificates() {
    return this.seafarerForm.get('Certificates') as FormArray;
  }
  get languages() {
    return this.seafarerForm.get('Languages') as FormArray;
  }
  get references() {
    return this.seafarerForm.get('References') as FormArray;
  }
  get workExperiences() {
    return this.seafarerForm.get('WorkExperiences') as FormArray;
  }

  setSection(section: string) {
    this.activeSection = section;
  }

  onSave() {
    if (this.seafarerForm.invalid) {
      this.seafarerForm.markAllAsTouched();
      return;
    }

    const payload = this.seafarerForm.value;

    this.http
      .post(
        'http://176.9.184.190/api/MarineServices/SaveSeafarer?InCT',
        payload
      )
      .subscribe({
        next: (res) => {
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err) => {
          console.error('Error saving seafarer', err);
        },
      });
  }

  onCancel() {
    this.close.emit();
  }
}
