import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

import { SalesService } from '../../services/sales.service';
import { Sale } from '../../types/sales.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  data: Sale[] = [];
  filteredData: any[] = [];
  reportType: string = 'total-sales';
  period: string = 'this-month';
  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getSales().subscribe((sales) => {
      this.data = sales;
      this.applyFilter();
    });
  }

  applyFilter() {
    switch (this.reportType) {
      case 'profit':
        this.filteredData = this.data.map((s) => ({
          date: s.date,
          value: s.price * s.quantity * 0.3,
        }));
        break;

      case 'total-sales':
        this.filteredData = this.data.map((s) => ({
          date: s.date,
          value: s.price * s.quantity,
        }));
        break;

      case 'average-ticket':
        this.filteredData = this.data.map((s) => ({
          date: s.date,
          value: s.price,
        }));
        break;

      case 'monthly-growth':
        this.filteredData = this.data.map((s, i, arr) => {
          if (i === 0) return { date: s.date, value: 0 };
          const prev = arr[i - 1].price * arr[i - 1].quantity;
          const curr = s.price * s.quantity;
          const growth = ((curr - prev) / prev) * 100;
          return { date: s.date, value: growth.toFixed(2) };
        });
        break;

      default:
        this.filteredData = [];
    }
  }

  onReportTypeChange(event: any) {
    this.reportType = event.target.value;
    this.applyFilter();
  }

  onPeriodChange(event: any) {
    this.period = event.target.value;

    this.applyFilter();
  }

  exportCSV(): void {
    if (!this.filteredData.length) return;
    const csvRows = [
      ['Data', 'Valor'],
      ...this.filteredData.map((d) => [d.date, d.value]),
    ];
    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.reportType}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportPDF(): void {
    if (!this.filteredData.length) return;
    const doc = new jsPDF();
    doc.text(`${this.reportType.replace('-', ' ')} Report`, 10, 10);
    let y = 20;
    this.filteredData.forEach((d) => {
      doc.text(`${d.date} | ${d.value}`, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`${this.reportType}_report.pdf`);
  }
}
