import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Record} from './record';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = environment.apiRoot + '/records/';

  constructor(private http: HttpClient) {
  }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }
}
