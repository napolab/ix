import { defer, first, from, toArray } from 'ix/iterable';
import { innerJoin, takeWhile, tap } from 'ix/iterable/operators';

const lapsedDays = toArray(from([
  { fN: 2, lapsedDays: 30, diff: 30 },
  { fN: 3, lapsedDays: 120, diff: 90 },
  { fN: 4, lapsedDays: 210, diff: 90 },
  { fN: 5, lapsedDays: 300, diff: 90 },
  { fN: 6, lapsedDays: 390, diff: 90 },
]));

function* source() {
  let fN = 4;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const next = { fN: ++fN, survivalRate: Math.random() };
    yield next;
  }
}

const iterableX = defer(source);
console.log(first(iterableX));

console.log(
  toArray(
    iterableX.pipe(
      tap(console.log),
      takeWhile(({ fN }, idx) =>  {
        console.log(idx, fN, Math.max(...lapsedDays.map((x) => x.fN)));

        return !(idx === 0 && fN > Math.max(...lapsedDays.map((x) => x.fN)));
      }),
      innerJoin(

        from(lapsedDays),
        (o) => o.fN,
        (i) => i.fN,
        (o, i) => ({ ...i, ...o }),
      ),
      takeWhile((x) => x.lapsedDays <= 360),
    ),
  ),
);
