import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { Sale } from '../../types/sales.interface';
import { AverageTicketComponent } from './average-ticket/average-ticket.component';
import { MonthlyGrownthComponent } from './monthly-grownth/monthly-grownth.component';
import { ProfitComponent } from './profit/profit.component';
import { TotalSalesComponent } from './total-sales/total-sales.component';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TotalSalesComponent,
    ProfitComponent,
    AverageTicketComponent,
    MonthlyGrownthComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  sales: Sale[] = [];
  totalRevenue: number = 0;

  isLoading$!: Observable<boolean>;

  constructor() {}

  totalSales: number = 0;
  titleText: string = '';

  ngOnInit() {}

  onTotalSalesChange(total: number) {
    this.totalSales = total;
  }

  onProfitChange(profit: number) {
    this.totalRevenue = profit;
  }

  onAverageTicketChange(ticket: number) {
    this.totalRevenue = ticket;
  }

  onMonthlyGrownthChange(growth: number) {
    this.totalRevenue = growth;
  }

  onTitleChange(title: string) {
    this.titleText = title;
  }
}
