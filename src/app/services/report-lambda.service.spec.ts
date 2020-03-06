import { TestBed } from '@angular/core/testing';

import { ReportLambdaService } from './report-lambda.service';

describe('ReportLambdaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportLambdaService = TestBed.get(ReportLambdaService);
    expect(service).toBeTruthy();
  });
});
