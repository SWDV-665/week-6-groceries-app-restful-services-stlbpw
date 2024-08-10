import { TestBed } from '@angular/core/testing';

import { GroceryserviceService } from './groceryservice.service';

describe('GroceryserviceService', () => {
  let service: GroceryserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
