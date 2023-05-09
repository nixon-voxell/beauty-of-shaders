import { COLOR } from "../styles";
import { Layout, Rect } from "@motion-canvas/2d/lib/components";
import { Vector2 } from "@motion-canvas/core/lib/types";
import type { TimingFunction } from "@motion-canvas/core/lib/tweening";
import { map, tween } from "@motion-canvas/core/lib/tweening";

type SquareGridConfig = {
  size: number,
  gap: number,
  padding: number,
}

function createSquareGrid(gridConfig: SquareGridConfig, defaultColor: string, parent: Layout): Rect[][] {
  const gridWidth: number = parent.size.x() - gridConfig.padding;
  const rectWidth: number = gridWidth / gridConfig.size - gridConfig.gap;

  const rectRef: Rect = new Rect({
    size: rectWidth,
    radius: 10.0,
    fill: defaultColor,
    opacity: 0.0,
  });

  const rects: Rect[][] = new Array<Rect[]>(gridConfig.size);
  // initialize array in array
  for (var r = 0; r < gridConfig.size; r++) {
    rects[r] = new Array<Rect>(gridConfig.size);
  }

  for (var x = 0; x < gridConfig.size; x++) {
    for (var y = 0; y < gridConfig.size; y++) {
      var pos = new Vector2(x, y);
      pos = pos.mul(rectWidth + gridConfig.gap);
      pos = pos.sub((gridWidth - rectWidth - gridConfig.gap) * 0.5);

      const rect: Rect = rectRef.clone();

      rects[x][y] = rect;
      parent.add(rect);
      rect.position(pos);
    }
  }

  return rects;
}

function* animSquareGrid(
  gridConfig: SquareGridConfig, rects: Rect[][],
  startSize: number, endSize: number,
  startOpacity: number, endOpacity: number,
  duration: number, timingFunc: TimingFunction
) {
  yield* tween(
    duration, value => {
      const scaledValue = gridConfig.size * 2 * timingFunc(value);

      for (var x = 0; x < gridConfig.size; x++) {
        for (var y = 0; y < gridConfig.size; y++) {
          const rect: Rect = rects[x][y];

          // skip if animation reached
          if (rect.opacity() == endOpacity) {
            continue;
          }

          // constraint value to between 0.0 and 1.0
          const localValue = Math.min(Math.max(scaledValue - x - y, 0.0), 1.0);

          rect.size(map(startSize, endSize, localValue));
          rect.opacity(map(startOpacity, endOpacity, localValue));
        }
      }
    }
  );
}

export { SquareGridConfig, createSquareGrid, animSquareGrid }
