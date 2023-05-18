import { COLOR } from "../styles"
import { ContentRect, ContentRectConfig, createMulContentRects, fadeMulContentRects, MultiContentRect, scaleMulContentRects } from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Line, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleCont: ContentRect = createTitleCont("0. Why do we need parallelism?", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "1. Basic mesh concepts");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);

  const size0: SimpleSignal<number> = createSignal(90.0);
  const points0: SimpleSignal<PossibleVector2<number>>[] = new Array(3);
  points0[0] = createSignal(() => new Vector2(-size0(), -size0()));
  points0[1] = createSignal(() => new Vector2(size0(), -size0()));
  points0[2] = createSignal(() => new Vector2(-size0(), size0()));

  const triangle0: Line = new Line({
    lineWidth: 4.0,
    points: points0,
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    end: 0.0,
  });

  view.add(triangle0);

  yield* beginSlide("Draw triangle");

  yield* sequence(
    0.1,
    triangle0.end(1.0, 0.6, easeInOutCubic),
    size0(100.0, 0.6, easeInOutCubic),
  );

  const triVerts: Circle[] = new Array<Circle>(3);
  const triVertTxts: Txt[] = new Array<Txt>(3);
  const vertexTxt: Txt = new Txt({
    position: (points0[0]() as Vector2).addY(-60.0),
    scale: 0.15,
    fill: COLOR.BLUE,
  });
  const faceTxt: Txt = new Txt({
    position: () => ((points0[0]() as Vector2).add(points0[1]() as Vector2).add(points0[2]() as Vector2)).mul(0.3333),
    scale: 0.1,
    fill: COLOR.BLACK,
  });

  for (var p = 0; p < points0.length; p++) {
    triVerts[p] = new Circle({
      position: points0[p],
      scale: 0.5,
      size: 60.0,
      fill: COLOR.BLUE,
      shadowColor: COLOR.BLACK,
      shadowBlur: 10.0,
      opacity: 0.0,
    });
    triVertTxts[p] = new Txt({
      position: points0[p],
      scale: 0.01,
      fill: COLOR.BLACK,
      text: `v${p}`,
      opacity: 0.0,
    })

    triangle0.add(triVerts[p]);
    triangle0.add(triVertTxts[p]);
  }
  triangle0.add(vertexTxt);
  triangle0.add(faceTxt);

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
    triangle0.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
    faceTxt.text("face", 0.6),
  );

  yield* beginSlide("Move v2");

  const v2Origin: Vector2 = points0[2]() as Vector2;

  yield* chain(
    points0[2](v2Origin.add(100.0), 0.6, easeInOutCubic),
    points0[2](v2Origin, 0.6, easeInOutCubic),
  );

  const size1: SimpleSignal<number> = createSignal(60.0);
  const offset: SimpleSignal<number> = createSignal(10.0);
  const points1: SimpleSignal<PossibleVector2<number>>[] = new Array(3);
  points1[0] = createSignal(() => new Vector2(size1(), size1()).add(offset()));
  points1[1] = createSignal(() => new Vector2(size1(), -size1()).add(offset()));
  points1[2] = createSignal(() => new Vector2(-size1(), size1()).add(offset()));
  const triangle1: Line = new Line({
    lineWidth: 4.0,
    points: points1,
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    zIndex: -1,
    end: 0.0,
  });

  const vert3: Circle = new Circle({
    scale: 0.5,
    size: 60.0,
    fill: COLOR.BLUE,
    position: points1[0],
    opacity: 0.0,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,

    children: [
      new Txt({
        scale: 0.1,
        fill: COLOR.BLACK,
        text: "v3",
      })
    ],
  });

  triangle1.add(vert3);
  view.add(triangle1);

  yield* beginSlide("Draw second triangle");

  yield* chain(
    triangle1.end(1.0, 0.6, easeInOutCubic),
    all(
      triangle1.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
      size1(100.0, 0.6, easeInOutCubic),
      offset(0.0, 0.6, easeInOutCubic),
    ),
    all(
      vert3.scale(1.0, 0.6, easeInOutCubic),
      vert3.opacity(1.0, 0.6, easeInOutCubic),
    )
  );

  const arrayConfig: ContentRectConfig = {
    size: Vector2.one.scale(60.0),
    radius: 0.0,
    gap: 0.0,
    fill: COLOR.WHITE_SHADOW,
    txtFill: COLOR.BLACK,
    txtScale: 0.12,
  };

  const vertArrayLayout: Layout = new Layout({
    y: 300.0,
  });
  const idxArrayLayout: Layout = new Layout({
    y: 400.0,
  });

  const vertArrayCont: MultiContentRect = createMulContentRects(
    ["v0", "v1", "v2", "v3"],
    arrayConfig, 0.0, vertArrayLayout, Vector2.right
  );
  const idxArrayCont: MultiContentRect = createMulContentRects(
    ["0", "1", "2", "2", "1", "3"],
    arrayConfig, 0.0, idxArrayLayout, Vector2.right
  );

  view.add(vertArrayLayout);
  view.add(idxArrayLayout);

  // alter content rect appearance
  for (var a = 0; a < vertArrayCont.rects.length; a++) {
    vertArrayCont.rects[a].stroke(COLOR.WHITE);
    vertArrayCont.rects[a].lineWidth(2.0);
    vertArrayCont.rects[a].scale(0.4);
  }

  for (var a = 0; a < idxArrayCont.rects.length; a++) {
    idxArrayCont.rects[a].stroke(COLOR.WHITE);
    idxArrayCont.rects[a].lineWidth(2.0);
    idxArrayCont.rects[a].scale(0.4);
  }

  // array label
  const vertArrayLbl: Txt = new Txt({
    x: -80.0,
    scale: 0.06,
    offset: new Vector2(1, 0),
    fill: COLOR.WHITE,
    text: "vertex array",
    opacity: 0.0,
  });
  const idxArrayLbl: Txt = new Txt({
    x: -80.0,
    scale: 0.06,
    offset: new Vector2(1, 0),
    fill: COLOR.WHITE,
    text: "index array",
    opacity: 0.0,
  });

  vertArrayLayout.add(vertArrayLbl);
  idxArrayLayout.add(idxArrayLbl);

  yield* beginSlide("Show vert & idx label");

  yield* sequence(
    0.1,
    all(
      vertArrayLbl.scale(0.15, 0.6, easeInOutCubic),
      vertArrayLbl.opacity(1.0, 0.6, easeInOutCubic),
    ),
    all(
      idxArrayLbl.scale(0.15, 0.6, easeInOutCubic),
      idxArrayLbl.opacity(1.0, 0.6, easeInOutCubic),
    ),
  );

  yield* beginSlide("Show vert & idx array");

  yield* chain(
    all(
      scaleMulContentRects(vertArrayCont, 1.0, 0.6, 0.1, easeInOutCubic),
      fadeMulContentRects(vertArrayCont, 1.0, 0.6, 0.1, easeInOutCubic),
    ),
    all(
      scaleMulContentRects(idxArrayCont, 1.0, 0.6, 0.1, easeInOutCubic),
      fadeMulContentRects(idxArrayCont, 1.0, 0.6, 0.1, easeInOutCubic),
    ),
  );

  yield* beginSlide("Highlight idx array #0");

  yield* sequence(
    0.1,
    ...idxArrayCont.rects.slice(0, 3).map((idx) =>
      idx.fill(COLOR.GREEN, 0.3, easeInOutCubic),
    ),
  );

  yield* beginSlide("Highlight vert array #0");

  yield* sequence(
    0.1,
    ...vertArrayCont.rects.slice(0, 3).map((vert) =>
      chain(
      vert.fill(COLOR.GREEN, 0.3, easeInOutCubic),
      )
    ),
  );

  yield* beginSlide("Highlight face #0");

  yield* triangle0.fill(COLOR.GREEN, 0.3, easeInOutCubic);

  yield* beginSlide("Highlight idx array #1");

  yield* chain(
    // fade out previously highlighted areas
    sequence(
      0.05,
      ...idxArrayCont.rects.map(idx => idx.fill(COLOR.WHITE_SHADOW, 0.3, easeInOutCubic)),
      ...vertArrayCont.rects.map(vert => vert.fill(COLOR.WHITE_SHADOW, 0.3, easeInOutCubic)),
      triangle0.fill(COLOR.WHITE_SHADOW, 0.3, easeInOutCubic),
    ),
    sequence(
      0.1,
      ...idxArrayCont.rects.slice(3).map((idx) =>
        idx.fill(COLOR.GREEN, 0.3, easeInOutCubic),
      ),
    )
  );

  yield* beginSlide("Highlight vert array #1");

  yield* sequence(
    0.1,
    ...vertArrayCont.rects.slice(1).map((vert) =>
      chain(
      vert.fill(COLOR.GREEN, 0.3, easeInOutCubic),
      )
    ),
  );

  yield* beginSlide("Highlight face #1");

  yield* triangle1.fill(COLOR.GREEN, 0.3, easeInOutCubic);

  yield* beginSlide("Fade out scene");

  yield* sequence(
    0.1,
    all(
      triangle0.opacity(0.0, 0.6, easeInOutCubic),
      triangle0.scale(0.8, 0.6, easeInOutCubic),
      triangle1.opacity(0.0, 0.6, easeInOutCubic),
      triangle1.scale(0.8, 0.6, easeInOutCubic),
    ),
    all(
      vertArrayLayout.opacity(0.0, 0.6, easeInOutCubic),
      vertArrayLayout.scale(0.8, 0.6, easeInOutCubic),
    ),
    all(
      idxArrayLayout.opacity(0.0, 0.6, easeInOutCubic),
      idxArrayLayout.scale(0.8, 0.6, easeInOutCubic),
    ),
  );
});
