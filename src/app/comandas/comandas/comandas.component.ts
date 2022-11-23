import { Component, OnInit, ViewChild } from '@angular/core';
import { Comanda } from 'src/app/models/Comanda';
import { WebSocketSubject} from 'rxjs/webSocket'
import { ComandasService } from 'src/app/services/comandas.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { mergeWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
export interface FindComandasData{
  totalDocs:number;
  docs: any[];
}

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.css'],
 
})
export class ComandasComponent implements OnInit {

  resultComantas:number = 0
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, {static:true}) paginator : MatPaginator;

  constructor(private comandaService:ComandasService){
    this.connectSocket()
  }
  ngOnInit(): void {

    this.cargaDatos();
  }

  webSocket :WebSocketSubject<any>;
  dataSource = new MatTableDataSource<Comanda>;
  displayedColumns: string[] = ['mesa', 'dia', 'platos'];

  public connectSocket(){

    this.webSocket = new WebSocketSubject("ws://localhost:3101");
    this.webSocket.subscribe({
      next: (comanda)=>{
        this.recargaTabla(comanda)
        console.log(comanda)
      }
    })
  }

  cargaDatos(){

    
       this.comandaService.findComandas(this.paginator.pageIndex +1,this.paginator.pageSize ).pipe(
        map((datos:FindComandasData)=>{

          this.resultComantas = datos.totalDocs
          return datos.docs
        })
      ).subscribe(data=>{
     
        this.dataSource.data=data
      })
  }

  recargaTabla(data: Comanda){

      this.dataSource.data.pop()
    this.dataSource.data.unshift(data)
    this.dataSource.data = this.dataSource.data.slice()

  }


}

