import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { ShopParams } from '../shared/models/shop';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);
  brands: string[] = [];
  types: string[] = [];

  constructor() {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brands && shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if (shopParams.types && shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    if (shopParams.sort && shopParams.sort.length > 0) {
      params = params.append('sort', shopParams.sort);
    }

    if (shopParams.search && shopParams.search.length > 0) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
    });
  }

  getBrands() {
    if (this.brands.length > 0) return;
    return this.http
      .get<string[]>(this.baseUrl + 'products/brands')
      .subscribe({ next: (data) => (this.brands = data) });
  }

  getTypes() {
    if (this.types.length > 0) return;
    return this.http
      .get<string[]>(this.baseUrl + 'products/types')
      .subscribe({ next: (data) => (this.types = data) });
  }
}
