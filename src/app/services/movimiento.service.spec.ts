import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MovimientoService } from './movimiento.service';

describe('MovimientoService', () => {
  let service: MovimientoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MovimientoService]
    });
    service = TestBed.inject(MovimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debe llamar al endpoint plural /api/movimientos al listar', () => {
    service.getAll().subscribe();

    const req = httpMock.expectOne('/api/movimientos');
    expect(req.request.method).toBe('GET');
    httpMock.verify();
  });
});