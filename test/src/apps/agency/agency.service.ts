import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgencyEntity } from './agency.entity';
import { AgencyDTO } from './agency.interface';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(AgencyEntity)
    private repo: Repository<AgencyEntity>,
  ) {}

  getList() {
    return this.repo.find({
      select: ['name', 'agencyId', 'phone'],
    });
  }

  createOne(dto: AgencyDTO) {
    return this.repo.save(dto);
  }

  async updateOne({ agencyId, dto }: { agencyId: number; dto: AgencyEntity }) {
    const entity = await this.repo.findOne({
      where: { agencyId },
      select: ['agencyId'],
    });
    if (!entity) throw new NotFoundException();
    await this.repo.update(entity.agencyId, dto);
    return { ...dto, agencyId };
  }

  getOne(agencyId: number) {
    return this.repo.findOne({
      where: { agencyId },
      select: ['name', 'agencyId', 'phone'],
    });
  }
}
