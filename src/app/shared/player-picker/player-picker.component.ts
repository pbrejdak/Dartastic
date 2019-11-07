import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, combineLatest, of } from 'rxjs';
import { User } from '../classes/models/user.model';
import { ApiService, ApiKey } from '../api.service';
import { startWith, filter, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-player-picker',
  templateUrl: './player-picker.component.html',
  styleUrls: ['./player-picker.component.scss']
})
export class PlayerPickerComponent implements OnInit, OnDestroy {

  constructor(
    private api: ApiService
  ) { }

  @Output()
  selectedPlayers: EventEmitter<User[]> = new EventEmitter<User[]>();

  playerSearchControl: FormControl = new FormControl();

  filteredPlayers$: Observable<User[]>;

  selectedPlayers$: ReplaySubject<User[]> = new ReplaySubject();

  selectedPlayersSet$ = this.selectedPlayers$.pipe(
    startWith([]),
    map((players: User[]) => new Set<string>(players.map(p => p.username)))
  );

  availableUsers$ = combineLatest(
    [this.api.getData(ApiKey.USER),
    this.selectedPlayersSet$]
  ).pipe(
    map(([users, selectedSet]: [User[], Set<string>]) => users.filter(u => !selectedSet.has(u.username)))
  );

  playerSearchDisplayFn = (player) => player.name;

  ngOnInit() {
    this.filteredPlayers$ = combineLatest(
      [this.playerSearchControl.valueChanges.pipe(startWith('')),
      this.availableUsers$]
    ).pipe(
      map(([searchValue, users]: [User | string, User[]]) => [typeof searchValue === 'string' ? searchValue : searchValue.name, users]),
      map(([searchValue, users]: [string, User[]]) => searchValue ? this.filterUsers(searchValue, users) : users.slice())
    );

    this.selectedPlayers$.subscribe(users => this.selectedPlayers.emit(users));
  }

  ngOnDestroy() {
    this.selectedPlayers$.complete();
  }

  private filterUsers(searchValue: string, users: User[]) {
    return users.filter(u => u.name.includes(searchValue) || u.surname.includes(searchValue) || u.username.includes(searchValue));
  }

  private async addPlayerToSelection(value: User) {
    const selected = await this.selectedPlayers$.toPromise();

    if (!selected.some(u => u.username === value.username)) {
      this.selectedPlayers$.next(selected.concat(value));
    }

    this.playerSearchControl.setValue('');
  }

  private async deletePlayerFromSelection(value: User) {
    const selected = await this.selectedPlayers$.toPromise();

    if (selected.some(u => u.username === value.username)) {
      const idx = selected.findIndex(u => u.username === value.username);
      selected.splice(idx, 1);
      this.selectedPlayers$.next(selected);
    }
  }

  playerOptionSelected(evt: MatAutocompleteSelectedEvent) {
    this.addPlayerToSelection(evt.option.value);
  }

  deletePlayer(player: User) {
    this.deletePlayerFromSelection(player)
  }
}
