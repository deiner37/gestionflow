import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class InvoiceProduct {
  @Prop({ required: true, type: String })
  productId: string;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;

	@Prop({ required: true, type: String })
	name: string;

	@Prop({ required: true, type: Number, min: 0 })
	price: number;
}

@Schema()
export class Invoice {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, type: [InvoiceProduct] })
  products: InvoiceProduct[];

  @Prop({ required: true, type: Number, min: 0 })
  total: number;

  @Prop({ required: true, enum: ['pending', 'paid', 'cancelled'], default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled';

  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
export type InvoiceDocument = Invoice & Document;