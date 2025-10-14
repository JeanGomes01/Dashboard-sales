import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { SalesService } from '../../services/sales.service';
import { SupabaseService } from '../../services/supabase.service';
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

  pagedData: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(
    private salesService: SalesService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getSales().subscribe((sales) => {
      this.data = sales;
      console.log('Dados da caixa:', sales);
      this.applyFilter();
    });
  }

  applyFilter() {
    switch (this.reportType) {
      case 'profit':
        this.filteredData = this.data.map((sales) => ({
          ...sales,
          value: sales.price * sales.quantity * 0.3,
        }));
        break;

      case 'total-sales':
        this.filteredData = this.data.map((sales) => ({
          ...sales,
          value: sales.price * sales.quantity,
        }));
        break;

      case 'average-ticket':
        this.filteredData = this.data.map((sales) => ({
          ...sales,
          value: sales.price,
        }));
        break;

      case 'monthly-growth':
        this.filteredData = this.data.map((sales, index, arr) => {
          if (index === 0) return { ...sales, value: 0 };
          const prev = arr[index - 1].price * arr[index - 1].quantity;
          const curr = sales.price * sales.quantity;
          const growth = ((curr - prev) / prev) * 100;
          return { date: sales.date, value: growth.toFixed(2) };
        });
        break;

      default:
        this.filteredData = [];
    }
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.updatePagedData();
  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  totalPagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((_, index) => index + 1);
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
      ['Produto', 'Categoria', 'Data', 'Valor', 'Quantidade'],
      ...this.filteredData.map((d) => [
        d.product,
        d.category,
        d.date,
        d.value,
        d.quantity,
      ]),
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
    const lineHeight = 10;

    doc.text('Produto | Categoria | Data | Valor | Quantidade', 10, y);
    y += lineHeight;

    this.filteredData.forEach((document) => {
      const row = `${document.product} | ${document.category} | ${new Date(
        document.date
      ).toLocaleDateString('pt-BR')} | ${document.value.toFixed(2)} | ${
        document.quantity
      }`;
      doc.text(row, 10, y);
      y += lineHeight;

      if (y > 280) {
        doc.addPage();
        y = 20;
        doc.text('Produto | Categoria | Data | Valor | Quantidade', 10, y);
        y += lineHeight;
      }
    });
    doc.save(`${this.reportType}_report.pdf`);
  }
}
