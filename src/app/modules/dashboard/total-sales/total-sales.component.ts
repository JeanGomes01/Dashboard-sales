import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../types/sales.interface';

Chart.register(...registerables);
@Component({
  selector: 'app-total-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-sales.component.html',
  styleUrl: './total-sales.component.css',
})
export class TotalSalesComponent implements OnInit, AfterViewInit {
  sales: Sale[] = [];
  totalSales: number = 0;

  @ViewChild('totalSalesCanvas', { static: false })
  totalSalesCanvas!: ElementRef<HTMLCanvasElement>;
  totalSalesChart!: Chart;
  titleText: string = 'Total Sales';

  @Output() totalSalesChange = new EventEmitter<number>();
  @Output() titleChange = new EventEmitter<string>();
  data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.salesService.getTotalRevenue().subscribe((total) => {
      this.totalSales = total;
      this.totalSalesChange.emit(this.totalSales);
    });
  }

  ngAfterViewInit() {
    this.salesService.getSales().subscribe((data) => {
      this.sales = data;

      const categories = Array.from(
        new Set(data.map((sales) => sales.category))
      );
      const categoryTotals = categories.map((cat) => {
        return data
          .filter((sale) => sale.category === cat)
          .reduce((sum, s) => sum + s.price * s.quantity, 0);
      });
      const ctx = this.totalSalesCanvas.nativeElement.getContext('2d')!;
      if (!ctx) return;

      const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
      gradientBlue.addColorStop(0, '#36D1DC');
      gradientBlue.addColorStop(1, '#5B86E5');

      const gradientPink = ctx.createLinearGradient(0, 0, 0, 400);
      gradientPink.addColorStop(0, '#FF6A88');
      gradientPink.addColorStop(1, '#FF99AC');

      const gradientOrange = ctx.createLinearGradient(0, 0, 0, 400);
      gradientOrange.addColorStop(0, '#F7971E');
      gradientOrange.addColorStop(1, '#FFD200');

      const gradientGreen = ctx.createLinearGradient(0, 0, 0, 400);
      gradientGreen.addColorStop(0, '#56ab2f');
      gradientGreen.addColorStop(1, '#a8e063');

      this.totalSalesChart = new Chart(this.totalSalesCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Faturamento por Categoria',
              data: categoryTotals,
              backgroundColor: [
                gradientBlue,
                gradientPink,
                gradientOrange,
                gradientGreen,
              ],
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => `R$ ${tooltipItem.raw}`,
              },
            },
          },
        },
      });
    });
  }
}
