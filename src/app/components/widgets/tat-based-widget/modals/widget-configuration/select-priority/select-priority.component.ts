import { ANY_ITEM } from 'src/app/components/shared/app-constants';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-select-priority',
  templateUrl: '../select-html/select-html.component.html',
  styleUrls: ['../select-html/select-html.component.scss']
})
export class SelectPriorityComponent implements OnInit {
  badgeValue: string;
  literalTitle = 'select-priority';
  allItemsSelected: boolean = false;
  indeterminate: boolean = true;
  anyItem: string = ANY_ITEM;
  itemList = [
    { name: 'STAT', value: 'STAT' },
    { name: 'Routine', value: 'ROUTINE' }
  ];
  itemsSelectedOptions = [];

  @Output() onSelectItem = new EventEmitter<string>();
  @Input() selectedItems: string;
  @Input() heightSelect: string = '507px';
  @Input() heightPercent: string = '94%';

  constructor() {}

  ngOnInit() {
    if (this.selectedItems) {
      if (this.selectedItems === this.anyItem) {
        this.itemsSelectedOptions = this.itemList.map(item => item.value);
      } else {
        this.itemsSelectedOptions = [this.selectedItems];
      }
    } else {
      // All selected by default
      this.itemsSelectedOptions = this.itemList.map(item => item.value);
      this.selectedItems = this.anyItem;
    }

    this.allItemsSelected = this.selectedItems === this.anyItem;
    this.indeterminate = !this.allItemsSelected && this.itemsSelectedOptions.length > 0;
    this.onSelectItem.emit(this.selectedItems);

    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length + '/' + this.itemList.length;
  }

  selectAllItems() {
    if (this.allItemsSelected) {
      this.itemsSelectedOptions = this.itemList.map(item => item.value);
      this.onSelectItem.emit(this.anyItem);
    } else {
      this.itemsSelectedOptions = [];
      this.onSelectItem.emit('');
    }
    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length + '/' + this.itemList.length;
    this.indeterminate = false;
  }

  changeSelectItem() {
    if (this.itemList.map(item => item.value).every(v => this.itemsSelectedOptions.includes(v))) {
      this.allItemsSelected = true;
      this.indeterminate = false;
      this.onSelectItem.emit(this.anyItem);
    } else {
      this.allItemsSelected = false;
      this.indeterminate = this.itemsSelectedOptions.length > 0;
      this.onSelectItem.emit(this.itemsSelectedOptions[0] ? this.itemsSelectedOptions[0] : '');
    }

    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length + '/' + this.itemList.length;
  }
}
