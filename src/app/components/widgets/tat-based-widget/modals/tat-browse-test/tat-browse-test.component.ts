import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Test } from 'src/app/models/test.model';
import { LabService } from 'src/app/services/lab/lab.service';
import { SuperGroup } from './supergroup.model';
import { Group } from './group.model';

@Component({
  selector: 'app-tat-browse-test',
  templateUrl: './tat-browse-test.component.html',
  styleUrls: ['./tat-browse-test.component.scss']
})
export class TatBrowseTestComponent implements OnInit {

  @ViewChild('groups', { static: true }) matButtonToggleGroup: MatButtonToggleGroup;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelectTest = new EventEmitter<any>();
  @Input() selectedTestRecover: Array<string>;
  selectedTest:  Array<string> = [];
  tests: Test[] = [];
  shownTest: Test[] = [];
  shownGroups: Array<Group> = [];
  selectedSupergroup: SuperGroup;
  supergroups: Array<SuperGroup> = [{
    groupId: 'allLab',
    testGroupName: 'all-test'
  }];
  groups = [];
  searchText: string;
  selectAllButtonEnabled = true;
  clearAllButtonEnabled = true;
  constructor(private labService: LabService) { }

  ngOnInit() {
    this.labService.getAllTests().subscribe((tests: Test[]) => {
      this.tests = tests;
      this.labService.getSuperGroups().subscribe((data: Array<SuperGroup>) => {
        if (data) {
          this.supergroups.push(...data);
          this.selectedSupergroup = this.supergroups[0];
          this.shownTest = this.tests;
          if (this.selectedTestRecover.length === 0) {
            this.selectAll(true);
          } else {
            this.tests.forEach((test: Test) => {
              const index = this.selectedTestRecover.indexOf(test.testId);
              if (index !== -1) {
                this.selectedTest.push(test.testId);
                test.selected = true;
              } else {
                test.selected = false;
              }
            });
          }
        }
        this.emitChange();
        this.toggleSelectClearButtons()
      });
    });

  }
  selectionTestChanged(event, test: Test) {
    if (this.selectedTest.indexOf(event.value) === -1) {
      test.selected = true;
      this.selectedTest.push(event.value);
    } else {
      if (event.source.checked === false) {
        test.selected = false;
        this.selectedTest.splice(this.selectedTest.indexOf(event.value), 1);
      }
    }
    this.emitChange();
    this.toggleSelectClearButtons();
  }
  selectionGroupChanged(groupId: number) {
    this.shownTest = [];
    this.labService.getTestsOfGroup(groupId).subscribe((data: Array<Test>) => {
        data.forEach((test: Test) => {
          const index = this.selectedTest.indexOf(test.testId);
          this.shownTest.push(test);
          if (index !== -1) {
            test.selected = true;
          } else {
            test.selected = false;
          }
        });
      this.toggleSelectClearButtons();
    });
  }
  selectionSupergroupChanged(index: number) {
    this.shownGroups = [];
    this.selectedSupergroup = this.supergroups[index];
    if (this.supergroups[index].groupId === 'allLab') {
      setTimeout(() => {
        this.shownTest = this.tests;
        this.shownTest.forEach((test: Test) => {
          const indexOfSelectedTest = this.selectedTest.indexOf(test.testId);
          if (indexOfSelectedTest !== -1) {
            test.selected = true;
          } else {
            test.selected = false;
          }
        });
        this.toggleSelectClearButtons();
      }, 400);
      return;
    } else {
      this.labService.getGroupsOfSupergroups(this.supergroups[index].groupId).subscribe((groups:Array<Group> ) => {
        this.shownGroups = groups;
      });
    }
    this.shownTest = [];
    this.toggleSelectClearButtons();
  }

  selectAll(status: boolean) {
    this.shownTest.forEach(test => {
      test.selected = status;
      const indexOfTest = this.selectedTest.indexOf(test.testId);
      if (status === true && indexOfTest === -1) {
        this.selectedTest.push(test.testId);
      } else if (status === false) {
        this.selectedTest.splice(indexOfTest, 1);
      }
    });
    this.emitChange();
    this.toggleSelectClearButtons();
  }

  toggleSelectClearButtons() {
    const selectedTestShownLength = this.shownTest.filter(test => test.selected === true).length;
    if (selectedTestShownLength === this.shownTest.length) {
      this.selectAllButtonEnabled = false;
      this.clearAllButtonEnabled = true;
    } else if (selectedTestShownLength === 0) {
      this.selectAllButtonEnabled = true;
      this.clearAllButtonEnabled = false;
    } else {
      this.selectAllButtonEnabled = true;
      this.clearAllButtonEnabled = true;
    }
  }

  applyTestFilter(testToFilter: string) {
    this.shownTest.filter(test =>
      test.name.toLowerCase().includes(testToFilter.toLowerCase()));
  }

  emitChange() {
    this.onSelectTest.emit(this.selectedTest);
  }
}
