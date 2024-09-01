import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe, provideImageKitLoader } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, MatButton, MatIcon, MatFormField, MatInput, MatLabel, MatDivider],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  shopService = inject(ShopService);
  activatedRoute = inject(ActivatedRoute);
  product?: Product;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.shopService
        .getProduct(+id)
        .subscribe({ next: (value) => (this.product = value) });
    }
  }
}
