import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { PrescriptionsService } from './prescriptions.service';

describe('PrescriptionsResolver', () => {
  let resolver: PrescriptionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionsResolver, PrescriptionsService],
    }).compile();

    resolver = module.get<PrescriptionsResolver>(PrescriptionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
