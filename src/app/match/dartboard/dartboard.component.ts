import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { fromEvent, Subscription, ReplaySubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { OnChanges } from '../../shared/classes/decorators/on-changes.decorator';
import { segmentToPoints } from '../classes/helpers';
import { Throw } from '../classes/models/throw.model';

const SEGMENT_REGEX = /((s|d|t){1}\d{1,2})|(Outer|Bull)/;

const SEGMENT_COLOR_MAP = new Map([
  ['singleEven', 'rgb(0,0,0)'],
  ['singleOdd', 'rgb(247, 233, 205)'],
  ['doubleEven', 'rgb(237, 55, 55)'],
  ['doubleOdd', 'rgb(79, 153, 98)'],
  ['tripleEven', 'rgb(237, 55, 55)'],
  ['tripleOdd', 'rgb(79, 153, 98)'],
  ['Outer', 'rgb(79, 153, 98)'],
  ['Bull', 'rgb(79, 153, 98)']
]);

const SELECTION_RGB = '185,57,211';

type SegmentId = string;

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DartboardComponent implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}

  private subs = new Subscription();

  private selectedSegmentMap: Map<SegmentId, number> = new Map<SegmentId, number>();
  private selectedSegments: string[] = [];

  selectedSegments$: ReplaySubject<string[]> = new ReplaySubject<string[]>();

  @ViewChild('dartboard', { static: true }) dartboardRef: ElementRef<SVGElement>;

  @OnChanges(function() {
    console.log('change');
    this.updateDimensions();
  })
  @Input()
  width: string = '500px';

  @OnChanges(function() {
    console.log('change');
    this.updateDimensions();
  })
  @Input()
  height: string = '500px';

  @Input()
  throws: number = 3;

  @Output() segmentSelected: EventEmitter<Throw[]> = new EventEmitter<Throw[]>();

  get dartboardElement(): SVGElement {
    return this.dartboardRef.nativeElement;
  }

  get canAccept(): boolean {
    return this.selectedSegments && this.selectedSegments.length === 3;
  }

  ngOnInit() {
    const boardClick = fromEvent<MouseEvent>(this.dartboardElement, 'click');

    this.subs.add(
      boardClick
        .pipe(
          filter(() => this.selectedSegments.length < this.throws),
          map(event => event.target as SVGPathElement),
          filter(segment => SEGMENT_REGEX.test(segment.id)),
          tap(segment => this.selectedSegments.push(segment.id)),
          tap(segment => this.selectSegment(segment))
          // tap(() => this.emitSelected())
          // tap(() => this.cdr.markForCheck())
        )
        .subscribe()
    );

    // get all path elements and bull to bind for hover action
    const paths: HTMLElement[] = Array.from(
      this.dartboardElement.querySelectorAll<HTMLElement>('#areas g path')
    ).concat(this.dartboardElement.querySelector<HTMLElement>('#areas g #Bull'));

    const setCSS = (element: HTMLElement, props: { [key: string]: any }) =>
      Object.keys(props).forEach(key => (element.style[key] = props[key]));

    for (const path of paths) {
      const mouseEnter$ = fromEvent(path, 'mouseenter');
      const mouseOut$ = fromEvent(path, 'mouseleave');
      this.subs.add(mouseEnter$.subscribe(() => setCSS(path, { opacity: 0.4, cursor: 'pointer' })));
      this.subs.add(mouseOut$.subscribe(() => setCSS(path, { opacity: 1, cursor: 'normal' })));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private selectSegment(segment: SVGPathElement) {
    const segmentId = segment.id;
    console.info(segmentId);

    if (!this.selectedSegmentMap.has(segmentId)) {
      this.selectedSegmentMap.set(segmentId, 0);
    }

    let selectedTimes = this.selectedSegmentMap.get(segmentId);
    this.selectedSegmentMap.set(segmentId, ++selectedTimes);

    const opacity = selectedTimes * 0.3;
    segment.style.fill = `rgba(${SELECTION_RGB}, ${opacity.toString()})`;

    this.selectedSegments$.next(this.selectedSegments);
  }

  private emitSelected() {
    const throws = this.selectedSegments.map(segmentToPoints);
    this.segmentSelected.emit(throws);
    this.reset();
  }

  private updateDimensions() {
    if (!this.dartboardRef) return;

    (this.dartboardElement as SVGElement).setAttribute('width', this.width);
    (this.dartboardElement as SVGElement).setAttribute('height', this.height);
  }

  reset() {
    const getSegmentColor = (segmentId: string) => {
      if (segmentId === 'Outer') return SEGMENT_COLOR_MAP.get('Outer');
      if (segmentId === 'Bull') return SEGMENT_COLOR_MAP.get('Bull');

      const isEven = parseInt(segmentId.substr(1)) % 2 === 0 ? 'Even' : 'Odd';
      const id = segmentId.substr(0, 1);
      switch (id) {
        case 'd':
          return SEGMENT_COLOR_MAP.get(`double${isEven}`);
        case 's':
          return SEGMENT_COLOR_MAP.get(`single${isEven}`);
        case 't':
          return SEGMENT_COLOR_MAP.get(`triple${isEven}`);
      }
    };
    this.selectedSegmentMap.forEach((times, segmentId) => {
      const path = this.dartboardElement.querySelector<SVGPathElement>(`#${segmentId}`);
      path.style.fill = getSegmentColor(segmentId);
    });

    this.selectedSegmentMap.clear();
    this.selectedSegments = [];
    this.selectedSegments$.next([]);
  }

  resetThrows() {
    this.reset();
  }

  removeLastThrow() {
    const throws = [...this.selectedSegments];
    throws.pop();

    this.reset();
    throws.forEach(t => {
      this.selectedSegments.push(t);
      this.selectSegment(this.dartboardElement.querySelector(`#${t}`));
    });
  }

  acceptThrows() {
    if (this.selectedSegments.length === 3) {
      this.emitSelected();
    }
  }
}
