import { COLOR } from "../styles"
import {
  ContentRectConfig, ContentRect, createContentRect,
  scaleContentRect, fadeContentRect, moveContentRect
} from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Grid, Line, Ray, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuart, tween} from "@motion-canvas/core/lib/tweening";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { CodeBlock, edit, insert, remove } from "@motion-canvas/2d/lib/components/CodeBlock";
import { createSignal, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleCont: ContentRect = createTitleCont("0. Why do we need parallelism?", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "1. Coordinate systems");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);

  const grid: Grid = new Grid({
    width: 2560,
    height: 2560,
    scale: 0.8,
    zIndex: -1,
    spacing: 100.0,
    stroke: "#444",
    lineWidth: 1.0,
    opacity: 0.0,
  });
  const centerPoint: Circle = new Circle({
    size: 40.0,
    scale: 0.0,
    fill: COLOR.BLUE,
    opacity: 0.0,
  });
  const centerPointTxt: Txt = new Txt({
    y: -40.0,
    scale: 0.1,
    offset: new Vector2(-1, 0),
    fill: COLOR.WHITE,
  });

  view.add(grid);
  grid.add(centerPoint);
  centerPoint.add(centerPointTxt);

  yield* beginSlide("World origin");

  yield* all(
    grid.scale(1.0, 0.6, easeInOutQuart),
    grid.opacity(1.0, 0.6, easeInOutQuart),
  );

  yield* beginSlide("Show center point");

  yield* sequence(
    0.3,
    all(
      centerPoint.opacity(1.0, 0.6, easeInOutCubic),
      centerPoint.scale(1.0, 0.6, easeInOutCubic),
    ),
    all(
      centerPointTxt.text("world origin", 0.6),
    )
  );

  yield* beginSlide("Move world around #0");

  yield* grid.position(new Vector2(300.0, 100.0), 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic);
  yield* grid.rotation(-20.0, 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic);

  const squareConfig: ContentRectConfig = {
    size: Vector2.one.scale(200.0),
    gap: 0.0,
    radius: 0.0,
    fill: COLOR.WHITE,
    txtFill: COLOR.BLUE,
    txtScale: 0.1,
  }

  const square: ContentRect = createContentRect("", 0.0, squareConfig, 0.0, grid);
  yield* scaleContentRect(square, 0.8, 0.0);

  square.txt.text(() => `[${square.rect.position.x().toFixed()}, ${(-square.rect.position.y()).toFixed()}]`);
  square.txt.position.y(-140.0);

  yield* beginSlide("Show square");

  yield* all(
    scaleContentRect(square, 1.0, 0.6, easeInOutCubic),
    fadeContentRect(square, 1.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Move square around");

  var squareOriginPos: Vector2;

  yield* chain(
    moveContentRect(square, new Vector2(300.0, 300.0), 1.0, easeInOutCubic),
    () => {squareOriginPos = square.rect.position()},

    waitFor(0.4),
    tween(
      2.0, value => {
        value = easeInOutCubic(value);
        square.rect.position(Vector2.arcLerp(squareOriginPos, new Vector2(0.0, -240.0), value, true));
      }
    ),

    waitFor(0.4),
    moveContentRect(square, new Vector2(-200.0, 100.0), 1.2, easeInOutCubic),

    waitFor(0.4),
    moveContentRect(square, new Vector2(-400.0, 340.0), 1.5, easeInOutCubic),
  );

  yield* beginSlide("Move world around #1");

  yield* all(
    grid.position(new Vector2(100.0, -200.0), 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
    grid.rotation(20.0, 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
  );

  const squareCenterPoint: Circle = new Circle({
    scale: 0.8,
    size: 40.0,
    fill: COLOR.RED,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,
    opacity: 0.0,
  });
  const worldSpaceArrowTo: SimpleSignal<PossibleVector2<number>> = createSignal(() => square.rect.position());
  const worldSpaceArrow: Ray = new Ray({
    from: () => centerPoint.position(),
    to: worldSpaceArrowTo,
    lineWidth: 10.0,
    stroke: COLOR.BLUE,
    arrowSize: 0.0,
    endArrow: true,
    start: 0.0,
    end: 0.0,
  });

  square.rect.add(squareCenterPoint);
  grid.add(worldSpaceArrow);

  yield* beginSlide("Show square center point");

  yield* all(
    squareCenterPoint.opacity(1.0, 0.6, easeInOutCubic),
    squareCenterPoint.scale(1.0, 0.6, easeInOutCubic),
  );

  yield* sequence(
    0.1,
    worldSpaceArrow.end(1.0, 0.6, easeInOutCubic),
    worldSpaceArrow.arrowSize(20.0, 0.6, easeInOutCubic),
  );

  const squarePoints: Circle[] = new Array<Circle>(4);
  const squarePointTxts: Txt[] = new Array<Txt>(4);
  const squarePointArrows: Ray[] = new Array<Ray>(4);

  var pointIdx: number = 0;

  for (var x = 0 ; x < 2; x++) {
    for (var y = 0; y < 2; y++) {
      const squarePoint: Circle = new Circle({
        position: new Vector2(
          -square.rect.size.x() * 0.5 + square.rect.size.x() * x,
          -square.rect.size.y() * 0.5 + square.rect.size.y() * y
        ),
        scale: 0.4,
        size: 40.0,
        fill: COLOR.YELLOW,
        shadowColor: COLOR.BLACK,
        shadowBlur: 10.0,
        opacity: 0.0,
      });

      const squarePointTxt: Txt = new Txt({
        scale: 0.1,
        x: squarePoint.position().sub(0.0).normalized.scale(180.0).x,
        fill: COLOR.RED,
        text: () => `[${squarePoint.position.x()}, ${-squarePoint.position.y()}]`,
      });

      const squarePointArrow: Ray = new Ray({
        from: 0.0,
        to: () => squarePoint.position(),
        lineWidth: 10.0,
        stroke: COLOR.RED,
        endArrow: true,
        arrowSize: 0.0,
        end: 0.0,
      });

      squarePoints[pointIdx] = squarePoint;
      squarePointTxts[pointIdx] = squarePointTxt;
      squarePointArrows[pointIdx] = squarePointArrow;
      squarePoint.add(squarePointTxt);
      square.rect.add(squarePoint);
      square.rect.add(squarePointArrow);

      pointIdx += 1;
    }
  }

  yield* beginSlide("Show square points");

  yield* sequence(
    0.1,
    worldSpaceArrow.arrowSize(0.0, 0.6, easeInOutCubic),
    worldSpaceArrow.end(0.0, 0.6, easeInOutCubic),
    ...squarePoints.map(point =>
      all(
        point.opacity(1.0, 0.4, easeInOutCubic),
        point.scale(1.0, 0.4, easeInOutCubic),
      )
    ),
  );

  yield* beginSlide("Draw arrow to square points");

  yield* sequence(
    0.1,
    ...squarePointArrows.map(arrow =>
      all(
        arrow.end(1.0, 0.4, easeInOutCubic),
        arrow.arrowSize(16.0, 0.4, easeInOutCubic),
      )
    ),
  );

  yield* beginSlide("Move square up right");

  yield* sequence(
    0.1,
    ...squarePointArrows.map(arrow =>
      all(
        arrow.arrowSize(0.0, 0.4, easeInOutCubic),
        arrow.end(0.0, 0.4, easeInOutCubic),
      )
    ),
  );

  yield* moveContentRect(square, new Vector2(100.0, -300.0), 0.6, easeInOutCubic);

  const localSpaceToSquareTxt: Txt = new Txt({
    position: squarePoints[2].position().add(new Vector2(50.0, 60.0)),
    offset: new Vector2(-1, 0),
    scale: 0.12,
    fill: COLOR.RED,
  });

  const localSpaceToWorldTxt: Txt = new Txt({
    position: new Vector2(-80.0, -200.0),
    offset: new Vector2(-1, 0),
    scale: 0.12,
    fill: COLOR.BLUE,
  });

  square.rect.add(localSpaceToSquareTxt);
  square.rect.add(localSpaceToWorldTxt);

  yield* beginSlide("Local space to square txt");

  yield* all(
    localSpaceToSquareTxt.text("(local space wrt square)", 0.6),

    // fade out other square point local coordinates
    ...squarePointTxts.slice(0, 2).map(txt => txt.opacity(0.0, 0.6, easeInOutCubic)),
    ...squarePointTxts.slice(0, 2).map(txt => txt.scale(0.05, 0.6, easeInOutCubic)),
    ...squarePointTxts.slice(3).map(txt => txt.opacity(0.0, 0.6, easeInOutCubic)),
    ...squarePointTxts.slice(3).map(txt => txt.scale(0.05, 0.6, easeInOutCubic)),
  );

  yield* beginSlide("Local space to world txt");

  yield* localSpaceToWorldTxt.text("(local space wrt world)", 0.6);

  yield* beginSlide("Equals world space");

  yield* localSpaceToWorldTxt.text("(local space wrt world = world space)", 0.6);

  const squarePointCoord: CodeBlock = new CodeBlock({
    x: squarePointTxts[2].position.x() - 70.0,
    y: squarePointTxts[2].position.y(),
    scale: squarePointTxts[2].scale(),
    offset: new Vector2(-1, 0),
    language: "hlsl",
    code: `[100, 100]`,
    opacity: 0.0,
  });
  squarePointCoord.opacity(0.0);

  squarePoints[2].add(squarePointCoord);

  yield* beginSlide("Copy local space coordinate")

  // hide space txts
  yield* all(
    localSpaceToSquareTxt.opacity(0.0, 0.6, easeInOutCubic),
    localSpaceToSquareTxt.scale(0.1, 0.6, easeInOutCubic),
    localSpaceToWorldTxt.opacity(0.0, 0.6, easeInOutCubic),
    localSpaceToWorldTxt.scale(0.1, 0.6, easeInOutCubic),
  );

  yield* all(
    squarePointCoord.position(squarePointCoord.position().addY(-80.0), 0.6, easeInOutCubic),
    squarePointCoord.opacity(1.0, 0.6, easeInOutCubic),
  )

  yield* beginSlide("Show full equation");

  yield* squarePointCoord.edit(1.0, true)`${insert("mul(localToWorldMatrix, ")}[100, 100]${insert(")")}`;

  yield* beginSlide("Vectors to world square point");

  yield* chain(
      sequence(
      0.1,
      worldSpaceArrow.end(1.0, 0.6, easeInOutCubic),
      worldSpaceArrow.arrowSize(20.0, 0.6, easeInOutCubic),
    ),
    sequence(
      0.1,
      squarePointArrows[2].end(1.0, 0.4, easeInOutCubic),
      squarePointArrows[2].arrowSize(20.0, 0.4, easeInOutCubic),
    ),
  );

  yield* beginSlide("Show square point world position");

  function getSquarePointWorldPos(idx: number): Vector2 {
    return squarePoints[idx].absolutePosition().sub(centerPoint.absolutePosition());
  }

  yield* all(
    squarePointCoord.edit(1.0, false)`${remove("mul(localToWorldMatrix, ")}[${edit(
      "100, 100",
      `${getSquarePointWorldPos(2).x.toFixed()}, ${-getSquarePointWorldPos(2).y.toFixed()}`
    )}]${remove(")")}`,
    squarePointCoord.fill(COLOR.BLUE, 0.6),
  );

  squarePointCoord.code(() => `[${getSquarePointWorldPos(2).x.toFixed()}, ${-getSquarePointWorldPos(2).y.toFixed()}]`);

  const originSquareRect: Rect = square.rect.clone();
  originSquareRect.position(square.rect.position());
  originSquareRect.removeChildren();
  originSquareRect.opacity(0.4);
  originSquareRect.zIndex(-1);

  grid.add(originSquareRect);

  // rotate and scale command texts
  const rotateTxt: Txt = new Txt({
    position: new Vector2(600.0, 380.0),
    scale: 0.18,
    fill: COLOR.WHITE_SHADOW,
    text: "rotate -30",
    opacity: 0.0,
  });
  const scaleTxt: Txt = new Txt({
    position: new Vector2(600.0, 380.0),
    scale: 0.18,
    fill: COLOR.WHITE_SHADOW,
    text: "scale 1.2",
    opacity: 0.0,
  });

  view.add(rotateTxt);
  view.add(scaleTxt);

  yield* beginSlide("Rotate square");

  yield* all(
    square.rect.opacity(0.8, 0.4, easeInOutCubic),
    square.rect.rotation(-30.0, 0.6, easeInOutCubic),
    rotateTxt.opacity(1.0, 0.6, easeInOutCubic),
    rotateTxt.scale(0.2, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Scale square");

  yield* all(
    square.rect.scale(1.2, 0.6, easeInOutCubic),
    rotateTxt.position.y(rotateTxt.position.y() - 80.0, 0.6, easeInOutCubic),
    scaleTxt.opacity(1.0, 0.6, easeInOutCubic),
    scaleTxt.scale(0.2, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Move world around #2");

  squarePointCoord.code(squarePointCoord.code());

  yield* chain(
    sequence(
      0.1,
      rotateTxt.opacity(0.0, 0.4, easeInOutCubic),
      rotateTxt.scale(0.1, 0.4, easeInOutCubic),
      scaleTxt.opacity(0.0, 0.4, easeInOutCubic),
      scaleTxt.scale(0.1, 0.4, easeInOutCubic),
    ),
    all(
      grid.position(new Vector2(100.0, 200.0), 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
      grid.rotation(20.0, 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
    ),
  );

  squarePointCoord.code(() => `[${getSquarePointWorldPos(2).x.toFixed()}, ${-getSquarePointWorldPos(2).y.toFixed()}]`);

  const screenBorder: Line = new Line({
    lineWidth: 10.0,
    points: [
      new Vector2(-900.0, -500.0),
      new Vector2(900.0, -500.0),
      new Vector2(900.0, 500.0),
      new Vector2(-900.0, 500.0),
      new Vector2(-900.0, -505.0),
    ],
    stroke: COLOR.LIGHT_BLUE,
    zIndex: -1,
    end: 0.0,
  });
  const screenOriginPoint: Circle = new Circle({
    position: screenBorder.points()[3],
    scale: 0.0,
    size: 40.0,
    fill: COLOR.GREEN,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,
    opacity: 0.0,
  });
  const screenOriginTxt: Txt = new Txt({
    y: -40.0,
    scale: 0.1,
    offset: new Vector2(-1, 0),
    fill: COLOR.WHITE,
  });

  grid.add(screenBorder);
  grid.add(screenOriginPoint);
  screenOriginPoint.add(screenOriginTxt);

  yield* beginSlide("Move world arrow to square point");

  yield* all(
    square.rect.scale(1.0, 0.6, easeInOutCubic),
    square.rect.rotation(0.0, 0.6, easeInOutCubic),
    square.rect.opacity(1.0, 0.6, easeInOutCubic),
    originSquareRect.opacity(0.0, 0.6, easeInOutCubic),
    sequence(
      0.1,
      squarePointArrows[2].arrowSize(0.0, 0.6, easeInOutCubic),
      squarePointArrows[2].end(0.0, 0.6, easeInOutCubic),
    ),
  );

  yield* worldSpaceArrowTo(getSquarePointWorldPos(2), 0.6, easeInOutCubic),

  yield* beginSlide("Show screen border");

  yield* chain(
    screenBorder.end(1.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Show screen origin");

  yield* sequence(
    0.3,
    all(
      screenOriginPoint.scale(1.0, 0.6, easeInOutCubic),
      screenOriginPoint.opacity(1.0, 0.6, easeInOutCubic),
    ),
    screenOriginTxt.text("screen origin", 0.6),
  );

  yield* beginSlide("Show calculate screen space equation");

  yield* squarePointCoord.edit(1.0, true)
  `${insert("mul(worldToScreen, ")}[${`${getSquarePointWorldPos(2).x.toFixed()}, ${-getSquarePointWorldPos(2).y.toFixed()}`}]${insert(")")}`;

  const screenSpaceArrowTo: SimpleSignal<PossibleVector2<number>> = createSignal(() => centerPoint.position());
  const screenSpaceArrow: Ray = new Ray({
    from: () => screenOriginPoint.position(),
    to: screenSpaceArrowTo,
    lineWidth: 8.0,
    stroke: COLOR.GREEN,
    endArrow: true,
    arrowSize: 0.0,
    end: 0.0,
  });

  grid.add(screenSpaceArrow);

  yield* beginSlide("Vectors to screen square point");

  yield* sequence(
    0.1,
    screenSpaceArrow.end(1.0, 0.6, easeInOutCubic),
    screenSpaceArrow.arrowSize(20.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Show square point screen position");

  function getSquarePointScreenPos(idx: number): Vector2 {
    return squarePoints[idx].absolutePosition().sub(screenOriginPoint.absolutePosition());
  }

  yield* squarePointCoord.edit(1.0, false)
  `${remove("mul(worldToScreen, ")}[${edit(
    `${getSquarePointWorldPos(2).x.toFixed()}, ${-getSquarePointWorldPos(2).y.toFixed()}`,
    `${getSquarePointScreenPos(2).x.toFixed()}, ${-getSquarePointScreenPos(2).y.toFixed()}`
  )}]${remove(")")}`;

  yield* beginSlide("Fade out grid");

  yield* all(
    grid.scale(0.8, 0.6, easeInOutCubic),
    grid.opacity(0.0, 0.6, easeInOutCubic),
  );
});
