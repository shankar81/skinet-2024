import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { ShopParams } from '../../shared/models/shop';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  title = 'Skinet';
  products?: Pagination<Product>;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low - High', value: 'priceAsc' },
    { name: 'Price: High - Low', value: 'priceDesc' },
  ];
  shopParams = new ShopParams();
  pageOptions = [5, 10, 15, 20];
  private shopService = inject(ShopService);
  private dialogRef = inject(MatDialog);

  ngOnInit(): void {
    this.initializeShop();
  }

  fetchProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (data) => (this.products = data),
    });
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.fetchProducts();
  }

  openFiltersDialog() {
    const dialogRef = this.dialogRef.open(FiltersDialogComponent, {
      minWidth: '600px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          // Apply Filters
          this.fetchProducts();
        }
      },
    });
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) this.shopParams.sort = selectedOption.value;
    this.shopParams.pageNumber = 1;
    this.fetchProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageSize = event.pageSize;
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.fetchProducts();
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    console.log(this.shopParams)
    this.fetchProducts();
  }
}
