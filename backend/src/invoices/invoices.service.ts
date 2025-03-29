import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDto } from '../auth/dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../auth/dto/update-invoice.dto';
import { ProductsService } from '../products/products.service'; // Importa ProductsService
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private productsService: ProductsService
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findAllForUser(userId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Invoice | null> {
    const invoice = await this.invoiceModel.findById(id).exec();
    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Verify stock availability for each product in the invoice
    for (const product of createInvoiceDto.products) {
      const dbProduct = await this.productsService.findOne(product.productId);
      if (!dbProduct || dbProduct.stock < product.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.productId}`);
      }
    }

    // Reduce stock for each product after verification
    for (const product of createInvoiceDto.products) {
      const dbProduct = await this.productsService.findOne(product.productId);
			if(dbProduct){
				await this.productsService.updateStock(product.productId, product.quantity);
			}
    }

    // Calculate total based on products and quantities (optional, if not provided in DTO)
    let total = 0;
		let key = 0
		for (const item of createInvoiceDto.products) {
			const dbProduct = await this.productsService.findOne(item.productId);
			if(dbProduct){
				total += dbProduct.price * item.quantity;
				createInvoiceDto.products[key].name = dbProduct.name;
				createInvoiceDto.products[key].price = dbProduct.price;
			}
			key++;
		}

    const invoice = new this.invoiceModel({
      ...createInvoiceDto,
      total: total, // Use provided total or calculate it
      date: new Date(),
    });
    return invoice.save();
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndUpdate(id, updateInvoiceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.invoiceModel.findByIdAndDelete(id).exec();
    return;
  }
}