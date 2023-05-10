import { Line } from "@motion-canvas/2d/lib/components";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import type { TimingFunction } from "@motion-canvas/core/lib/tweening";
import { map, tween } from "@motion-canvas/core/lib/tweening";
import { SignalValue } from "@motion-canvas/core/lib/signals";
import { all, delay } from "@motion-canvas/core/lib/flow";

function createDistanceLine(
  position: SignalValue<PossibleVector2<number>>, stroke: string, points: SignalValue<PossibleVector2<number>>[],
  lineWidth: number = 10.0, start: number = 0.5, end: number = 0.5,
  arrowSize: number = 0.0, startArrow: boolean = true, endArrow: boolean = true
): Line {
  return new Line({
    position,
    lineWidth,
    points,
    stroke,
    startArrow,
    endArrow,
    arrowSize,
    start,
    end,
  });
}

function* animateDistanceLine(
  line: Line, duration: number, timingFunc?: TimingFunction,
  start: number = 1.0, end: number = 0.0,
  arrowSize: number = 20.0,
  lineDelay: number = 0.0, arrowDelay: number = 0.1
) {
  yield* all(
    delay(
      lineDelay,
      all(
        line.start(start, duration, timingFunc),
        line.end(end, duration, timingFunc),
      )
    ),
    delay(
      arrowDelay,
      all(
        line.arrowSize(arrowSize, duration, timingFunc),
      )
    ),
  );
}

export {
  createDistanceLine, animateDistanceLine
}
