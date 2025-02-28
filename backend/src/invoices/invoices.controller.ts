import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDto } from './../auth/dto/create-invoice.dto';
import { UpdateInvoiceDto } from './../auth/dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { UnauthorizedException } from '@nestjs/common';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @Roles(Role.User, Role.Admin)
  async findAll(@Request() req: any): Promise<Invoice[]> {
    if (req.user.role === Role.User) {
      return this.invoicesService.findAllForUser(req.user.userId);
    }
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  async findOne(@Param('id') id: string, @Request() req: any): Promise<Invoice> {
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (req.user.role === Role.User && invoice.userId !== req.user.userId) {
      throw new UnauthorizedException('You do not have permission to view this invoice.');
    }
    return invoice;
  }

  @Post()
  @Roles(Role.User)
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req: any): Promise<Invoice> {
    createInvoiceDto.userId = req.user.userId; // Associate the invoice with the authenticated user
    return this.invoicesService.create(createInvoiceDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoicesService.update(id, updateInvoiceDto);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string): Promise<void> {
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    await this.invoicesService.remove(id);
  }
}