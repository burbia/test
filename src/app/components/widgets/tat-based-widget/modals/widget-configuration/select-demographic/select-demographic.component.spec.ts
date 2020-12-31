import { SelectDemographicComponent } from './select-demographic.component';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardTitle, MatCardHeader, MatCardContent, MatCard } from '@angular/material/card';
import { TranslatePipeMock } from 'src/app/test-utils/translate-pipe-mock';
import { MatIconComponentMock } from 'src/app/test-utils/mat-icon-component-mock';
import { ANY_ITEM } from 'src/app/components/shared/app-constants';
import { getRandomInt } from 'src/app/test-utils/util';

describe('SelectDemographicComponent', () => {
  const anyItem: string = ANY_ITEM;
  const arrayOrganisations = [
    {
      id: {
        tenantId: 'leonidas',
        organisationId: '13',
        organisationCode: '123'
      },
      organisationDescription: 'Origin1'
    },
    {
      id: {
        tenantId: 'leonidas',
        organisationId: '31',
        organisationCode: '321'
      },
      organisationDescription: 'Origin4'
    }
  ];

  const itemList = arrayOrganisations.map(function(element) {
    return { name: element.organisationDescription, value: element.id.organisationCode };
  });
  // ADD EMPTY VALUE
  itemList.unshift({ name: 'Null values', value: 'EMPTY' });

  let labServiceMock: Partial<LabService> = {
    getOrganisations: function() {
      return of(arrayOrganisations);
    }
  };

  let translateServiceMock: Partial<TranslateService> = {
    get(key: any): any {
      return of(key);
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
        SelectDemographicComponent,
        TranslatePipeMock,
        MatIconComponentMock,
        MatCardTitle,
        MatCardHeader,
        MatCardContent,
        MatCard
      ],
      providers: [
        { provide: LabService, useValue: labServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    });
    const spyLabService = jest.spyOn(labServiceMock, 'getOrganisations').mockClear();
    const fixture = TestBed.createComponent(SelectDemographicComponent);
    const component = fixture.componentInstance;
    component.selectedItems = selectedItems;
    const spyOnSelectItem = jest.spyOn(component.onSelectItem, 'emit');
    const spyHasValues = jest.spyOn(component.hasValues, 'emit');
    const hasItemsDisabled = jest.spyOn(component.hasItemsDisabled, 'emit');

    component.ngOnInit();
    return { component, spyLabService, spyOnSelectItem, spyHasValues, hasItemsDisabled };
  }
  // Test ngOninit method
  test('ngOnInit(): initialize component test with no demographic configured', async () => {
    let labServiceNoValuesMock: Partial<LabService> = {
      getOrganisations: function() {
        return of([]);
      }
    };
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp('', labServiceNoValuesMock);
    // emit
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(false));
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });
  test('ngOnInit(): initialize component test with empty selected input', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(anyItem));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('ngOnInit(): initialize component test with all values as selected input', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp(anyItem);
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(anyItem));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('ngOnInit(): initialize component test with selected values as input', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp(itemList[0].value);
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemList[0].value));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  // Test selectAllItems method
  test('selectAllItems(): select all items with input empty', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
    component.allItemsSelected = false; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe('0' + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('selectAllItems(): select all items with input any', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp(anyItem);
    component.allItemsSelected = false; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe('0' + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('selectAllItems(): select all items with input selected', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp(itemList[0].value);
    component.allItemsSelected = true; // Click in select all.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(itemList.map(item => item.value).join())
    );
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('selectAllItems(): select all items with input empty after all items were selected -> deselect all', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
    component.allItemsSelected = false; // Click in select all after all is checked.
    component.selectAllItems(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe('0' + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(2);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  // Test changeSelectItem method
  test('changeSelectItem(): select an item with input empty when all items are selected', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
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
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('changeSelectItem(): select an item with input empty when all items are not selected', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
    // Item to select / deselect
    component.allItemsSelected = false;
    component.selectAllItems(); // Deselect all
    let itemClicked: string = itemList[getRandomInt(itemList.length)].name;
    component.itemsSelectedOptions.push(itemClicked); // When an item is selected Angular add it to model
    component.changeSelectItem(); // call method
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemClicked));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('changeSelectItem(): select all items one by one with input any all selected', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
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
      component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
        expect(component.badgeValue).toBe(0 + '/' + itemList.length);
      }
    });
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1 + itemList.length);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });
  test('changeSelectItem(): select all items one by one with input any all items previous not selected', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp();
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
      component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
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
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('When demographics was deleted or desactivated: badgade should be 0', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues } = setUp('itemDeleted');
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions.length).toBe(0);
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(false);
    // badgeValue
    expect(component.badgeValue).toBe(0 + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });

  test('When demographics was deleted or desactivated: with input selected badgade should be 1', async () => {
    const { component, spyLabService, spyOnSelectItem, spyHasValues, hasItemsDisabled } = setUp(
      'itemDeleted,' + itemList[0].value
    );
    // emit
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemList[0].value));
    component.hasValues.subscribe((spyHasValues: boolean) => expect(spyHasValues).toBe(true));
    component.hasItemsDisabled.subscribe((spyHasValues: boolean) => expect(hasItemsDisabled).toBe(true));
    // itemsSelectedOptions
    expect(component.itemsSelectedOptions.length).toBe(1);
    expect(component.itemsSelectedOptions).toEqual(expect.arrayContaining([itemList[0].value]));
    // allItemsSelected
    expect(component.allItemsSelected).toBe(false);
    // indeterminate
    expect(component.indeterminate).toBe(true);
    // badgeValue
    expect(component.badgeValue).toBe(1 + '/' + itemList.length);
    // spys calls
    expect(spyLabService).toHaveBeenCalledTimes(1);
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
    expect(spyHasValues).toHaveBeenCalledTimes(1);
  });
});
