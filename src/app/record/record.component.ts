import { Component, OnInit } from '@angular/core';
import {RecordService} from '../record.service';
import {Record} from '../record';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  records: Record[];
  constructor(private recordService: RecordService) { }

  ngOnInit(): void {
    this.recordService.getRecords().subscribe((data: Record[]) => {
      console.log(data);
      this.records = data;
    });
  }

}
