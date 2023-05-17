import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './DATA/SEED_DATA';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async executeSeed() {
    await this.deleteAllProducts();
    return 'SEED_EXECUTED';
  }
  private async deleteAllProducts() {
    await this.productService.deleteAllProduct();

    const seedProducts = initialData.products;
    const insertPromises = [];

    seedProducts.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
