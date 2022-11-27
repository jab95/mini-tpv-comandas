import { Component, OnInit, ViewChild } from '@angular/core';
import { Comanda } from 'src/app/models/Comanda';
import { WebSocketSubject} from 'rxjs/webSocket'
import { ComandasService } from 'src/app/services/comandas.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map, merge, of as observableOf } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import {catchError} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
export interface FindComandasData{
  totalDocs:number;
  docs: any[];
}

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComandasComponent implements OnInit {

  resultComantas:number = 0
  pageEvent: PageEvent;
  isLoadingResults = true;
  expandedElement: Comanda | null;

  @ViewChild(MatPaginator, {static:true}) paginator : MatPaginator;

  constructor(private comandaService:ComandasService){
    this.connectSocket()
  }
  ngOnInit(): void {

    this.cargaDatos();
  }

  webSocket :WebSocketSubject<any>;
  dataSource = new MatTableDataSource<Comanda>;
  displayedColumns: string[] = ['mesa', 'dia'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  public connectSocket(){

    this.webSocket = new WebSocketSubject("wss://mini-tpv-backend-production.up.railway.app:"+process.env.PORT);
    this.webSocket.subscribe({
      next: (comanda)=>{
        this.recargaTabla(comanda)
        this.resultComantas++
      }
    })
  }

  cargaDatos(){

    

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.comandaService.findComandas(this.paginator.pageIndex +1,this.paginator.pageSize )
          .pipe(catchError(() => observableOf(null)))
        }),
          map((datos)=>{

            this.isLoadingResults = false;
  
            if (datos === null) {
              return [];
            }

            this.resultComantas = datos.totalDocs
            return datos.docs
          })
      )
      .subscribe(data=>{
     
        this.dataSource.data=data
      })
  }

  recargaTabla(data: Comanda){

   
    if(this.resultComantas>=this.paginator.pageSize){
      this.dataSource.data.pop()
    }
    this.dataSource.data.unshift(data)
    this.dataSource.data = this.dataSource.data.slice()

  }


}

