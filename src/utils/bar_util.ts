import { Layout, Rect } from "@motion-canvas/2d/lib/components";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { Random } from "@motion-canvas/core/lib/scenes";
import { TimingFunction } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

type BarConfig = {
  count: number,
  gap: number,
  height: number,
  minLength: number,
  maxLength: number,
};

type BarGroup = {
  rects: Rect[],
  lengths: number[],
};

function createBarGroup(
  config: BarConfig, initialColor: string,
  random: Random,
  parent: Layout
): BarGroup {
  const barGroup: BarGroup = {
    rects: new Array<Rect>(config.count),
    lengths: random.floatArray(config.count, config.minLength, config.maxLength),
  };

  for (var c = 0; c < config.count; c++) {
    const bar: Rect = new Rect({
      y: (config.gap + config.height) * c,
      size: new Vector2(0.0, config.height),
      offset: new Vector2(-1, 0),
      fill: initialColor,
    });

    barGroup.rects[c] = bar;
    parent.add(bar);
  }

  return barGroup;
}

function* animateBarGroup(
  barGroup: BarGroup, seqDelay: number, duration: number,
  timingFunc: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...barGroup.rects.map((bar, index) =>
      all(
        bar.size.x(barGroup.lengths[index], duration, timingFunc),
      )
    ),
  );
}

export { BarConfig, BarGroup, createBarGroup, animateBarGroup, };
