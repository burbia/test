import { SelectPriorityComponent } from './select-priority.component';
import { ANY_ITEM } from 'src/app/components/shared/app-constants';
import { getRandomInt } from 'src/app/test-utils/util';

describe('SelectPriorityComponent', () => {
  const anyItem: string = ANY_ITEM;
  const itemList = [
    { name: 'STAT', value: 'STAT' },
    { name: 'Routine', value: 'ROUTINE' }
  ];

  function setUp(selectedItems = '') {
    const component = new SelectPriorityComponent();
    component.selectedItems = selectedItems;
    component.ngOnInit();
    return component;
  }
  // Test ngOninit method
  test('ngOnInit(): initialize component test with empty selected input', async () => {
    const componentPriority = setUp();
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(anyItem));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(true);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe(itemList.length.toString());
  });

  test('ngOnInit(): initialize component test with all values as selected input', async () => {
    const componentPriority = setUp(anyItem);
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(anyItem));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(true);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe(itemList.length.toString());
  });

  test('ngOnInit(): initialize component test with selected values as input', async () => {
    const componentPriority = setUp(itemList[0].value);
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemList[0].value));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining([itemList[0].value]));
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(true);
    // badgeValue
    expect(componentPriority.badgeValue).toBe('1' + '/' + itemList.length);
  });

  // Test selectAllItems method
  test('selectAllItems(): select all items with input empty', async () => {
    const componentPriority = setUp();
    componentPriority.allItemsSelected = false; // Click in select all.
    componentPriority.selectAllItems(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe('0' + '/' + itemList.length);
  });

  test('selectAllItems(): select all items with input any', async () => {
    const componentPriority = setUp(anyItem);
    componentPriority.allItemsSelected = false; // Click in select all.
    componentPriority.selectAllItems(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe('0' + '/' + itemList.length);
  });

  test('selectAllItems(): select all items with input selected', async () => {
    const componentPriority = setUp(itemList[1].value);
    componentPriority.allItemsSelected = true; // Click in select all.
    componentPriority.selectAllItems(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(itemList.map(item => item.value).join())
    );
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining(itemList.map(item => item.value)));
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(true);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe(itemList.length.toString());
  });

  test('selectAllItems(): select all items with input empty after all items were selected -> deselect all', async () => {
    const componentPriority = setUp();
    componentPriority.allItemsSelected = false; // Click in select all after all is checked.
    componentPriority.selectAllItems(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(''));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toHaveLength(0);
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(false);
    // badgeValue
    expect(componentPriority.badgeValue).toBe('0' + '/' + itemList.length);
  });

  // Test changeSelectItem method
  test('changeSelectItem(): select an item with input empty when all items are selected', async () => {
    const componentPriority = setUp();
    // Item to select / deselect
    let itemClicked: string = itemList[getRandomInt(itemList.length)].value;
    componentPriority.itemsSelectedOptions = componentPriority.itemsSelectedOptions.filter(v => v !== itemClicked); // When an item is deselected Angular remove it from model
    componentPriority.changeSelectItem(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) =>
      expect(selectedItems).toBe(
        itemList
          .map(item => item.value)
          .filter(v => v !== itemClicked)
          .join()
      )
    );
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(
      expect.arrayContaining(itemList.map(item => item.value).filter(v => v !== itemClicked))
    );
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(true);
    // badgeValue
    expect(componentPriority.badgeValue).toBe(itemList.length - 1 + '/' + itemList.length);
  });

  test('changeSelectItem(): select an item with input empty when all items are not selected', async () => {
    const componentPriority = setUp();
    // Item to select / deselect
    componentPriority.allItemsSelected = false;
    componentPriority.selectAllItems(); // Deselect all
    let itemClicked: string = itemList[getRandomInt(itemList.length)].name;
    componentPriority.itemsSelectedOptions.push(itemClicked); // When an item is selected Angular add it to model
    componentPriority.changeSelectItem(); // call method
    // emit
    componentPriority.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(itemClicked));
    // itemsSelectedOptions
    expect(componentPriority.itemsSelectedOptions).toEqual(
      expect.arrayContaining(itemList.map(item => item.value).filter(v => v === itemClicked))
    );
    // allItemsSelected
    expect(componentPriority.allItemsSelected).toBe(false);
    // indeterminate
    expect(componentPriority.indeterminate).toBe(true);
    // badgeValue
    expect(componentPriority.badgeValue).toBe(1 + '/' + itemList.length);
  });

  test('changeSelectItem(): select all items one by one with input any all selected', async () => {
    const componentPriority = setUp(anyItem);
    // Item to select / deselect
    componentPriority.allItemsSelected = true;
    let itemListCopy = [...itemList.map(item => item.value)];
    itemList.forEach(item => {
      let itemClicked: string = item.value;
      itemListCopy = itemListCopy.filter(v => v !== itemClicked);
      componentPriority.itemsSelectedOptions = componentPriority.itemsSelectedOptions.filter(v => v != itemClicked); // When an item is deselected Angular remove it from model
      componentPriority.changeSelectItem(); // call method
      // emit
      componentPriority.onSelectItem.subscribe((selectedItems: string) =>
        expect(selectedItems).toBe(itemListCopy.join())
      );
      // itemsSelectedOptions
      expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining(itemListCopy));
      // allItemsSelected
      expect(componentPriority.allItemsSelected).toBe(false);
      if (itemListCopy.length > 0) {
        // indeterminate
        expect(componentPriority.indeterminate).toBe(true);
        // badgeValue
        expect(componentPriority.badgeValue).toBe(itemListCopy.length + '/' + itemList.length);
      } else {
        // indeterminate
        expect(componentPriority.indeterminate).toBe(false);
        // badgeValue
        expect(componentPriority.badgeValue).toBe(0 + '/' + itemList.length);
      }
    });
  });
  test('changeSelectItem(): select all items one by one with input any all items previous not selected', async () => {
    const componentPriority = setUp(anyItem);
    // Item to select / deselect
    componentPriority.allItemsSelected = false;
    componentPriority.selectAllItems();
    let itemListCopy = [];
    itemList.forEach(item => {
      let itemClicked: string = item.value;
      itemListCopy = [...itemListCopy, itemClicked];
      componentPriority.itemsSelectedOptions.push(itemClicked); // When an item is selected Angular add it to model
      componentPriority.changeSelectItem(); // call method
      // emit
      componentPriority.onSelectItem.subscribe((selectedItems: string) =>
        expect(selectedItems).toBe(itemListCopy.join())
      );
      // itemsSelectedOptions
      expect(componentPriority.itemsSelectedOptions).toEqual(expect.arrayContaining(itemListCopy));

      if (itemListCopy.length === itemList.length) {
        // allItemsSelected
        expect(componentPriority.allItemsSelected).toBe(true);
        // indeterminate
        expect(componentPriority.indeterminate).toBe(false);
        // badgeValue
        expect(componentPriority.badgeValue).toBe(itemList.length.toString());
      } else {
        // allItemsSelected
        expect(componentPriority.allItemsSelected).toBe(false);
        // indeterminate
        expect(componentPriority.indeterminate).toBe(true);
        // badgeValue
        expect(componentPriority.badgeValue).toBe(itemListCopy.length + '/' + itemList.length);
      }
    });
  });
});
