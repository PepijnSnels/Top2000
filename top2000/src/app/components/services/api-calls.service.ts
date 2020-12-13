import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  constructor(private http: HttpClient) {}

  fetchTop200List(link: string) {
    const params = new HttpParams().set('link', link);

    return this.http.get('https://crimson-irradiated-farm.glitch.me/getlist', {
      params,
    });
  }
}
