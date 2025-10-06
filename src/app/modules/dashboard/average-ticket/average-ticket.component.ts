import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../types/sales.interface';
Chart.register(...registerables);
@Component({
  selector: 'app-average-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './average-ticket.component.html',
  styleUrl: './average-ticket.component.css',
})
export class AverageTicketComponent {
  Sales: Sale[] = [];
  averageTicket: number = 0;
  @ViewChild('averageTicketCanvas', { static: false })
  averageTicketCanvas!: ElementRef<HTMLCanvasElement>;
  averageTicketChart!: Chart;

  constructor(private salesService: SalesService) {
    this.salesService
      .getAverageTicket()
      .subscribe((averageTicket) => (this.averageTicket = averageTicket));
  }
}
