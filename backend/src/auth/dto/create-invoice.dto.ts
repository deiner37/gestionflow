import { IsString, IsNumber, IsEnum, IsArray, ArrayMinSize, Min } from 'class-validator';

export class InvoiceProduct {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

	@IsString()
  name: string;

	@IsNumber()
	@Min(0)
  price: number;
}

export class CreateInvoiceDto {
  @IsString()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  products: InvoiceProduct[];

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(['pending', 'paid', 'cancelled'])
  status: 'pending' | 'paid' | 'cancelled';
}