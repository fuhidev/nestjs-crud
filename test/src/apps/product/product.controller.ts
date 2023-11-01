import { Controller } from '@nestjs/common';
import { Crud } from 'nest-crud-server';
import { ProductService } from './product.service';

@Crud({
  params: {
    primaryKey: 'productId',
  },
  query: {
    maxLimit: 20,
    join: {
      avatar: {},
      categories: {},
      agency: {},
      district: {},
    },
  },
})
@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}
}
