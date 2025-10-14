import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (isLoggedIn) => {
        console.log('Usuário logado:', isLoggedIn);

        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Erro ao verificar autenticação:', err);
        this.router.navigate(['/login']);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao sair:', err);
      },
    });
  }
}
