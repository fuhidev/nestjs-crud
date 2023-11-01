import { AgencyEntity } from './agency.entity';

export interface AgencyDTO extends Omit<AgencyEntity, 'agencyId'> {}
