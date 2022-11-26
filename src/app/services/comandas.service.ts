import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { FindComandasData } from '../comandas/comandas/comandas.component';

@Injectable({
  providedIn: 'root'
})
export class ComandasService {

  constructor(private http:HttpClient) { }

  public findComandas(page:any,limit:any){
    let url = `https://mini-tpv-backend-production.up.railway.app:3100/comandas/getAll?page=${page}&limit=${limit}`
    return this.http.get<FindComandasData>(url)
  }
}
