import { COLOR } from "../styles"
import {
  ContentRectConfig, ContentRect, createContentRect,
  scaleContentRect, fadeContentRect, moveContentRect
} from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleCont: ContentRect = createTitleCont("1. Coordinate systems", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "2. Basic mesh concepts");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);

  const size: SimpleSignal<number> = createSignal(90.0);
  const points: SimpleSignal<PossibleVector2<number>>[] = new Array(3);
  points[0] = createSignal(() => new Vector2(-size(), -size()));
  points[1] = createSignal(() => new Vector2(size(), -size()));
  points[2] = createSignal(() => new Vector2(-size(), size()));

  const triangle: Line = new Line({
    lineWidth: 4.0,
    points: points,
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    end: 0.0,
  });

  view.add(triangle);

  yield* beginSlide("Show triangle");

  yield* sequence(
    0.1,
    triangle.end(1.0, 0.6, easeInOutCubic),
    size(100.0, 0.6, easeInOutCubic),
  );

  const triVerts: Circle[] = new Array<Circle>(3);
  const triVertTxts: Txt[] = new Array<Txt>(3);
  const vertexTxt: Txt = new Txt({
    position: (points[0]() as Vector2).addY(-60.0),
    scale: 0.1,
    fill: COLOR.BLUE,
  });
  const faceTxt: Txt = new Txt({
    position: -34.0,
    scale: 0.1,
    fill: COLOR.BLACK,
  });

  for (var p = 0; p < points.length; p++) {
    triVerts[p] = new Circle({
      position: points[p],
      scale: 0.5,
      size: 60.0,
      fill: COLOR.BLUE,
      shadowColor: COLOR.BLACK,
      shadowBlur: 10.0,
      opacity: 0.0,
    });
    triVertTxts[p] = new Txt({
      position: points[p],
      scale: 0.01,
      fill: COLOR.BLACK,
      text: `v${p}`,
      opacity: 0.0,
    })

    triangle.add(triVerts[p]);
    triangle.add(triVertTxts[p]);
  }
  triangle.add(vertexTxt);
  triangle.add(faceTxt);

  yield* beginSlide("Show vertices");

  yield* sequence(
    0.1,
    ...triVerts.map((vert) =>
      all(
        vert.scale(1.0, 0.6, easeInOutCubic),
        vert.opacity(1.0, 0.6, easeInOutCubic),
      )
    ),
    ...triVertTxts.map((vertTxt) =>
      all(
        vertTxt.scale(0.1, 0.4, easeInOutCubic),
        vertTxt.opacity(1.0, 0.4, easeInOutCubic),
      )
    ),
    vertexTxt.text("vertex", 0.6),
  );

  yield* beginSlide("Show face");

  yield* sequence(
    0.1,
    triangle.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
    faceTxt.text("face", 0.6),
  );

  yield* beginSlide("Move v2");

  const v2Origin: Vector2 = points[2]() as Vector2;

  yield* chain(
    points[2](v2Origin.add(100.0), 0.6, easeInOutCubic),
    points[2](v2Origin, 0.6, easeInOutCubic),
  );
});
