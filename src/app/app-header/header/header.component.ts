import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private routerPath: Router, private router: ActivatedRoute) {}
  userRole: string | null = '';

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  goTo(menu: string) {
    const userId = parseInt(this.router.snapshot.params.userId);
    const token = this.router.snapshot.params.userToken;
    if (menu === 'logIn') {
      localStorage.clear();
      this.routerPath.navigate([`/`]);
    } else if (menu === 'carrera') {
      this.routerPath.navigate([`/carreras/${userId}/${token}`]);
    } else {
      this.routerPath.navigate([`/apuestas/${userId}/${token}`]);
    }
  }
}
