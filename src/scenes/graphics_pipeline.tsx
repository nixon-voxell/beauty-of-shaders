import { COLOR } from "../styles"
import { ContentRect, ContentRectConfig, createMulContentRects, createMulEmptyContentRects, fadeMulContentRects, MultiContentRect, scaleMulContentRects } from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Line, Ray, Rect, Txt } from "@motion-canvas/2d/lib/components";
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
  const points0: SimpleSignal<PossibleVector2<number>>[] = new Array(4);
  points0[0] = createSignal(() => new Vector2(-size0(), -size0()));
  points0[1] = createSignal(() => new Vector2(size0(), -size0()));
  points0[2] = createSignal(() => new Vector2(-size0(), size0()));
  // points0[3] = createSignal(() => new Vector2(size0(), size0()));

  const triangle0: Line = new Line({
    // lineJoin: "bevel",
    lineWidth: 4.0,
    points: points0.slice(0, 3),
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    end: 0.0,
  });
  // const triangle1: Line = new Line({
  //   lineJoin: "bevel",
  //   lineWidth: 4.0,
  //   points: points0.slice(1, 4),
  //   closed: true,
  //   stroke: COLOR.WHITE,
  //   fill: COLOR.TRANSPARENT,
  //   end: 0.0,
  // });

  const layoutQuad: Layout = new Layout({});
  layoutQuad.add(triangle0);
  // layoutQuad.add(triangle1);
  view.add(layoutQuad);

  yield* beginSlide("Draw quad");

  yield* sequence(
    0.1,
    triangle0.end(1.0, 0.6, easeInOutCubic),
    // triangle1.end(1.0, 0.6, easeInOutCubic),
    triangle0.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
    // triangle1.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
    size0(100.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Move quad to left");

  yield* layoutQuad.position.x(-600.0, 0.6, easeInOutCubic);

  const ray0: Ray = new Ray({
    x: -440.0,
    lineWidth: 10.0,
    toX: 80.0,
    endArrow: true,
    stroke: COLOR.WHITE,
    end: 0.0,
  })

  view.add(ray0);

  // TODO: create grid & animate half of it

  yield* beginSlide("Rasterize triangle");

  yield* chain(
    ray0.end(1.0, 0.6, easeInOutCubic),
  );
});
