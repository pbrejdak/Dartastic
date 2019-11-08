import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, combineLatest, of, BehaviorSubject } from 'rxjs';
import { User } from '../../shared/classes/models/user.model';
import { startWith, map, take } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { OnChanges } from 'src/app/shared/classes/decorators/on-changes.decorator';

@Component({
  selector: 'app-player-picker',
  templateUrl: './player-picker.component.html',
  styleUrls: ['./player-picker.component.scss']
})
export class PlayerPickerComponent implements OnInit, OnDestroy {
  constructor() {}

  @ViewChild(MatAutocompleteTrigger, { static: true }) autocompleteTrigger: MatAutocompleteTrigger;

  playerSearchControl: FormControl = new FormControl();

  filteredPlayers$: Observable<User[]>;
  selectedPlayers$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  users$: ReplaySubject<User[]> = new ReplaySubject();

  selectedPlayersSet$ = this.selectedPlayers$.pipe(
    startWith([]),
    map((players: User[]) => new Set<string>(players.map(p => p.username)))
  );

  availableUsers$ = combineLatest([this.users$, this.selectedPlayersSet$]).pipe(
    map(([users, selectedSet]: [User[], Set<string>]) => users.filter(u => !selectedSet.has(u.username)))
  );

  @OnChanges<User[]>(function(users) {
    this.users$.next(users);
  })
  @Input()
  users: User[] = [];

  @Output()
  selectedPlayers: EventEmitter<User[]> = new EventEmitter<User[]>();

  ngOnInit() {
    this.filteredPlayers$ = combineLatest([
      this.playerSearchControl.valueChanges.pipe(startWith('')),
      this.availableUsers$
    ]).pipe(
      map(([searchValue, users]: [User | string, User[]]) => [
        typeof searchValue === 'string' ? searchValue : searchValue.name,
        users
      ]),
      map(([searchValue, users]: [string, User[]]) =>
        searchValue ? this.filterUsers(searchValue, users) : users.slice()
      )
    );

    this.selectedPlayers$.subscribe(users => this.selectedPlayers.emit(users));
  }

  ngOnDestroy() {
    this.selectedPlayers$.complete();
  }

  private filterUsers(searchValue: string, users: User[]) {
    return users.filter(
      u => u.name.includes(searchValue) || u.surname.includes(searchValue) || u.username.includes(searchValue)
    );
  }

  private async addPlayerToSelection(value: User) {
    this.selectedPlayers$.pipe(take(1)).subscribe(selected => {
      if (!selected.some(u => u.username === value.username)) {
        this.selectedPlayers$.next(selected.concat(value));
      }

      this.playerSearchControl.setValue('');

      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      });
    });
  }

  private async deletePlayerFromSelection(value: User) {
    this.selectedPlayers$.pipe(take(1)).subscribe(selected => {
      if (selected.some(u => u.username === value.username)) {
        const idx = selected.findIndex(u => u.username === value.username);
        selected.splice(idx, 1);
        this.selectedPlayers$.next(selected);
      }
    });
  }

  playerOptionSelected(evt: MatAutocompleteSelectedEvent) {
    this.addPlayerToSelection(evt.option.value);
  }

  deletePlayer(player: User) {
    this.deletePlayerFromSelection(player);
  }

  playerSearchDisplayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }
}
