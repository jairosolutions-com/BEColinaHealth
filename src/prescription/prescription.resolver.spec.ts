import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionResolver } from './prescription.resolver';
import { PrescriptionService } from './prescription.service';

describe('PrescriptionResolver', () => {
  let resolver: PrescriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionResolver, PrescriptionService],
    }).compile();

    resolver = module.get<PrescriptionResolver>(PrescriptionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
