import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from 'nest-crud-server';
import { Repository } from 'typeorm';
import { LegalEntity } from './entities/legal.entity';

export class LegalService extends TypeOrmCrudService<LegalEntity> {
  constructor(@InjectRepository(LegalEntity) repo: Repository<LegalEntity>) {
    super(repo);
  }

  async createDraft() {
    const entity = this.repo.create({
      title: 'Chưa có tiêu đề pháp lý',
      description: 'Nội dung pháp lý',
    });
    return await this.repo.save(entity);
  }
}
