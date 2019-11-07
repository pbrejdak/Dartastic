import { Component, OnInit, Input, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { ReplaySubject, Observable, combineLatest } from 'rxjs';
import { OnChanges } from '../classes/decorators/on-changes.decorator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gravatar-img',
  templateUrl: './gravatar-img.component.html',
  styleUrls: ['./gravatar-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GravatarImgComponent implements OnInit {

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  @OnChanges(function (hash: string) {
    this.hashSource.next(hash);
  })
  @Input() hash: string;

  @Input() adjustSize = false;

  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

  private hashSource: ReplaySubject<string> = new ReplaySubject();
  private sizeReady: ReplaySubject<void> = new ReplaySubject();

  hash$ = combineLatest(
    this.hashSource,
    this.sizeReady
  ).pipe(
    map(([hash, _]) => hash ? this.adjustSize ? `${hash}?s=${this.getSize()}` : hash : null)
  );

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.sizeReady.next();
  }

  private getSize() {
    if (!this.container.nativeElement.clientHeight) {
      return this.container.nativeElement.clientWidth;
    } else if (!this.container.nativeElement.clientWidth) {
      return !this.container.nativeElement.clientHeight;
    }

    return Math.max(this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight);
  }

}
