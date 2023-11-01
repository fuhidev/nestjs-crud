import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AgencyEntity } from './agency.entity';
import { AgencyDTO } from './agency.interface';
import { AgencyService } from './agency.service';

@Controller('agency')
export class AgencyController {
  constructor(private service: AgencyService) {}
  @Get()
  getList() {
    return this.service.getList();
  }

  @Post()
  createOne(@Body() body: AgencyDTO) {
    return this.service.createOne(body);
  }

  @Patch(':agencyId')
  updteOne(
    @Param('agencyId', ParseIntPipe) agencyId: number,
    @Body() dto: AgencyEntity,
  ) {
    return this.service.updateOne({ agencyId, dto });
  }

  @Get(':agencyId')
  getOne(@Param('agencyId', ParseIntPipe) agencyId: number) {
    return this.service.getOne(agencyId);
  }
}
