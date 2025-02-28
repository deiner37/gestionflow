export interface InvoiceProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
	username: string;
  _id?: string;
  userId: string;
  products: InvoiceProduct[];
  total: number;
  date: Date;
}