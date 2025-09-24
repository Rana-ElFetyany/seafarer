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

  // ✅ Main Form
  seafarerForm = new FormGroup({
    // Personal Data
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

    // Contact Section
    Email: new FormControl<string | null>(null),
    PermanentAddressHomeCountry: new FormControl<string | null>(null),
    ContactNumberHomeCountry: new FormControl<string | null>(null),
    ContactNameAndNumberDuringEmergenciesUAE: new FormControl<string | null>(
      null
    ),
    ContactNameAndNumberDuringEmergenciesHome: new FormControl<string | null>(
      null
    ),

    // Offshore Data
    SeamanBookNO: new FormControl<string | null>(null),
    SeamanIssueDate: new FormControl<string | null>(null),
    SeamanExpiryDate: new FormControl<string | null>(null),
    CicpaNO: new FormControl<string | null>(null),
    CicpaIssueDate: new FormControl<string | null>(null),
    CicpaExpiryDate: new FormControl<string | null>(null),

    // باقي الأقسام
    Qualifications: new FormArray([]),
    Certificates: new FormArray([]),
    Languages: new FormArray([]),
    References: new FormArray([]),
    WorkExperiences: new FormArray([]),
  });

  ngOnInit(): void {
    this.CompanyId = localStorage.getItem('CompanyId');

    // ✅ Load employees for dropdown
    this._SeafarerService.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = res?.result ?? res;
      },
      error: (err) => console.error('❌ Error fetching employees:', err),
    });

    this._SeafarerService.getSponsors().subscribe({
      next: (res: any) => {
        this.sponsors = res?.result ?? res;
      },
      error: (err) => console.error('❌ Error fetching employees:', err),
    });

    // ✅ Auto-update Age
    this.seafarerForm.get('BirthDate')?.valueChanges.subscribe((birthDate) => {
      if (birthDate) {
        const age = this.calculateAge(new Date(birthDate));
        this.seafarerForm.get('Age')?.setValue(age, { emitEvent: false });
      }
    });
  }

  setSection(section: string) {
    this.activeSection = section;
  }

  // ✅ Final Save
  // onSave() {
  //   if (this.seafarerForm.valid) {
  //     const formData = this.seafarerForm.value;

  //     this._SeafarerService.saveSeafarer(this.CompanyId, formData).subscribe({
  //       next: (response) => {
  //         this.saved.emit(response);
  //         console.log(response);

  //         this.close.emit();
  //       },
  //       error: (error) => {
  //         console.error('❌ Error saving seafarer:', error);
  //       },
  //     });
  //   } else {
  //     this.seafarerForm.markAllAsTouched();
  //   }
  // }

  onSave() {
    if (this.seafarerForm.valid) {
      const formValue = this.seafarerForm.value;

      const payload = {
        entity: {
          EmpId: formValue.EmployeeName, // القيمة المختارة من الدروب داون
          Nationality: formValue.Nationality,
          BirthDate: formValue.BirthDate,
          Age: formValue.Age,
          PlaceOfBirth: formValue.PlaceOfBirth,
          Religion: formValue.Religion,
          MaritalStatus: formValue.MaritalStatus,
          NameOfSpouse: formValue.NameOfSpouse,
          NoOfChildren: formValue.NoOfChildren,
          BodyWeight: formValue.BodyWeight,
          Height: formValue.Height,
          NearestAirport: formValue.NearestAirport,
          Remarks: formValue.Remarks,

          EmploymentDate: formValue.EmploymentDate,
          PassportNumber: formValue.PassportNumber,
          PassPortIssueDate: formValue.PassPortIssueDate,
          IDExPiryDate: formValue.PassportExpireDate, // 👈 هنا غيرنا الاسم
          JobName: formValue.JobName,

          VisaUAEIdNO: formValue.VisaUAEIdNO,
          VisaIssueDate: formValue.VisaIssueDate,
          VisaExpiryDate: formValue.VisaExpiryDate,
          ResidenceNumber: formValue.ResidenceNumber,
          MedicalInsuranceDate: formValue.MedicalInsuranceDate,

          VisaSponsorId: formValue.SponsorName, // 👈 بدل ما كان string
          EmailId: formValue.Email, // 👈 لو الـ API عايز EmailId مش Email
          PermanentAddressHomeCountry: formValue.PermanentAddressHomeCountry,
          ContactNumberHomeCountry: formValue.ContactNumberHomeCountry,
          ContactNameAndNumberDuringEmergenciesUAE:
            formValue.ContactNameAndNumberDuringEmergenciesUAE,
          ContactNameAndNumberDuringEmergenciesHome:
            formValue.ContactNameAndNumberDuringEmergenciesHome,

          SeamanBookNO: formValue.SeamanBookNO,
          SeamanIssueDate: formValue.SeamanIssueDate,
          SeamanExpiryDate: formValue.SeamanExpiryDate,
          CicpaNO: formValue.CicpaNO,
          CicpaIssueDate: formValue.CicpaIssueDate,
          CicpaExpiryDate: formValue.CicpaExpiryDate,
        },
        Qualifications: this.qualifications.value,
        Certificates: this.certificates.value,
        Languages: this.languages.value,
        References: this.references.value,
        WorkExperiences: this.seafarerForm.get('WorkExperiences')?.value || [],
      };

      this._SeafarerService.saveSeafarer(this.CompanyId, payload).subscribe({
        next: (response) => {
          this.saved.emit(response);
          console.log('✅ Saved:', response);
          this.close.emit();
        },
        error: (error) => {
          console.error('❌ Error saving seafarer:', error);
        },
      });
    } else {
      this.seafarerForm.markAllAsTouched();
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Getter علشان نستعمله في التمبليت
  get qualifications(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Qualifications'
    ) as unknown as FormArray<FormGroup>;
  }

  // Mini-form مستقل للـ Qualification الجديدة
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

      this.qualificationForm.reset(); // تصفير الانبوتس
    } else {
      this.qualificationForm.markAllAsTouched();
    }
  }

  removeQualification(index: number) {
    this.qualifications.removeAt(index);
  }

  // Getter زي بتاع qualifications
  get certificates(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Certificates'
    ) as unknown as FormArray<FormGroup>;
  }

  // Mini-form مستقل للـ Certificate الجديدة
  certificateForm = new FormGroup({
    Capacity: new FormControl<string | null>(null, Validators.required),
    Regulation: new FormControl<string | null>(null),
    IssueDate: new FormControl<string | null>(null),
    ExpiryDate: new FormControl<string | null>(null),
    IssuingAuthority: new FormControl<string | null>(null),
    Limitations: new FormControl<string | null>(null),
    Country: new FormControl<string | null>(null),
    Attachment: new FormControl<File | null>(null), // ✅ جديد
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
          Attachment: new FormControl<File | null>(null), // ✅ عمود الملف
        })
      );

      this.certificateForm.reset();
    } else {
      this.certificateForm.markAllAsTouched();
    }
  }

  // ✅ التقاط الملف وحفظه في الـ row المناسب
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

  // ✅ Getter للـ Languages
  get languages(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'Languages'
    ) as unknown as FormArray<FormGroup>;
  }

  // ✅ Add Language Row
  addLanguage() {
    const langGroup = new FormGroup({
      Language: new FormControl<string | null>(null),
      Read: new FormControl<string | null>(null),
      Write: new FormControl<string | null>(null),
      Speak: new FormControl<string | null>(null),
    });
    this.languages.push(langGroup);
  }

  // ✅ Remove Row
  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  // Getter للـ References
  get references(): FormArray<FormGroup> {
    return this.seafarerForm.get(
      'References'
    ) as unknown as FormArray<FormGroup>;
  }

  // إضافة Reference جديد
  addReference() {
    this.references.push(
      new FormGroup({
        Name: new FormControl<string | null>(null, Validators.required),
        Company: new FormControl<string | null>(null),
        ContactInfo: new FormControl<string | null>(null),
      })
    );
  }

  // حذف Reference
  removeReference(index: number) {
    this.references.removeAt(index);
  }

  onCancel() {
    this.close.emit();
  }
}
