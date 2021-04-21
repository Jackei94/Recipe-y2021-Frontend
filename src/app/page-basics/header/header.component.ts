import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  searchRedirect(event: KeyboardEvent): void{
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    let searchString: string = (event.target as HTMLInputElement).value.trim();
    this.router.navigate(['/shop/', searchString]);
  }


}
