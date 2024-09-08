import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  // Attributes
  userRole: string | null = '';
  currentPath: string = '';

  // Constructor
  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
  ) {
    this.routerPath.events.subscribe(() => {
      this.currentPath = this.router.snapshot.routeConfig?.path || '';
    });
  }

  // LifeCycle
  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  // Methods
  goTo(menu: string) {
    const userId = parseInt(this.router.snapshot.params.userId);
    const token = this.router.snapshot.params.userToken;
    if (menu === 'logIn') {
      localStorage.clear();
      this.routerPath.navigate([`/`]);
    } else if (menu === 'carrera') {
      this.routerPath.navigate([`/carreras/${userId}/${token}`]);
    } else if (menu === 'apuesta') {
      this.routerPath.navigate([`/apuestas/${userId}/${token}`]);
    } else if (menu === 'cuenta') {
      this.routerPath.navigate([`/cuenta/${userId}/${token}`]);
    }
  }
}
