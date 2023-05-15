import { COLOR } from "../styles"
import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import { Circle } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuint } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const outlineCont: OutlineContent = setup();

  view.add(outlineCont.outlineTitle);
  view.add(outlineCont.outlineLayout);

  for (let o = 0; o < outlineCont.outlineRects.length; o++) {
    outlineCont.outlineRects[o].scale(0.6);
    outlineCont.outlineRects[o].opacity(0.0);
  }

  yield* beginSlide("Outline")

  yield* all(
    sequence(
      0.1,
      ...outlineCont.outlineRects.map((content) =>
        all(
          content.scale(1.0, 0.6, easeInOutCubic),
          content.opacity(1.0, 0.6, easeInOutCubic),
        )
      ),
    ),
  );

  yield* beginSlide("Walk you through each section");

  for (var o = 0; o < outlineCont.outlineRects.length; o++) {
    yield* focusOnOutlineIndex(outlineCont, o, 0.4, 1.2);
  }

  yield* beginSlide("Focus on 'What are Shaders Anyway?'");

  yield* focusOnOutlineIndex(outlineCont, 0, 0.6, 1.2);

  const transCircle: Circle = new Circle({
    size: 0.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 2.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineCont.outlineRects[0].absolutePosition);

  yield* beginSlide("Circle zoom in transition");

  yield* all(
    transCircle.size(view.size.x() * 2.0, 2.0, easeInOutQuint),
    transCircle.lineWidth(20.0, 2.0, easeInOutQuint),
  )
});
