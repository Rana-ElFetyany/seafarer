import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seafarer } from '../interfaces/seafarer';
import { baseUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeafarerService {
  private http = inject(HttpClient);
  // private apiUrl =
  //   'http://176.9.184.190/api/MarineServices/GetAllSeafarers?Direction=ltr&InCT';

  getAllSeafarers(): Observable<Seafarer[]> {
    // return this.http.get<Seafarer[]>(this.apiUrl);
    return this.http.get<Seafarer[]>(
      baseUrl +
        '/api/MarineServices/GetAllSeafarers?Direction=ltr&InCT&Index=2&PageSize=200'
    );
  }

  toggleSeafarerStatus(
    id: number,
    status: number,
    empId: number = 1
  ): Observable<any> {
    const url = `${baseUrl}/api/MarineServices/ActivateAndInActivateSeafarer?Id=${id}&InCT&Status=${status}&EmpId=${empId}`;
    return this.http.post(url, {}); 
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(
      baseUrl + '/api/POS/FillEmployee?Id=0&text=&Direction=ltr&InCT'
    );
  }

  getSponsors(): Observable<any[]> {
    return this.http.get<any[]>(
      baseUrl + '/api/LegalAffairs/FillVendor?Id=0&text=&Direction=ltr&InCT'
    );
  }

  // ✅ Save seafarer
  saveSeafarer(payload: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/api/MarineServices/SaveSeafarer?InCT`,
      payload
    );
  }

  editSeafarer(payload: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/api/MarineServices/SaveSeafarer?InCT`,
      payload
    );
  }
}
