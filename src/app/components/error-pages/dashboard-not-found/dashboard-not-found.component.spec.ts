import { render } from '@testing-library/angular';
import { DashboardNotFoundComponent } from './dashboard-not-found.component';

describe('DashboardNotFoundComponent test', () => {
  test('renders the current value and can increment and decrement', async () => {
    const component = await render(DashboardNotFoundComponent);
    expect(component.getByText('DASHBOARD NOT FOUND'));
  });
});
