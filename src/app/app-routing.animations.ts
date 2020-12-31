
import {trigger, animate, style, group, query, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('dashboardManagement => dashboard', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })
      , { optional: true }),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-in', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ]),
  transition('dashboard => dashboardManagement', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })
      , { optional: true }),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
    ])
  ])
]);
