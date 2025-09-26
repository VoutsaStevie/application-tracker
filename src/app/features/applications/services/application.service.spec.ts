import { TestBed } from '@angular/core/testing';
import { applicationService } from './application.service';
import { CreateapplicationRequest } from '../models/application.model';

describe('applicationService', () => {
  let service: applicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [applicationService]
    });
    service = TestBed.inject(applicationService);
  });

  it('should add an application', async () => {
    const applicationData: CreateapplicationRequest = {
      title: 'Test App',
      description: 'simple test',
      priority: 'job',
      assignedTo: 1
    };

    await service.createapplication(applicationData);
    const allApplications = await service.getAllapplications();

    expect(allApplications.length).toBe(1);
    expect(allApplications[0].title).toBe(applicationData.title);
    expect(allApplications[0].description).toBe(applicationData.description);
  });

  it('should delete an application', async () => {
    const applicationData: CreateapplicationRequest = {
      title: 'App to delete',
      description: 'Delete me',
      priority: 'job',
      assignedTo: 1
    };

    const newApp = await service.createapplication(applicationData);
    const deleted = await service.deleteapplication(newApp.id);
    const allApplications = await service.getAllapplications();

    expect(deleted).toBeTrue();
    expect(allApplications.length).toBe(0);
  });
});
