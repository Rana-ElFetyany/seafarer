import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { SeafarerService } from '../../core/services/seafarer.service';

@Component({
  selector: 'app-seafarer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seafarer-modal.component.html',
  styleUrls: ['./seafarer-modal.component.scss'],
})
export class SeafarerModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  private _SeafarerService = inject(SeafarerService);

  sections = [
    { key: 'personal', label: 'Personal Data' },
    { key: 'contact', label: 'Contact Data' },
    { key: 'offshore', label: 'Offshore Data' },
    { key: 'qualifications', label: 'Qualifications' },
    { key: 'certificates', label: 'Certificates' },
    { key: 'languages', label: 'Languages' },
    { key: 'references', label: 'References' },
  ];

  activeSection: string = 'personal';
  employees: { Text: string; Value: string; Code?: string }[] = [];
  sponsors: { Text: string; Value: string; Code?: string }[] = [];
  CompanyId: string | null = null;

  currentId: number | null = null;
  isEditMode = false;

  seafarerForm = new FormGroup({
    Id: new FormControl<number | null>(null),
    EmployeeName: new FormControl<string | null>(null, Validators.required),
    Nationality: new FormControl<string | null>(null),
    BirthDate: new FormControl<string | null>(null),
    Age: new FormControl<number | null>(null),
    PlaceOfBirth: new FormControl<string | null>(null),
    Religion: new FormControl<string | null>(null),
    MaritalStatus: new FormControl<string | null>(null),
    NameOfSpouse: new FormControl<string | null>(null),
    NoOfChildren: new FormControl<number | null>(null),
    BodyWeight: new FormControl<number | null>(null),
    Height: new FormControl<number | null>(null),
    NearestAirport: new FormControl<string | null>(null),
    Remarks: new FormControl<string | null>(null),
    EmploymentDate: new FormControl<string | null>(null),
    PassportNumber: new FormControl<string | null>(null),
    PassPortIssueDate: new FormControl<string | null>(null),
    PassportExpireDate: new FormControl<string | null>(null),
    JobName: new FormControl<string | null>(null),
    SponsorName: new FormControl<string | null>(null),
    VisaUAEIdNO: new FormControl<string | null>(null),
    VisaIssueDate: new FormControl<string | null>(null),
    VisaExpiryDate: new FormControl<string | null>(null),
    ResidenceNumber: new FormControl<string | null>(null),
    MedicalInsuranceDate: new FormControl<string | null>(null),
    Email: new FormControl<string | null>(null),
    PermanentAddressHomeCountry: new FormControl<string | null>(null),
    ContactNumberHomeCountry: new FormControl<string | null>(null),
    ContactNameAndNumberDuringEmergenciesUAE: new FormControl<string | null>(
      null
    ),
    ContactNameAndNumberDuringEmergenciesHome: new FormControl<string | null>(
      null
    ),
    SeamanBookNO: new FormControl<string | null>(null),
    SeamanIssueDate: new FormControl<string | null>(null),
    SeamanExpiryDate: new FormControl<string | null>(null),
    CicpaNO: new FormControl<string | null>(null),
    CicpaIssueDate: new FormControl<string | null>(null),
    CicpaExpiryDate: new FormControl<string | null>(null),
    SkypeID: new FormControl<string | null>(null),
    Declaration: new FormControl<string | null>(null),
    SignedOffFromAShipDueToMedicalReason: new FormControl<boolean | null>(null),
    SignedOffFromAShipDueToMedicalReasonComment: new FormControl<string | null>(
      null
    ),
    UndergoneAnyMdicalOperation: new FormControl<boolean | null>(null),
    UndergoneAnyMdicalOperationComment: new FormControl<string | null>(null),
    DoctorConsultation: new FormControl<boolean | null>(null),
    DoctorConsultationComment: new FormControl<string | null>(null),
    HealthOrDisabilityProblem: new FormControl<boolean | null>(null),
    HealthOrDisabilityProblemComment: new FormControl<string | null>(null),
    InquiryOrInvolvedMaritimeAccident: new FormControl<boolean | null>(null),
    InquiryOrInvolvedMaritimeAccidentComment: new FormControl<string | null>(
      null
    ),
    LicenseSuspendedOrRevoked: new FormControl<boolean | null>(null),
    LicenseSuspendedOrRevokedComment: new FormControl<string | null>(null),
    Qualifications: new FormArray([]),
    Certificates: new FormArray([]),
    Languages: new FormArray([]),
    References: new FormArray([]),
    WorkExperiences: new FormArray([]),
  });

  ngOnInit(): void {
    this.CompanyId = localStorage.getItem('CompanyId');

    this._SeafarerService.getEmployees().subscribe({
      next: (res: any) => (this.employees = res?.result ?? res),
    });

    this._SeafarerService.getSponsors().subscribe({
      next: (res: any) => (this.sponsors = res?.result ?? res),
    });

    this.seafarerForm.get('BirthDate')?.valueChanges.subscribe((birthDate) => {
      if (birthDate) {
        const age = this.calculateAge(new Date(birthDate));
        this.seafarerForm.get('Age')?.setValue(age, { emitEvent: false });
      }
    });

    if (this.isEditMode && this.currentId) {
      this._SeafarerService.getAllSeafarers().subscribe({
        next: (res: any) => {
          const found = res.find((x: any) => x.Id === this.currentId);
          if (found) {
            this.seafarerForm.patchValue({
              Id: found.Id,
              EmployeeName: found.EmployeeName,
              Nationality: found.Nationality,
              BirthDate: this.formatDate(found.BirthDate),
              Age: found.Age,
              PlaceOfBirth: found.PlaceOfBirth,
              Religion: found.Religion,
              MaritalStatus: found.MaritalStatus,
              NameOfSpouse: found.NameOfSpouse,
              NoOfChildren: found.NoOfChildren,
              BodyWeight: found.BodyWeight,
              Height: found.Height,
              NearestAirport: found.NearestAirport,
              Remarks: found.Remarks,
              EmploymentDate: this.formatDate(found.EmploymentDate),
              PassportNumber: found.PassportNumber,
              PassPortIssueDate: this.formatDate(found.PassPortIssueDate),
              PassportExpireDate: this.formatDate(found.IDExPiryDate),
              JobName: found.JobName,
              SponsorName: found.VisaSponsorId,
              VisaUAEIdNO: found.VisaUAEIdNO,
              VisaIssueDate: this.formatDate(found.VisaIssueDate),
              VisaExpiryDate: this.formatDate(found.VisaExpiryDate),
              ResidenceNumber: found.ResidenceNumber,
              MedicalInsuranceDate: this.formatDate(found.MedicalInsuranceDate),
              Email: found.EmailId,
              PermanentAddressHomeCountry: found.PermanentAddressHomeCountry,
              ContactNumberHomeCountry: found.ContactNumberHomeCountry,
              ContactNameAndNumberDuringEmergenciesUAE:
                found.ContactNameAndNumberDuringEmergenciesUAE,
              ContactNameAndNumberDuringEmergenciesHome:
                found.ContactNameAndNumberDuringEmergenciesHome,
              SeamanBookNO: found.SeamanBookNO,
              SeamanIssueDate: this.formatDate(found.SeamanIssueDate),
              SeamanExpiryDate: this.formatDate(found.SeamanExpiryDate),
              CicpaNO: found.CicpaNO,
              CicpaIssueDate: this.formatDate(found.CicpaIssueDate),
              CicpaExpiryDate: this.formatDate(found.CicpaExpiryDate),
              SkypeID: found.SkypeID,
              Declaration: found.Declaration,
              SignedOffFromAShipDueToMedicalReason:
                found.SignedOffFromAShipDueToMedicalReason,
              SignedOffFromAShipDueToMedicalReasonComment:
                found.SignedOffFromAShipDueToMedicalReasonComment,
              UndergoneAnyMdicalOperation: found.UndergoneAnyMdicalOperation,
              UndergoneAnyMdicalOperationComment:
                found.UndergoneAnyMdicalOperationComment,
              DoctorConsultation: found.DoctorConsultation,
              DoctorConsultationComment: found.DoctorConsultationComment,
              HealthOrDisabilityProblem: found.HealthOrDisabilityProblem,
              HealthOrDisabilityProblemComment:
                found.HealthOrDisabilityProblemComment,
              InquiryOrInvolvedMaritimeAccident:
                found.InquiryOrInvolvedMaritimeAccident,
              InquiryOrInvolvedMaritimeAccidentComment:
                found.InquiryOrInvolvedMaritimeAccidentComment,
              LicenseSuspendedOrRevoked: found.LicenseSuspendedOrRevoked,
              LicenseSuspendedOrRevokedComment:
                found.LicenseSuspendedOrRevokedComment,
            });
          }
        },
      });
    }
  }

  setSection(section: string) {
    this.activeSection = section;
  }

  onSave() {
    if (this.seafarerForm.valid) {
      const formValue = this.seafarerForm.value;

      const payload = {
        entity: {
          Id: this.isEditMode ? this.currentId : 0, // ✅ Add = 0 , Edit = currentId
          PassPortIssueDate: this.formatDate(formValue.PassPortIssueDate),
          IDExPiryDate: this.formatDate(formValue.PassportExpireDate),
          SeamanBookNO: formValue.SeamanBookNO,
          Remarks: formValue.Remarks,
          EmpId: null, // ✅ نخليه null دلوقتي
          VisaSponsorId: formValue.SponsorName,
          VisaIssueDate: this.formatDate(formValue.VisaIssueDate),
          VisaExpiryDate: this.formatDate(formValue.VisaExpiryDate),
          NameOfSpouse: formValue.NameOfSpouse,
          NoOfChildren: formValue.NoOfChildren,
          BodyWeight: formValue.BodyWeight,
          Height: formValue.Height,
          VisaUAEIdNO: formValue.VisaUAEIdNO,
          NearestAirport: formValue.NearestAirport,
          ResidenceNumber: formValue.ResidenceNumber,
          SkypeID: formValue.SkypeID,
          PermanentAddressHomeCountry: formValue.PermanentAddressHomeCountry,
          ContactNumberHomeCountry: formValue.ContactNumberHomeCountry,
          ContactNameAndNumberDuringEmergenciesUAE:
            formValue.ContactNameAndNumberDuringEmergenciesUAE,
          ContactNameAndNumberDuringEmergenciesHome:
            formValue.ContactNameAndNumberDuringEmergenciesHome,
          SeamanIssueDate: this.formatDate(formValue.SeamanIssueDate),
          SeamanExpiryDate: this.formatDate(formValue.SeamanExpiryDate),
          CicpaNO: formValue.CicpaNO,
          CicpaIssueDate: this.formatDate(formValue.CicpaIssueDate),
          CicpaExpiryDate: this.formatDate(formValue.CicpaExpiryDate),
          Declaration: formValue.Declaration,
          SignedOffFromAShipDueToMedicalReason:
            formValue.SignedOffFromAShipDueToMedicalReason,
          SignedOffFromAShipDueToMedicalReasonComment:
            formValue.SignedOffFromAShipDueToMedicalReasonComment,
          UndergoneAnyMdicalOperation: formValue.UndergoneAnyMdicalOperation,
          UndergoneAnyMdicalOperationComment:
            formValue.UndergoneAnyMdicalOperationComment,
          DoctorConsultation: formValue.DoctorConsultation,
          DoctorConsultationComment: formValue.DoctorConsultationComment,
          HealthOrDisabilityProblem: formValue.HealthOrDisabilityProblem,
          HealthOrDisabilityProblemComment:
            formValue.HealthOrDisabilityProblemComment,
          InquiryOrInvolvedMaritimeAccident:
            formValue.InquiryOrInvolvedMaritimeAccident,
          InquiryOrInvolvedMaritimeAccidentComment:
            formValue.InquiryOrInvolvedMaritimeAccidentComment,
          LicenseSuspendedOrRevoked: formValue.LicenseSuspendedOrRevoked,
          LicenseSuspendedOrRevokedComment:
            formValue.LicenseSuspendedOrRevokedComment,
          EmailId: formValue.Email,
        },
        Qualifications: this.qualifications.value,
        Certificates: this.certificates.value,
        Languages: this.languages.value,
        References: this.references.value,
        WorkExperiences: this.seafarerForm.get('WorkExperiences')?.value || [],
      };

      const request$ = this.isEditMode
        ? this._SeafarerService.editSeafarer(payload)
        : this._SeafarerService.saveSeafarer(payload);

      request$.subscribe({
        next: (response) => {
          this.saved.emit(response);
          this.close.emit();
          console.log(this.seafarerForm.value);
          console.log(this.currentId);
        },
        error: (error) => console.error('❌ Error saving seafarer:', error),
      });
    } else {
      this.seafarerForm.markAllAsTouched();
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0]; // ✅ yyyy-MM-dd
  }

  get qualifications(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Qualifications'
    ) as unknown as FormArray<FormGroup>;
  }

  qualificationForm = new FormGroup({
    DegreeOrCourse: new FormControl<string | null>(null, Validators.required),
    MajorOrSubject: new FormControl<string | null>(null),
    CourseIssueDate: new FormControl<string | null>(null),
    ExpiryDate: new FormControl<string | null>(null),
    University: new FormControl<string | null>(null),
    Country: new FormControl<string | null>(null),
  });

  addQualification() {
    if (this.qualificationForm.valid) {
      this.qualifications.push(
        new FormGroup({
          DegreeOrCourse: new FormControl(
            this.qualificationForm.value.DegreeOrCourse
          ),
          MajorOrSubject: new FormControl(
            this.qualificationForm.value.MajorOrSubject
          ),
          CourseIssueDate: new FormControl(
            this.qualificationForm.value.CourseIssueDate
          ),
          ExpiryDate: new FormControl(this.qualificationForm.value.ExpiryDate),
          University: new FormControl(this.qualificationForm.value.University),
          Country: new FormControl(this.qualificationForm.value.Country),
        })
      );
      this.qualificationForm.reset();
    } else {
      this.qualificationForm.markAllAsTouched();
    }
  }

  removeQualification(index: number) {
    this.qualifications.removeAt(index);
  }

  get certificates(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Certificates'
    ) as unknown as FormArray<FormGroup>;
  }

  certificateForm = new FormGroup({
    Capacity: new FormControl<string | null>(null, Validators.required),
    Regulation: new FormControl<string | null>(null),
    IssueDate: new FormControl<string | null>(null),
    ExpiryDate: new FormControl<string | null>(null),
    IssuingAuthority: new FormControl<string | null>(null),
    Limitations: new FormControl<string | null>(null),
    Country: new FormControl<string | null>(null),
    Attachment: new FormControl<File | null>(null),
  });

  addCertificate() {
    if (this.certificateForm.valid) {
      this.certificates.push(
        new FormGroup({
          Capacity: new FormControl(this.certificateForm.value.Capacity),
          Regulation: new FormControl(this.certificateForm.value.Regulation),
          IssueDate: new FormControl(this.certificateForm.value.IssueDate),
          ExpiryDate: new FormControl(this.certificateForm.value.ExpiryDate),
          IssuingAuthority: new FormControl(
            this.certificateForm.value.IssuingAuthority
          ),
          Limitations: new FormControl(this.certificateForm.value.Limitations),
          Country: new FormControl(this.certificateForm.value.Country),
          Attachment: new FormControl<File | null>(null),
        })
      );
      this.certificateForm.reset();
    } else {
      this.certificateForm.markAllAsTouched();
    }
  }

  onCertificateFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      (this.certificates.at(index) as FormGroup)
        .get('Attachment')
        ?.setValue(file);
    }
  }

  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }

  get languages(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Languages'
    ) as unknown as FormArray<FormGroup>;
  }

  addLanguage() {
    const langGroup = new FormGroup({
      Language: new FormControl<string | null>(null),
      Read: new FormControl<string | null>(null),
      Write: new FormControl<string | null>(null),
      Speak: new FormControl<string | null>(null),
    });
    this.languages.push(langGroup);
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  get references(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'References'
    ) as unknown as FormArray<FormGroup>;
  }

  addReference() {
    this.references.push(
      new FormGroup({
        Name: new FormControl<string | null>(null, Validators.required),
        Company: new FormControl<string | null>(null),
        ContactInfo: new FormControl<string | null>(null),
      })
    );
  }

  removeReference(index: number) {
    this.references.removeAt(index);
  }

  onCancel() {
    this.close.emit();
  }
}
