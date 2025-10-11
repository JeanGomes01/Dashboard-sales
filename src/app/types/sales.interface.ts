export interface Sale {
  created_at: Date;
  id: number;
  product: string;
  category: string;
  quantity: number;
  price: number;
  date: string;
  cost?: number;
}
