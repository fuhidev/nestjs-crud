import { ProductEntity } from './product.entity';

export interface ProductDTO
  extends Omit<
    ProductEntity,
    'productId' | 'createDate' | 'updateDate' | 'avatar'
  > {}
