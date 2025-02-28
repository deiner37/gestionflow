import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private api: ApiService) {}

	createInvoice(invoice: Invoice): Observable<Invoice> {
		return this.api.post<Invoice>('/invoices', invoice);
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.api.get<Invoice>(`/invoices/${id}`);
  }

  getUserPurchasesLastMonth(): Observable<number> {
    return this.api.get<number>('/invoices/user/purchases/last-month');
  }

	getInvoices(): Observable<Invoice[]> {
    return this.api.get<Invoice[]>('/invoices');
  }

  updateInvoice(id: string, invoice: Invoice): Observable<Invoice> {
    return this.api.put<Invoice>(`/invoices/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<void> {
    return this.api.delete<void>(`/invoices/${id}`);
  }

  getInvoicesForUser(userId: string): Observable<Invoice[]> {
    return this.api.get<Invoice[]>(`/invoices?userId=${userId}`);
  }
}