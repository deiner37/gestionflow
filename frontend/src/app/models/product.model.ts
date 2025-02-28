export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}