import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchEvent } from '../classes/models/match-event.model';

@Component({
  selector: 'app-match-event-dialog',
  templateUrl: './match-event-dialog.component.html',
  styleUrls: ['./match-event-dialog.component.scss']
})
export class MatchEventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MatchEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatchEvent
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
