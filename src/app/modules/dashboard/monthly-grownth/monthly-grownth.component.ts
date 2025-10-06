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
Chart.register(...registerables);

@Component({
  selector: 'app-monthly-grownth',
  standalone: true,
  templateUrl: './monthly-grownth.component.html',
  styleUrls: ['./monthly-grownth.component.css'],
})
export class MonthlyGrownthComponent implements OnInit, AfterViewInit {
  @ViewChild('monthlyGrownthCanvas', { static: false })
  monthlyGrownthCanvas!: ElementRef<HTMLCanvasElement>;
  monthlyGrownthChart!: Chart;

  titleText = 'Crescimento Mensal';
  isLoading = true;

  @Output() titleChange = new EventEmitter<string>();
  @Output() monthlyGrownthChange = new EventEmitter<number>();

  monthlyData: { month: string; total: number }[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.titleChange.emit(this.titleText);

    this.salesService.getMonthlyGrowth().subscribe((data) => {
      this.monthlyData = data;
      this.isLoading = false;

      if (this.monthlyGrownthCanvas) {
        this.loadChartData(this.monthlyData);
      }
    });
  }

  ngAfterViewInit() {
    this.salesService.getMonthlyGrowth().subscribe((monthlyData) => {
      this.isLoading = false;
      this.loadChartData(monthlyData);
    });
  }

  loadChartData(data: { month: string; total: number }[]) {
    const ctx = this.monthlyGrownthCanvas.nativeElement.getContext('2d');
    const labels = data.map((d) => d.month);
    const totals = data.map((d) => d.total);

    if (this.monthlyGrownthChart) this.monthlyGrownthChart.destroy();

    this.monthlyGrownthChart = new Chart(ctx!, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Crescimento Mensal (R$)',
            data: totals,
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
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
              label: (context) =>
                `R$ ${context.parsed.toLocaleString('pt-BR')}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `R$ ${Number(value).toLocaleString('pt-BR')}`,
            },
          },
        },
      },
    });

    const totalGrowth = totals.reduce((acc, val) => acc + val, 0);
    this.monthlyGrownthChange.emit(totalGrowth);
  }
}
