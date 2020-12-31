import { MatIconModule } from '@angular/material/icon';
import { SelectHostComponent } from './select-host.component';
import { LabService } from 'src/app/services/lab/lab.service';
import { of, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardTitle, MatCardHeader, MatCardContent, MatCard } from '@angular/material/card';
import { TranslatePipeMock } from 'src/app/test-utils/translate-pipe-mock';
import { MatIconComponentMock } from 'src/app/test-utils/mat-icon-component-mock';
import { hostArray, hostArrayOrdered } from 'src/app/test-utils/test-host-array';
import { OrderEnum } from 'src/app/components/shared/app-constants';
import { getRandomInt } from 'src/app/test-utils/util';

describe('SelectHostComponent', () => {
  const itemList = hostArray.map(function(element) {
    return { hostName: element.hostName, connectionName: element.connectionName, value: element.hostConnectionId.id };
  });

  const itemListOrdered = hostArrayOrdered.map(function(element) {
    return { hostName: element.hostName, connectionName: element.connectionName, value: element.hostConnectionId.id };
  });

  let labServiceMock: Partial<LabService> = {
    getHostConnections: function() {
      return of(hostArray);
    }
  };

  function setUp(selectedItems = '', labService: Partial<LabService> = labServiceMock) {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatGridListModule,
        MatChipsModule,
        MatSelectModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        TranslateModule
      ],
      declarations: [
        SelectHostComponent,
        TranslatePipeMock,
        MatIconComponentMock,
        MatCardTitle,
        MatCardHeader,
        MatCardContent,
        MatCard
      ],
      providers: [{ provide: LabService, useValue: labServiceMock }]
    });
    const spyLabService = jest.spyOn(labServiceMock, 'getHostConnections').mockClear();
    const fixture = TestBed.createComponent(SelectHostComponent);
    const component = fixture.componentInstance;
    component.selectedItems = selectedItems;
    const spyOnSelectItem = jest.spyOn(component.onSelectItem, 'emit');

    component.ngOnInit();
    return { component, spyLabService, spyOnSelectItem };
  }
  // Test ngOninit method
  test('ngOnInit(): initialize component test with no host configured', async () => {
    let labServiceNoValuesMock: Partial<LabService> = {
      getHostConnections: function() {
        return of([]);
      }
    };
    const { spyLabService, spyOnSelectItem } = setUp('', labServiceNoValuesMock);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
  });
  test('ngOnInit(): initialize component test with empty selected input', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // emit
    component.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(itemList.map(item => item.value))
    );
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(component.allItemsSelected).toBe(true);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
  });

  test('ngOnInit(): initialize component test with all values as selected input', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp(itemList.map(item => item.value).join());
    // emit
    component.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(itemList.map(item => item.value))
    );
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(component.allItemsSelected).toBe(true);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
  });

  test('ngOnInit(): initialize component test with selected values as input', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp(itemList[0].value);
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemList[0].value));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining([itemList[0].value]));
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(true);
    // badgeValue
    expect(component.badgeValue).toBe('1' + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
  });

  // Test selectAllItems method
  test('selectAllItems(): select all items with input empty', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    component.allItemsSelected = false; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
  });

  test('selectAllItems(): select all items with input all', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp(itemList.map(item => item.value).join());
    component.allItemsSelected = false; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
  });

  test('selectAllItems(): select all items with input selected', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp(itemList[0].value);
    component.allItemsSelected = true; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(itemList.map(item => item.value).join())
    );
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(component.allItemsSelected).toBe(true);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
  });

  test('selectAllItems(): select all items with input empty after all items were selected -> deselect all', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    component.allItemsSelected = false; // Click in select all after all is checked.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length.toString());
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
  });

  // Test changeSelectItem method
  test('changeSelectItem(): select an item with input empty when all items are selected', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // Item to select / deselect
    let itemClicked: string = itemList[getRandomInt(itemList.length)].value;
    component.itemsSelectedOptions = component.itemsSelectedOptions.filter(v => v !== itemClicked); // When an item is deselected Angular remove it from model
    component.changeSelectItem(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(
        itemList
          .map(item => item.value)
          .filter(v => v !== itemClicked)
          .join()
      )
    );
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(
      expect.arrayContaining(itemList.map(item => item.value).filter(v => v !== itemClicked))
    );
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(true);
    // badgeValue
    expect(component.badgeValue).toBe(itemList.length - 1 + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
  });

  test('changeSelectItem(): select an item with input empty when all items are not selected', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // Item to select / deselect
    component.allItemsSelected = false;
    component.selectAllItems(); // Deselect all
    let itemClicked: string = itemList[getRandomInt(itemList.length)].hostName;
    component.itemsSelectedOptions.push(itemClicked); // When an item is selected Angular add it to model
    component.changeSelectItem(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemClicked));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toEqual(
      expect.arrayContaining(itemList.map(item => item.value).filter(v => v === itemClicked))
    );
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(true);
    // badgeValue
    expect(component.badgeValue).toBe(1 + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(3);
  });

  test('changeSelectItem(): select all items one by one with input all selected', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // Item to select / deselect
    component.allItemsSelected = true;
    let itemListCopy = [...itemList.map(item => item.value)];
    itemList.forEach(item => {
      let itemClicked: string = item.value;
      itemListCopy = itemListCopy.filter(v => v !== itemClicked);
      component.itemsSelectedOptions = component.itemsSelectedOptions.filter(v => v != itemClicked); // When an item is deselected Angular remove it from model
      component.changeSelectItem(); // call method
      // emit
      component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemListCopy.join()));
      // itemsSelectedOptions
      expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining(itemListCopy));
      // allItemsSelected
      expect(component.allItemsSelected).toBe(false);
      if (itemListCopy.length > 0) {
        // indeterminate
        expect(component.indeterminate).toBe(true);
        // badgeValue
        expect(component.badgeValue).toBe(itemListCopy.length + '/' + itemList.length);
      } else {
        // indeterminate
        expect(component.indeterminate).toBe(false);
        // badgeValue
        expect(component.badgeValue).toBe(itemList.length.toString());
      }
    });
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1 + itemList.length);
  });
  test('changeSelectItem(): select all items one by one with input all items previous not selected', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // Item to select / deselect
    component.allItemsSelected = false;
    component.selectAllItems();
    let itemListCopy = [];
    itemList.forEach(item => {
      let itemClicked: string = item.value;
      itemListCopy = [...itemListCopy, itemClicked];
      component.itemsSelectedOptions.push(itemClicked); // When an item is selected Angular add it to model
      component.changeSelectItem(); // call method
      // emit
      component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemListCopy.join()));
      // itemsSelectedOptions
      expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining(itemListCopy));

      if (itemListCopy.length === itemList.length) {
        // allItemsSelected
        expect(component.allItemsSelected).toBe(true);
        // indeterminate
        expect(component.indeterminate).toBe(false);
        // badgeValue
        expect(component.badgeValue).toBe(itemList.length.toString());
      } else {
        // allItemsSelected
        expect(component.allItemsSelected).toBe(false);
        // indeterminate
        expect(component.indeterminate).toBe(true);
        // badgeValue
        expect(component.badgeValue).toBe(itemListCopy.length + '/' + itemList.length);
      }
    });
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2 + itemList.length);
  });

  test('sortItems(): call to sortItems with numbers and text', async () => {
    const { component, spyLabService, spyOnSelectItem } = setUp();
    // 1. Default short by hostName and second by connectionName
    // check itemList
    expect(component.itemList).toEqual(expect.arrayContaining(itemListOrdered));
    // check orderHost
    let orderHostExpected = [
      { column: 'hostName', order: OrderEnum.ASC, active: true, default: true },
      { column: 'connectionName', order: OrderEnum.ASC, active: false, default: false }
    ];
    expect(component.orderHost).toEqual(expect.arrayContaining(orderHostExpected));

    const itemListOrderedDesc = [...itemListOrdered].reverse();

    //2. Short by Name Desc
    component.sortItems('hostName');
    // check itemList
    expect(component.itemList).toEqual(expect.arrayContaining(itemListOrderedDesc));
    // check orderHost
    let orderHostExpected2 = [
      { column: 'hostName', order: OrderEnum.DESC, active: true, default: true },
      { column: 'connectionName', order: OrderEnum.ASC, active: false, default: false }
    ];
    expect(component.orderHost).toEqual(expect.arrayContaining(orderHostExpected2));

    //3. Short by connectionName Desc
    component.sortItems('connectionName');
    // check itemList
    expect(component.itemList).toEqual(expect.arrayContaining(itemListOrdered));
    // check orderHost
    let orderHostExpected3 = [
      { column: 'hostName', order: OrderEnum.DESC, active: false, default: true },
      { column: 'connectionName', order: OrderEnum.DESC, active: true, default: false }
    ];
    expect(component.orderHost).toEqual(expect.arrayContaining(orderHostExpected3));

    //4. Short by connectionName Asc
    component.sortItems('connectionName');
    // check itemList
    expect(component.itemList).toEqual(expect.arrayContaining(itemListOrdered));
    // check orderHost
    let orderHostExpected4 = [
      { column: 'hostName', order: OrderEnum.DESC, active: false, default: true },
      { column: 'connectionName', order: OrderEnum.ASC, active: true, default: false }
    ];
    expect(component.orderHost).toEqual(expect.arrayContaining(orderHostExpected4));
  });
});
