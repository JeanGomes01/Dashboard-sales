import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Sale } from '../types/sales.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private sales: Sale[] = [];

  constructor(private _http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this._http.get<any>('https://dummyjson.com/carts').pipe(
      map((res) =>
        res.carts.flatMap((cart: any) =>
          cart.products.map((p: any) => ({
            id: p.id,
            product: p.title,
            category: (() => {
              const title = p.title.toLowerCase();
              if (title.includes('phone') || title.includes('iPhone'))
                return 'Eletrônicos';
              if (title.includes('chair') || title.includes('table'))
                return 'Móveis';
              if (title.includes('keyboard') || title.includes('headset'))
                return 'Acessórios';
              return 'Outros';
            })(),
            quantity: p.quantity,
            price: p.price,
            date: new Date().toISOString().split('T')[0],
          }))
        )
      ),
      map((sales: Sale[]) => {
        this.sales = sales;
        return sales;
      })
    );
  }

  getProfitByCategory(): Observable<{ category: string; profit: number }[]> {
    const categories = Array.from(new Set(this.sales.map((s) => s.category)));
    const profits = categories.map((cat) => {
      const total = this.sales
        .filter((s) => s.category === cat)
        .reduce((sum, s) => sum + (s.price - (s.cost || 0)) * s.quantity, 0);
      return { category: cat, profit: total };
    });
    return of(profits);
  }

  getAverageTicket(): Observable<number> {
    return this._http.get<any[]>('https://fakestoreapi.com/products').pipe(
      map((products) => {
        const sales = products.map((p) => ({
          id: p.id,
          product: p.title,
          category: p.category,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: p.price,
          date: new Date().toISOString().split('T')[0],
        }));
        const total = sales.reduce((acc, s) => acc + s.price * s.quantity, 0);
        return total / sales.length;
      })
    );
  }

  getMonthlyGrowth(): Observable<{ month: string; total: number }[]> {
    return this.getSales().pipe(
      map((sales) => {
        const months = [
          { month: 'Jan', total: 0 },
          { month: 'Fev', total: 0 },
          { month: 'Mar', total: 0 },
          { month: 'Abr', total: 0 },
          { month: 'Mai', total: 0 },
          { month: 'Jun', total: 0 },
          { month: 'Jul', total: 0 },
          { month: 'Ago', total: 0 },
          { month: 'Set', total: 0 },
          { month: 'Out', total: 0 },
          { month: 'Nov', total: 0 },
          { month: 'Dez', total: 0 },
        ];

        const now = new Date();
        const currentMonthIndex = now.getMonth();

        for (let sale of sales) {
          const saleDate = new Date(sale.date);
          const monthIndex = saleDate.getMonth();

          if (monthIndex >= 0 && monthIndex <= currentMonthIndex) {
            months[monthIndex].total += sale.price * sale.quantity;
          }
        }

        return months.slice(0, currentMonthIndex + 1);
      })
    );
  }

  getTotalRevenue(): Observable<number> {
    const sales: Sale[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      product: `Produto ${i + 1}`,
      category: ['Eletrônicos', 'Móveis', 'Acessórios'][i % 3],
      quantity: Math.floor(Math.random() * 10) + 1,
      price: Math.floor(Math.random() * 1000) + 100,
      date: new Date().toISOString().split('T')[0],
    }));
    const total = sales.reduce((acc, s) => acc + s.price * s.quantity, 0);
    return of(total);
  }

  getSalesByCategory(category: string): Observable<Sale[]> {
    return of(this.sales.filter((sale) => sale.category === category));
  }
}
