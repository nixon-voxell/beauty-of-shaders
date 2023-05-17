import { COLOR } from "../styles"
import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";
import {
  ContentRectConfig, MultiContentRect,
  createMulContentRects,
  moveMulContentRects, fadeMulContentRects,
  focusIdxMulContentRects, scaleMulContentRects,
  ContentRect, createContentRect, scaleContentRect, fadeContentRect
} from "../utils/rect_util";
import { animateDistanceLine, createDistanceLine } from "../utils/arrow_util";
import { animSquareGrid, createSquareGrid, SquareGridConfig } from "../utils/grid_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { CodeBlock, edit, insert } from '@motion-canvas/2d/lib/components/CodeBlock';
import { Circle, Layout, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, delay, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuint, easeInOutSine, TimingFunction, tween } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { cancel, ThreadGenerator } from "@motion-canvas/core/lib/threading";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const outlineCont: OutlineContent = setup();

  view.add(outlineCont.outlineTitle);
  view.add(outlineCont.outlineLayout);

  yield* focusOnOutlineIndex(outlineCont, 1, 0.0, 1.2);

  const transCircle: Circle = new Circle({
    size: view.size.x() * 2.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 20.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineCont.outlineRects[1].absolutePosition());

  // yield* beginSlide("Transition to outline");

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Writing your first shader!'");

  yield* focusOnOutlineIndex(outlineCont, 2, 0.6, 1.2);
});
