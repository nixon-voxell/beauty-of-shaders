import { COLOR } from "../styles"
import { ContentRect, ContentRectConfig, createMulContentRects, createMulEmptyContentRects, fadeMulContentRects, MultiContentRect, scaleMulContentRects } from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleCont: ContentRect = createTitleCont("2. Basic mesh concepts", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "3. Graphics pipeline");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);

  const size0: SimpleSignal<number> = createSignal(90.0);
  const points0: SimpleSignal<PossibleVector2<number>>[] = new Array(3);
  points0[0] = createSignal(() => new Vector2(-size0(), -size0()));
  points0[1] = createSignal(() => new Vector2(size0(), -size0()));
  points0[2] = createSignal(() => new Vector2(-size0(), size0()));

  const triangle: Line = new Line({
    lineWidth: 4.0,
    points: points0,
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    end: 0.0,
  });

  view.add(triangle);

  yield* beginSlide("Draw triangle");

  yield* sequence(
    0.1,
    triangle.end(1.0, 0.6, easeInOutCubic),
    size0(100.0, 0.6, easeInOutCubic),
    triangle.fill(COLOR.WHITE, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Move triangle to left");

  yield* triangle.position.x(-600.0, 0.6, easeInOutCubic);
});
