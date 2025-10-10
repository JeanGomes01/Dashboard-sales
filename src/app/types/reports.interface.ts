export interface Report {
  date: string;
  type: 'Sales' | 'Clients' | 'Products';
  format: 'CSV' | 'PDF';
  status: 'Completed' | 'Failed';
}
