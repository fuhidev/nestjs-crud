import { Controller } from '@nestjs/common';
import { Crud } from 'nest-crud-server';
import { LegalService } from './legal.service';

@Crud({
  params: {
    primaryKey: 'legalId',
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
})
@Controller('legal')
export class LegalController {
  constructor(private readonly service: LegalService) {}
}
