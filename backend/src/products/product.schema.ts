import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ required: true, type: Number, min: 0 })
  stock: number;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;