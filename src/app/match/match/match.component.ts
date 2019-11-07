import { Component, OnInit, Input } from '@angular/core';
import { MatchService } from '../match.service';
import { Throw } from '../classes/models/throw.model';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.sass']
})
export class MatchComponent implements OnInit {

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
  }

  onSegmentsSelected(segments: Throw[]) {
    this.matchService.applyThrows(segments);
  }

}
