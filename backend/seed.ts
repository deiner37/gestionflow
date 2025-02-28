import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import mongoose, { Model, ConnectOptions } from 'mongoose';
import { User, UserSchema } from './src/users/user.schema';
import { Product, ProductSchema } from './src/products/product.schema';
import { Invoice, InvoiceSchema } from './src/invoices/invoice.schema';
import * as bcrypt from 'bcrypt';

// Cargar variables de entorno
dotenv.config();


async function seedDatabase() {
  try {
    await connect(process.env.MONGODB_URI || 'mongodb://localhost/user-product-invoice-app');
    console.log('Conectado a MongoDB');

		let UserModel = mongoose.model('User', UserSchema);
    let ProductModel = mongoose.model('Product', ProductSchema);
    let InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

    //await User.deleteMany({});
    //await Product.deleteMany({});
    //await Invoice.deleteMany({});

    const admin = new UserModel({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
    });

    const user = new UserModel({
      name: 'Usuario',
      email: 'user@example.com',
      password: '123456',
      role: 'user',
    });

    await admin.save();
    await user.save();
    console.log('Usuarios insertados: Admin y Usuario');

    const laptop = new ProductModel({
      name: 'Laptop',
      description: 'Laptop de alta gama',
      price: 1200,
      stock: 10,
      status: 'active',
    });

    const phone = new ProductModel({
      name: 'Smartphone',
      description: 'Teléfono inteligente 5G',
      price: 600,
      stock: 20,
      status: 'active',
    });

    await laptop.save();
    await phone.save();
    console.log('Productos insertados: Laptop y Smartphone');

    // Insertar factura por defecto para el usuario
    const invoice = new InvoiceModel({
      user_id: user._id,
      products: [
        { product_id: laptop._id, quantity: 1 },
        { product_id: phone._id, quantity: 2 },
      ],
      total: laptop.price * 1 + phone.price * 2, // 1200 + 1200 = 2400
      date: new Date(),
    });

    await invoice.save();
    console.log('Factura insertada para el usuario');

    console.log('Base de datos inicializada con éxito');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();