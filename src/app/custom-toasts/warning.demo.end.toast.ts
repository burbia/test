import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[warning-demo-end-toast-component]',
  styles: [
    `
      :host {
        background-color: #ffffff;
        position: relative;
        top: 50px;
        overflow: hidden;
        margin: 0 0 6px;
        padding: 0 !important;
        width: 400px !important;
        border-radius: 4px;
        border: 2px solid #cc0033;
        color: #333333 !important;
        pointer-events: all;
        cursor: pointer;
        height: 72px;
      }
      .icon {
        height: 40px !important;
        width: 40px !important;
      }
    `
  ],
  template: `
    <div
      id="div-alert-principal"
      [style.display]="state.value === 'inactive' ? 'none' : ''"
      style="background-color: #FFFFFF"
    >
      <div
        id="div-alert-icon"
        style="position: absolute; left: 0; width: 72px; height: 100% ; display: flex;
    justify-content: center; align-items: center; background-color: #cc0033"
      >
        <mat-icon class="icon" svgIcon="demo-warning-white"></mat-icon>
      </div>
      <div
        style="position: absolute; right: 0; width: 321px; height: 100% ; display: flex;
      align-items: center; padding-left: 12px;"
      >
        <div
          *ngIf="title"
          [class]="options.titleClass"
          [attr.aria-label]="title"
          style="font-size: 14px; font-weight: 500;"
          [innerHTML]="title"
        ></div>
      </div>
    </div>
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width]="width + '%'"></div>
    </div>
  `,
  animations: [
    trigger('flyInOut', [
      state(
        'inactive',
        style({
          opacity: 0
        })
      ),
      transition(
        'inactive => active',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
              opacity: 0
            }),
            style({
              transform: 'skewX(20deg)',
              opacity: 1
            }),
            style({
              transform: 'skewX(-5deg)',
              opacity: 1
            }),
            style({
              transform: 'none',
              opacity: 1
            })
          ])
        )
      ),
      transition(
        'active => removed',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              opacity: 1
            }),
            style({
              transform: 'translate3d(100%, 0, 0) skewX(30deg)',
              opacity: 0
            })
          ])
        )
      )
    ])
  ],
  preserveWhitespaces: false
})
// tslint:disable-next-line:component-class-suffix
export class WarningDemoEndToast extends Toast {
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    super(toastrService, toastPackage);
    iconRegistry.addSvgIcon(
      'demo-warning-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/BellDemoWarningWhite.svg')
    );
  }

  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }
}
