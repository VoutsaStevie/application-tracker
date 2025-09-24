import { TestBed } from '@angular/core/testing';
import { applicationService } from './application.service';
import { CreateapplicationRequest } from '../models/application.model';

describe('applicationService', () => {
  let service: applicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(applicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a application', async () => {
    const applicationData: CreateapplicationRequest = {
      title: 'Test application',
      description: 'Just a test',
      priority: 'low',
      assignedTo: 1
    };

    const newapplication = await service.createapplication(applicationData);

    const allapplications = await service.getAllapplications();
    expect(allapplications.length).toBe(1);
    expect(allapplications[0]).toEqual(newapplication);
  });

  it('should remove a application', async () => {
    const applicationData: CreateapplicationRequest = {
      title: 'Test application',
      description: 'Just a test',
      priority: 'low',
      assignedTo: 1
    };

    const newapplication = await service.createapplication(applicationData);

    const deleted = await service.deleteapplication(newapplication.id);
    const allapplications = await service.getAllapplications();

    expect(deleted).toBeTrue();
    expect(allapplications.length).toBe(0);
  });
});
