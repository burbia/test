import { CmHost } from 'src/app/components/widgets/connection-status-widget/model/cm-host.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LabService } from 'src/app/services/lab/lab.service';
import { OrderEnum } from 'src/app/components/shared/app-constants';

@Component({
  selector: 'app-select-host',
  templateUrl: './select-host.component.html',
  styleUrls: ['./select-host.component.scss']
})
export class SelectHostComponent implements OnInit {
  badgeValue: string;
  literalTitle = 'select-host';
  allItemsSelected: boolean = false;
  itemList = [];
  indeterminate: boolean = false;
  itemsSelectedOptions = [];
  orderHost = [
    { column: 'hostName', order: OrderEnum.ASC, active: true, default: true },
    { column: 'connectionName', order: OrderEnum.ASC, active: false, default: false }
  ];

  @Output() onSelectItem = new EventEmitter<string>();
  @Output() hasItemsDisabled = new EventEmitter<boolean>();
  @Input() selectedItems: string;

  constructor(private labService: LabService) {}

  ngOnInit() {
    // Get all Items
    this.labService.getHostConnections().subscribe((data: CmHost[]) => {
      data.forEach(element => {
        this.itemList.push({
          connectionName: element.connectionName.trim(),
          hostName: element.hostName,
          value: element.hostConnectionId.id.trim()
        });
      });
      this.initData();
    });
  }

  initData() {
    if (this.selectedItems) {
      this.itemsSelectedOptions = this.selectedItems
        .split(',')
        .filter(item => this.itemList.map(item => item.value).includes(item));
      if (this.itemsSelectedOptions.length !== this.selectedItems.length) {
        this.hasItemsDisabled.emit(true);
      }
      this.selectedItems = this.itemsSelectedOptions.join();

      this.itemsSelectedOptions = this.selectedItems
        .split(',')
        .filter(item => this.itemList.map(item => item.value).includes(item));
    } else {
      // All selected by default
      this.itemsSelectedOptions = this.itemList.map(item => item.value);
      this.selectedItems = this.itemsSelectedOptions.join();
    }

    this.allItemsSelected = this.itemsSelectedOptions.length === this.itemList.length;
    this.indeterminate = !this.allItemsSelected && this.itemsSelectedOptions.length > 0;

    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length > 0
        ? this.itemsSelectedOptions.length + '/' + this.itemList.length
        : this.itemList.length.toString();

    this.sortItems('default');
    this.onSelectItem.emit(this.selectedItems);
  }

  selectAllItems() {
    if (this.allItemsSelected) {
      this.itemsSelectedOptions = this.itemList.map(item => item.value);
    } else {
      this.itemsSelectedOptions = [];
    }
    this.indeterminate = false;
    this.onSelectItem.emit(this.itemsSelectedOptions.join(','));
    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length > 0
        ? this.itemsSelectedOptions.length + '/' + this.itemList.length
        : this.itemList.length.toString();
  }

  changeSelectItem() {
    if (this.itemList.map(item => item.value).every(v => this.itemsSelectedOptions.includes(v))) {
      this.allItemsSelected = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = this.itemsSelectedOptions.length > 0;
      this.allItemsSelected = false;
    }
    this.onSelectItem.emit(this.itemsSelectedOptions.join());

    this.badgeValue =
      this.itemsSelectedOptions.length === this.itemList.length
        ? this.itemsSelectedOptions.length.toString()
        : this.itemsSelectedOptions.length > 0
        ? this.itemsSelectedOptions.length + '/' + this.itemList.length
        : this.itemList.length.toString();
  }

  sortItems(columnName: string) {
    let actualOrder = this.orderHost.filter(item => item.column === columnName).map(item => item.order)[0];
    let newOrder = actualOrder === OrderEnum.ASC ? OrderEnum.DESC : OrderEnum.ASC;
    // Update the orderHost variable
    this.orderHost = this.orderHost.map(item => {
      return item.column === columnName
        ? { column: item.column, order: newOrder, active: true, default: item.default }
        : { column: item.column, order: item.order, active: false, default: item.default };
    });

    switch (columnName) {
      case 'connectionName': {
        this.itemList.sort(function(a, b) {
          return a.connectionName.localeCompare(b.connectionName, undefined, {
            numeric: true,
            sensitivity: 'base'
          }) === 0
            ? a.hostName.localeCompare(b.hostName, undefined, { numeric: true, sensitivity: 'base' })
            : a.connectionName.localeCompare(b.connectionName, undefined, { numeric: true, sensitivity: 'base' });
        });
        break;
      }
      case 'hostName':
      default: {
        this.itemList.sort(function(a, b) {
          return a.hostName.localeCompare(b.hostName, undefined, { numeric: true, sensitivity: 'base' }) === 0
            ? a.connectionName.localeCompare(b.connectionName, undefined, { numeric: true, sensitivity: 'base' })
            : a.hostName.localeCompare(b.hostName, undefined, { numeric: true, sensitivity: 'base' });
        });
        this.orderHost = this.orderHost.map(item => {
          return item.default === true
            ? { column: item.column, order: newOrder, active: true, default: item.default }
            : { column: item.column, order: item.order, active: false, default: item.default };
        });
        break;
      }
    }

    if (newOrder === OrderEnum.DESC) {
      this.itemList.reverse();
    }
  }
}
