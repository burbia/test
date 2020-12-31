# LpmAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Install

Run `npm install` to get all dependencies.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. By default it is use the `--prod` flag.

## Start Development server

Running `npm start` for start a dev server in your localhost. Navigate to `http://localhost:4200/app/`. The app will automatically reload if you change any of the source files.
The `npm start` script is configuring `--proxy-config ./proxy.conf.json`. This file defines policies to redirect calls to backend servers. You can change backend configurations by edit ips in this file or using your own file. Remember that this file only affects to dev never to production environment.

## Start Mock server

Running `npm run start:mock` for start a dev server with `--proxy-config ./proxy-mock.conf.json` in your localhost. In paralel run `npm run mock-server` to start the json server with the mock db located in `db.json`. You can add data to `db.json` and to `proxy-mock.conf.json` in orther to test your development with mocked data.
Navigate to `http://localhost:4200/app/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io).

## Test Best Practices

#### Writing Test

Make tests thinking about functional details just as end-user would, do not focus on implementation details.
We are using [Jest](https://jestjs.io) as runner and [Angular Testing Utilities](https://angular.io/guide/testing) to test components, services, etc. The Services, utility classes and others can be tested in isolation with Jest.
Unit testing means testing only the class under test. You must build stubs for each component, service, directive, pipe, amongst others that interact with your class under isolate test.
Test names are the same the class under test terminated in spec.ts. Do not use DOM elements that can be modified to test your components. Instead of these DOM elements, use the component api and the public state to verify the behavior.
A little schema can be:

1. First: Create the component, if the component hasn't dependencies, then you can create the component only with:

   ```
   const component = new SampleComponent();
   ```

   When there are others dependencies you should use the TestBed Angular utilities to build the component. See example below.

2. Second: Play with the public component's api.

   ```
   component.publicMethod();

   ```

3. Third: Verify the public state of the component.
   ```
   expect(component.propertie).toBe(true);
   ```

### Use Setup function instead beforeEach.

Setup function is more flexible, you can change configuration components, mocks and so on in each test individually.
An example of test:

```
imports ...

function setUp(selectedItems = '', labService: Partial<LabService> = labServiceMock) {
    TestBed.configureTestingModule({
    imports: [
      FormsModule,
      MatCheckboxModule,   // import all modules needed
      ...
    ],
    declarations: [
      TranslatePipeMock,
      MatIconComponentMock,  // declare components, directives, pipes used
      ...
    ],
   providers: [{ provide: LabService, useValue: labServiceMock }]
  });
    // Create component
    const fixture = TestBed.createComponent(SelectDemographicComponent);
    const component = fixture.componentInstance;
    // Initialize component
    component.ngOnInit();

  return {
    component
    ... // Return what ever you need
  };
}

describe('SelectDemographicComponent start up test', () => {
   test('should render select-demographic text', async () => {
      const { component } = setUp();
      expect(component.allItemsSelected).toBe(true);
        .... // Check public state after inicialization
  });

... More test

```

### How to mock a service

Make a mock inline or create it in same file as the tests. Also, if the mock is so sophisticated, you can move it to test-utils folder located at src/app.Remenber to include mocks created out of test class in the **TestModuleMock** module, otherwise Angular aot won't work.
Sample code that implements mock inline functionality:

```
let labServiceMock: Partial<LabService> = {
    getOrganisations: function() {
      return of([{},{},...{}]);
    }
  };
.... // In setUp function
  providers: [{ provide: LabService, useValue: labServiceMock }]
...
// Create a spy to verify the calls to the mock api.
 const spyLabService = jest.spyOn(labServiceMock, 'getOrganisations');
...
// Then in your test
 expect(spyLabService).toHaveBeenCalledTimes(1);

```

### How to test with @Input

The Input parameters can be configured in setup function. Provide values in component properties, see an example below:

```
    ...// After creation, see example above.
    component.property = value;
```

### How to test with @Output

You can verify outputs from components creating an event binding to listen to events raised by the output property. See example below:

```
    ...// Create an spy from your output properties listen to emit.
    const spyOnSelectItem = jest.spyOn(component.onSelectItem, 'emit');
    // And in Your test case:
    ...
    component.onSelectItem.subscribe((selectedItems: string) => expect(selectedItems).toBe(valueExpected));
    expect(spyOnSelectItem).toHaveBeenCalledTimes(1);
    ...
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Sample TAT message for Backend

Including tenantId, tat average, calculated tats, last tat, tendency, percentage and status for the widget (red,yellow or green).

{
"id" : {
"tenantId" : "leonidas",
"widgetId": "381ba462-f0f2-4abc-ada9-e433d9e2ff4e"
},
"name" : "tat",
"averageTat" : 600000,
"numOfCalculatedTats" : 2,
"lastEndTime" : "2018-11-23 05:41:20",
"tendency" : 0,
"percentage" : 33,
"timeExceededStatus" : "WARNING"
}

## Sample TAT Alarm

{
"id":
{"tenantId":"leonidas",
"subscriberId":"381ba462-f0f2-4abc-ada9-e433d9e2ff4e"
},
"status":"WARNING"
}

                                                    ***********************************************************
                                                    *                                                         *
                                                    *PROXY.CONF.JSON IS JUST FOR DEVELOPMENT PURPOSES AND IT'S*
                                                    *            NOT APPLYING IN OTHER CASES                  *
                                                    *                                                         *
                                                    ***********************************************************
