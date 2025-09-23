import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seafarer } from '../interfaces/seafarer';
import { baseUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeafarerService {

  private http = inject(HttpClient);
  // private apiUrl =
  //   'http://176.9.184.190/api/MarineServices/GetAllSeafarers?Direction=ltr&InCT';

  getAllSeafarers(): Observable<Seafarer[]> {
    // return this.http.get<Seafarer[]>(this.apiUrl);
    return this.http.get<Seafarer[]>(
      baseUrl + '/api/MarineServices/GetAllSeafarers?Direction=ltr&InCT',
    );
  }
}
