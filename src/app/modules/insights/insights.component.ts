import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { SalesService } from '../../services/sales.service';
Chart.register(...registerables);
@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent implements OnInit {
  totalRevenue: number = 0;
  numberOfSales: number = 0;
  averageTicket: number = 0;
  profitByCategory: { category: string; profit: number }[] = [];
  monthlyGrowth: { month: string; total: number }[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.salesService.getSales().subscribe((sales) => {
      this.totalRevenue = sales.reduce(
        (acc, sale) => acc + sale.price * sale.quantity,
        0
      );
      this.numberOfSales = sales.length;

      this.salesService.getProfitByCategory(sales).subscribe((profits) => {
        this.profitByCategory = profits;
        this.createPieChart();
      });
    });

    this.salesService.getAverageTicket().subscribe((average) => {
      this.averageTicket = average;
    });

    this.salesService.getMonthlyGrowth().subscribe((growth) => {
      this.monthlyGrowth = growth;
      this.createLineChart();
    });
  }

  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (!ctx) return;

    const data = {
      labels: this.profitByCategory.map((p) => p.category),
      datasets: [
        {
          label: 'Lucro por Categoria',
          data: this.profitByCategory.map((p) => p.profit),
          backgroundColor: [
            '#3B82F6',
            '#EF4444',
            '#F59E0B',
            '#10B981',
            '#8B5CF6',
          ],
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  createLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyGrowth.map((m) => m.month),
        datasets: [
          {
            label: 'Receita Mensal',
            data: this.monthlyGrowth.map((m) => m.total),
            fill: false,
            borderColor: '#3B82F6',
            tension: 0.3,
            pointBackgroundColor: '#3B82F6',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true, position: 'top' } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }
}
