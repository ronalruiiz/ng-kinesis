import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ReportLambdaService } from 'src/app/services/report-lambda.service';

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [ 'temperature', 'humidity', 'created_at'];
    dataSource = new MatTableDataSource([]);
    option = 'temp';
    public initDate;
    public endDate;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    constructor(private _reportLambda: ReportLambdaService) {
        this.dataSource.filterPredicate = (data, filter) => {
            if (this.initDate && this.endDate) {
                return new Date(data.created_at) >= this.initDate && new Date(data.created_at) <= this.endDate;
            }
            return true;
        };
    }

    ngOnInit() {
       
        this._reportLambda.getList().subscribe((e: [])=>{
            const prepare = []
            e.forEach((a:any)=>{
                let item = {humidity:a.humidity.N,temperature:a.temperature.N,created_at:a.created_at.S}
                prepare.push(item)
            })
            this.dataSource.data = prepare
        })
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }
}
