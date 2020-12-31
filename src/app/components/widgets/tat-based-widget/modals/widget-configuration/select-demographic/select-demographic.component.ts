import { TranslateService } from '@ngx-translate/core';
import { Organisation } from 'src/app/models/organisation.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LabService } from 'src/app/services/lab/lab.service';
import { ANY_ITEM } from 'src/app/components/shared/app-constants';

const EMPTY_VALUE: string = 'EMPTY';

@Component({
  selector: 'app-select-demographic',
  templateUrl: '../select-html/select-html.component.html',
  styleUrls: ['../select-html/select-html.component.scss']
})
export class SelectDemographicComponent implements OnInit {
  badgeValue: string;
  literalTitle = 'select-demographic';
  textLiteralNullValues: string = 'Null values';
  allItemsSelected: boolean = false;
  itemList = [];
  indeterminate: boolean = false;
  anyItem: string = ANY_ITEM;
  itemsSelectedOptions = [];
  @Output() onSelectItem = new EventEmitter<string>();
  @Output() hasValues = new EventEmitter<boolean>();
  @Output() hasItemsDisabled = new EventEmitter<boolean>();
  @Input() selectedItems: string;
  @Input() heightSelect: string = '507px';
  @Input() heightPercent: string = '94%';

  constructor(private labService: LabService, translateService: TranslateService) {
    translateService.get('empty-organisation').subscribe((literalValue: string) => {
      this.textLiteralNullValues = literalValue;
    });
  }

  ngOnInit() {
    // Get all Items
    this.labService.getOrganisations().subscribe((data: Organisation[]) => {
      data.forEach(element => {
        this.itemList.push({ name: element.organisationDescription.trim(), value: element.id.organisationCode.trim() });
      });
      this.initData();
    });
  }

  initData() {
    let isDemographicConfigure: boolean = this.itemList.length > 0;
    // If there is not Items send event to hide demographics
    this.hasValues.emit(isDemographicConfigure);
    if (isDemographicConfigure) {
      // ADD EMPTY
      this.itemList.unshift({ name: this.textLiteralNullValues, value: EMPTY_VALUE });
      if (this.selectedItems) {
        if (this.selectedItems === this.anyItem) {
          this.itemsSelectedOptions = this.itemList.map(item => item.value);
        } else {
          this.itemsSelectedOptions = this.selectedItems
            .split(',')
            .filter(item => this.itemList.map(item => item.value).includes(item));
          if (this.itemsSelectedOptions.length !== this.selectedItems.length) {
            this.hasItemsDisabled.emit(true);
          }
          this.selectedItems = this.itemsSelectedOptions.join();
        }
      } else {
        // All selected by default
        this.itemsSelectedOptions = this.itemList.map(item => item.value);
        this.selectedItems = this.anyItem;
      }

      this.allItemsSelected = this.selectedItems === this.anyItem;
      this.indeterminate = !this.allItemsSelected && this.itemsSelectedOptions.length > 0;

      this.badgeValue =
        this.itemsSelectedOptions.length === this.itemList.length
          ? this.itemsSelectedOptions.length.toString()
          : this.itemsSelectedOptions.length + '/' + this.itemList.length;

      this.onSelectItem.emit(this.selectedItems);
    } else {
      this.onSelectItem.emit(this.anyItem);
    }
  }

  selectAllItems() {
    if (this.allItemsSelected) {
      this.itemsSelectedOptions = this.itemList.map(item => item.value);
      this.onSelectItem.emit(this.anyItem);
    } else {
      this.itemsSelectedOptions = [];
      this.onSelectItem.emit('');
    }
    this.indeterminate = false;
    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length + '/' + this.itemList.length;
  }

  changeSelectItem() {
    if (this.itemList.map(item => item.value).every(v => this.itemsSelectedOptions.includes(v))) {
      this.allItemsSelected = true;
      this.indeterminate = false;
      this.onSelectItem.emit(this.anyItem);
    } else {
      this.indeterminate = this.itemsSelectedOptions.length > 0;
      this.allItemsSelected = false;
      this.onSelectItem.emit(this.itemsSelectedOptions.join());
    }

    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length + '/' + this.itemList.length;
  }
}
