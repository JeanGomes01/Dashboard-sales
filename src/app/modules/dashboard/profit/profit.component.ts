import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../types/sales.interface';
Chart.register(...registerables);
@Component({
  selector: 'app-profit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit.component.html',
  styleUrl: './profit.component.css',
})
export class ProfitComponent {
  sales: Sale[] = [];
  totalProfit: number = 0;

  @ViewChild('profitCanvas', { static: false })
  profitCanvas!: ElementRef<HTMLCanvasElement>;
  profitChart!: Chart;
  titleText: string = 'Lucro';

  @Output() profitChange = new EventEmitter<number>();
  @Output() titleChange = new EventEmitter<string>();

  isLoading: boolean = true;

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.titleChange.emit(this.titleText);

    setTimeout(() => {
      this.isLoading = false;

      setTimeout(() => this.renderChart(), 0);
    }, 2000);
  }

  renderChart() {
    setTimeout(() => {
      this.salesService.getProfitByCategory().subscribe((data) => {
        const categories = data.map((d) => d.category);
        const profits = data.map((d) => d.profit);

        const ctx = this.profitCanvas.nativeElement.getContext('2d');
        if (!ctx) return;

        this.profitChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [
              {
                label: 'Lucro',
                data: profits,
                backgroundColor: '#36D1DC',
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `R$ ${tooltipItem.raw}`,
                },
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      });
    }, 0);
  }
}
