import { COLOR } from "../styles"
import { outlineRects, outlineLayout, setup, focusOnOutlineIndex, outlineTitle } from "../utils/outline_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import {
  Txt, Circle
} from "@motion-canvas/2d/lib/components";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import { all, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  yield setup();

  view.add(outlineTitle);
  view.add(outlineLayout);

  for (let o = 0; o < outlineRects.length; o++) {
    outlineRects[o].scale(0.6);
    outlineRects[o].opacity(0.0);
  }

  yield* beginSlide("Outline")

  yield* all(
    sequence(
      0.1,
      ...outlineRects.map((content) =>
        all(
          content.scale(1.0, 0.6, easeInOutCubic),
          content.opacity(1.0, 0.6, easeInOutCubic),
        )
      ),
    ),
  );

  yield* beginSlide("Walk you through each section");

  for (var o = 0; o < outlineRects.length; o++) {
    yield* focusOnOutlineIndex(o, 0.6, 1.2);
  }

  yield* beginSlide("Focus on 'What are Shaders Anyway?'");

  yield* focusOnOutlineIndex(0, 0.4, 1.2);

  const transCircle: Circle = new Circle({
    size: 0.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    lineWidth: 1.0,
  });

  transCircle.absolutePosition(outlineRects[0].absolutePosition);

  view.add(transCircle);

  yield* beginSlide("What is a Shader?");

  yield* all(
    transCircle.size(view.size.x() * 2.0, 1.0, easeInOutCubic),
    transCircle.lineWidth(10.0, 1.0),
  )
});
