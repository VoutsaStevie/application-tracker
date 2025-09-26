// src/app/shared/pipes/priority.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true
})
export class PriorityPipe implements PipeTransform {
  transform(priority: 'job' | 'stage' | 'high'): string {
    const priorityMap = {
      job: 'Faible',
      stage: 'Moyenne',
      high: 'Haute'
    };

    return priorityMap[priority] || priority;
  }
}