import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { ApiCallsService } from '../services/api-calls.service';

@Component({
  selector: 'app-link-input',
  templateUrl: './link-input.component.html',
  styleUrls: ['./link-input.component.scss'],
})

export class LinkInputComponent implements OnInit {
  top2000Link: Data = {
    link: undefined,
    loading: undefined,
  };

  top2000Response: any;

  constructor(private http: ApiCallsService) {}

  ngOnInit(): void {
    this.top2000Link.loading = false
    if(localStorage.getItem('mijnlijst') != null){
      this.top2000Response = JSON.parse(localStorage.getItem('mijnlijst'))
    }
  }


  fetchTop200List() {

    this.top2000Link.loading = true
    this.http.fetchTop200List(this.top2000Link.link).subscribe(
      (response) => {
        localStorage.setItem('mijnlijst', JSON.stringify(response))
        this.top2000Response = response;
        this.top2000Link.loading = false
      },
      (error) => console.log(error)
    );
  }
}
