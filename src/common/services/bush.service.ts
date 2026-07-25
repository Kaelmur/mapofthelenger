import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bush } from '../models/Bush';

@Injectable({
  providedIn: 'root',
})
export class BushService {
  private readonly baseApi = environment.baseApiUrl;

  constructor(private http: HttpClient) {}

  getAll(placeIds: number[]): Observable<Bush[]> {
    let params = new HttpParams();

    if (placeIds.length) {
      params = params.append('ids', placeIds.join(','));
    }

    return this.http.get<Bush[]>(this.baseApi + '/bushes-by-place', { params });
  }
}
