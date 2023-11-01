import { Controller } from '@nestjs/common';
import { Crud } from 'nest-crud-server';
import { DistrictService } from './district.service';

@Crud({
  params: {
    primaryKey: 'districtId',
  },
  routes: {
    only: ['getManyBase'],
  },
})
@Controller('district')
export class DistrictController {
  constructor(private service: DistrictService) {}
}
