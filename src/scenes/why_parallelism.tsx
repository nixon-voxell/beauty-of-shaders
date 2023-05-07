import { COLOR } from "../styles"
import { outlineRects, outlineLayout, setup, focusOnOutlineIndex, outlineTitle } from "../utils/outline_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import { Circle } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  yield setup();

  view.add(outlineTitle);
  view.add(outlineLayout);

  yield* focusOnOutlineIndex(0, 0.0, 1.2);

  const transCircle: Circle = new Circle({
    size: view.size.x() * 2.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 20.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineRects[0].absolutePosition);

  yield* beginSlide("Transition to outline");

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Introduction to shaders'");

  yield* focusOnOutlineIndex(1, 0.6, 1.2);

});
