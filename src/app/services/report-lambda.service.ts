import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { map} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ReportLambdaService {

  constructor(private _http: HttpClient) { }

  getList(){
    return this._http.get('<URL_API_GATEWAY>')
    .pipe(map((e:any) => e.Items))
  }
}
