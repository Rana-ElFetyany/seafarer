import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeafarerService } from '../../core/services/seafarer.service';
import { Seafarer } from '../../core/interfaces/seafarer';
import { SeafarerModalComponent } from '../seafarer-modal/seafarer-modal.component';

interface TableColumn {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-seafarers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seafarers-list.component.html',
  styleUrls: ['./seafarers-list.component.scss'],
})
export class SeafarersListComponent implements OnInit {
  private readonly _SeafarerService = inject(SeafarerService);

  seafarers: Seafarer[] = [];
  filteredSeafarers: Seafarer[] = [];
  isLoading = true;
  showFilters = false;

  @ViewChild('modalHost', { read: ViewContainerRef, static: true })
  modalHost!: ViewContainerRef;

  // all cols
  allColumns: TableColumn[] = [
    { key: 'EmployeeCode', label: 'EMP ID', visible: true },
    { key: 'EmployeeName', label: 'Name', visible: true },
    { key: 'Nationality', label: 'Nationality', visible: true },
    { key: 'BirthDate', label: 'Date Of Birth', visible: true },
    { key: 'JobName', label: 'Rank', visible: true },
    { key: 'Phone', label: 'Phone Number', visible: true },
    { key: 'Mobile', label: 'Mobile Number', visible: true },
    { key: 'Email', label: 'Email', visible: true },
    { key: 'BirthPlace', label: 'Place of Birth', visible: false },
    { key: 'Age', label: 'Age', visible: true },
    { key: 'Religion', label: 'Religion', visible: false },
    { key: 'MaritalStatus', label: 'Marital Status', visible: false },
    { key: 'EmploymentDate', label: 'Date of Hire', visible: false },
    { key: 'PassportNumber', label: 'Passport Number', visible: true },
    { key: 'PassPortIssueDate', label: 'Passport Issue Date', visible: false },
    { key: 'PassportExpireDate', label: 'Passport Expiry Date', visible: true },
    { key: 'VisaUAEIdNO', label: 'VISA / UAE ID NO', visible: false },
    { key: 'VisaIssueDate', label: 'VISA / UAE ID ISSUE DATE', visible: false },
    {
      key: 'VisaExpiryDate',
      label: 'VISA / UAE ID EXPIRY DATE',
      visible: false,
    },
    { key: 'SponsorName', label: 'VISA SPONSOR', visible: false },
    { key: 'Remarks', label: 'Remarks', visible: false },
    { key: 'NameOfSpouse', label: 'Name Of Spouse', visible: false },
    { key: 'NoOfChildren', label: 'No Of Children', visible: false },
    { key: 'BodyWeight', label: 'Body Weight (Kg)', visible: false },
    { key: 'Height', label: 'Height (cm)', visible: false },
    { key: 'NearestAirport', label: 'Nearest Airport', visible: false },
    { key: 'ResidenceNumber', label: 'Residence Number', visible: false },
    {
      key: 'MedicalInsuranceDate',
      label: 'Health Insurance Expiry Date',
      visible: false,
    },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  get displayedColumns() {
    return this.allColumns.filter((col) => col.visible);
  }

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  

  ngOnInit(): void {
    this._SeafarerService.getAllSeafarers().subscribe({
      next: (data) => {
        this.seafarers = data;
        this.filteredSeafarers = data;
        this.isLoading = false;
                  console.log(data);

      },
      error: (err) => {
        console.error('❌ Error fetching seafarers:', err);
        this.isLoading = false;
      },
    });
  }

  onAdd() {
    this.modalHost.clear();

    const compRef = this.modalHost.createComponent(SeafarerModalComponent);

    const subSaved = compRef.instance.saved.subscribe((res: any) => {
      this._SeafarerService.getAllSeafarers().subscribe({
        next: (data) => {
          this.seafarers = data;
          this.filteredSeafarers = data;
        },
        error: (err) => console.error(err),
      });
      compRef.destroy();
      subSaved.unsubscribe();
      subClose.unsubscribe();
    });

    const subClose = compRef.instance.close.subscribe(() => {
      compRef.destroy();
      subSaved.unsubscribe();
      subClose.unsubscribe();
    });
  }

  onEdit(seafarer: any) {
    this.modalHost.clear();

    const compRef = this.modalHost.createComponent(SeafarerModalComponent);

    //الـ Id اللي جاي من الجدول
    compRef.instance.currentId = seafarer.Id;
    compRef.instance.isEditMode = true;

    const subSaved = compRef.instance.saved.subscribe((res: any) => {
      this._SeafarerService.getAllSeafarers().subscribe({
        next: (data) => {
          this.seafarers = data;
          this.filteredSeafarers = data;
        },
        error: (err) => console.error(err),
      });
      compRef.destroy();
      subSaved.unsubscribe();
      subClose.unsubscribe();
    });

    const subClose = compRef.instance.close.subscribe(() => {
      compRef.destroy();
      subSaved.unsubscribe();
      subClose.unsubscribe();
    });
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  toggleColumn(col: TableColumn) {
    col.visible = !col.visible;
  }

  onFilterNameRank(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSeafarers = this.seafarers.filter(
      (s) =>
        s.EmployeeName?.toLowerCase().includes(value) ||
        s.JobName?.toLowerCase().includes(value)
    );
  }

  onFilterNationality(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSeafarers = this.seafarers.filter((s) =>
      s.Nationality?.toLowerCase().includes(value)
    );
  }

  sortData(columnKey: string) {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    const dataToSort = [...this.seafarers];
    this.filteredSeafarers = dataToSort.sort((a: any, b: any) => {
      const valueA = a[columnKey] ?? '';
      const valueB = b[columnKey] ?? '';

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return this.sortDirection === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      return this.sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  getValue(seafarer: Seafarer, key: string) {
    return (seafarer as any)[key];
  }

  onToggleStatus(seafarer: Seafarer) {
    const newStatus = seafarer.Status === 1 ? 2 : 1;
    console.log(`🔄 Toggle status for ID=${seafarer.Id} → ${newStatus}`);

    this._SeafarerService
      .toggleSeafarerStatus(seafarer.Id, newStatus)
      .subscribe({
        next: () => {
          seafarer.Status = newStatus; // تحديث محلي
          console.log('✅ Status updated');
        },
        error: (err) => {
          console.error('❌ Error toggling status:', err);
        },
      });
  }

}
