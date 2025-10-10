import { Injectable, signal } from '@angular/core';
import { Report } from '../types/reports.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private exportHistory = signal<Report[]>([
    {
      date: '2025-10-01 10:23',
      type: 'Sales',
      format: 'CSV',
      status: 'Completed',
    },
    {
      date: '2025-10-03 14:10',
      type: 'Clients',
      format: 'PDF',
      status: 'Completed',
    },
    {
      date: '2025-10-05 09:45',
      type: 'Products',
      format: 'CSV',
      status: 'Failed',
    },
  ]);
  constructor() {}

  getReports() {
    return this.exportHistory;
  }
}
