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
  titleText: string = 'Média Vendas';
  isLoading: boolean = true;

  @Output() averageTicketChange = new EventEmitter<number>();
  @Output() titleChange = new EventEmitter<string>();

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.titleChange.emit(this.titleText);

    setTimeout(() => {
      this.isLoading = false;
      this.loadSalesData();
    }, 2000);
  }

  loadSalesData() {
    this.salesService.getSales().subscribe((sales) => {
      this.Sales = sales;

      const total = sales.reduce(
        (acc, sale) => acc + sale.price * sale.quantity,
        0
      );
      this.averageTicket = total / sales.length;

      this.averageTicketChange.emit(this.averageTicket);
      this.renderChart();
    });
  }

  renderChart() {
    const ctx = this.averageTicketCanvas.nativeElement.getContext('2d');

    // Ordena vendas por data
    const sortedSales = [...this.Sales].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedSales.map((s) =>
      new Date(s.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    );
    const revenues = sortedSales.map((s) => s.price * s.quantity);

    if (this.averageTicketChart) {
      this.averageTicketChart.destroy();
    }

    this.averageTicketChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Faturamento Diário (R$)',
            data: revenues,
            borderColor: 'rgb(37, 99, 235)', // azul
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(37, 99, 235)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `R$ ${context.parsed.y.toLocaleString('pt-BR')}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `R$ ${value}`,
            },
          },
        },
      },
    });
  }
}
