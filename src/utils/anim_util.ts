import { Rect } from "@motion-canvas/2d/lib/components";
import { all } from "@motion-canvas/core/lib/flow";
import type { TimingFunction } from "@motion-canvas/core/lib/tweening";

function* rectScaleReview(rect: Rect, duration: number, initScaleSize: number, timingFunc?: TimingFunction) {
  const rectSize = rect.size();

  rect.size(rect.size().mul(initScaleSize));
  rect.opacity(0.0);
  yield* all (
    rect.size(rectSize, duration, timingFunc),
    rect.opacity(1.0, duration, timingFunc),
  );
}

export { rectScaleReview };
