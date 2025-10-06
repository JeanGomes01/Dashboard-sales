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
Chart.register(...registerables);

@Component({
  selector: 'app-monthly-grownth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-grownth.component.html',
  styleUrl: './monthly-grownth.component.css',
})
export class MonthlyGrownthComponent {
  @ViewChild('monthlyGrownthCanvas', { static: false })
  monthlyGrownthCanvas!: ElementRef<HTMLCanvasElement>;
  monthlyGrownthChart!: Chart;

  titleText = 'Crescimento Mensal';
  isLoading = true;

  @Output() titleChange = new EventEmitter<string>();
  @Output() monthlyGrownthChange = new EventEmitter<number>();

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.titleChange.emit(this.titleText);

    setTimeout(() => {
      this.isLoading = false;
      this.loadChartData();
    }, 2000);
  }

  loadChartData() {
    // Usa o getProfitByCategory do SalesService
    this.salesService.getProfitByCategory().subscribe((data) => {
      const ctx = this.monthlyGrownthCanvas.nativeElement.getContext('2d');
      const labels = data.map((d) => d.category);
      const profits = data.map((d) => d.profit);

      if (this.monthlyGrownthChart) this.monthlyGrownthChart.destroy();

      this.monthlyGrownthChart = new Chart(ctx!, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data: profits,
              backgroundColor: [
                'rgba(37, 99, 235, 0.7)', // azul
                'rgba(16, 185, 129, 0.7)', // verde
                'rgba(234, 179, 8, 0.7)', // amarelo
                'rgba(239, 68, 68, 0.7)', // vermelho
              ],
              borderColor: 'white',
              borderWidth: 2,
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
                label: (context) =>
                  `${context.label}: R$ ${context.parsed.toLocaleString(
                    'pt-BR'
                  )}`,
              },
            },
          },
        },
      });
    });
  }
}
