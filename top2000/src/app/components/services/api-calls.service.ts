import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(private http: HttpClient) { }

  fetchTop200List(link: string) {
    const params = new HttpParams()
      .set('link', link);

    return this.http.get('localhost:3000/getlist', { params });
  }

}
