import { COLOR } from "../styles"
import {
  ContentRectConfig,
  ContentRect, createContentRect, scaleContentRect, fadeContentRect, positionContentRect, changeContentTxt, moveContentRect
} from "../utils/rect_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Grid, Line, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, delay, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuart, tween} from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleConfig: ContentRectConfig = {
    size: new Vector2(420.0, 98.0),
    radius: 10.0,
    gap: 10.0,
    fill: COLOR.WHITE,
    txtScale:0.09,
    txtFill: COLOR.BLACK,
  }
  const titleCont: ContentRect = createContentRect(
    "0. Why do we need parallelism?",
    new Vector2(-700.0, -440.0), titleConfig, 0.6, view
  );

  yield* beginSlide("Move title to center");

  yield* all(
    positionContentRect(titleCont, 0.0, 0.6, easeInOutCubic),
    fadeContentRect(titleCont, 1.0, 0.6, easeInOutCubic),
  );

  yield* scaleContentRect(titleCont, 1.4, 0.6, easeInOutCubic);
  yield* delay(
    0.3,
    changeContentTxt(titleCont, "1. Coordinate Systems", 0.6),
  );

  yield* beginSlide("Move title to top left");

  yield* all(
    positionContentRect(titleCont, new Vector2(-700.0, -440.0), 0.6, easeInOutCubic),
    titleCont.rect.fill("#8A8C8E", 0.6, easeInOutCubic),
    scaleContentRect(titleCont, 1.0, 0.6, easeInOutCubic),
  );

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
    position: () => centerPoint.position().addY(40.0),
    scale: 0.1,
    fill: COLOR.WHITE,
    text: "",
  });

  view.add(grid);
  grid.add(centerPoint);
  grid.add(centerPointTxt);

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

  yield* beginSlide("Move world around");

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

  yield* beginSlide("Move world around again");

  yield* all(
    grid.position(new Vector2(100.0, -200.0), 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
    grid.rotation(20.0, 0.6, easeInOutCubic).to(0.0, 0.6, easeInOutCubic),
  );

  const squareCenterPoint: Circle = new Circle({
    scale: 0.8,
    size: 40.0,
    fill: COLOR.RED,
    opacity: 0.0,
  });
  const squareCenterArrow: Line = new Line({
    lineWidth: 10.0,
    points: [
      0.0,
      () => square.rect.position(),
    ],
    stroke: COLOR.BLUE,
    arrowSize: 0.0,
    endArrow: true,
    start: 0.0,
    end: 0.0,
    // shadowColor: COLOR.BLACK,
    // shadowBlur: 10.0,
  });

  square.rect.add(squareCenterPoint);
  view.add(squareCenterArrow);

  yield* beginSlide("Show square center point");

  yield* all(
    squareCenterPoint.opacity(1.0, 0.6, easeInOutCubic),
    squareCenterPoint.scale(1.0, 0.6, easeInOutCubic),
  );

  yield* sequence(
    0.1,
    squareCenterArrow.end(1.0, 0.6, easeInOutCubic),
    squareCenterArrow.arrowSize(20.0, 0.6, easeInOutCubic),
  )

  const squarePoints: Circle[] = new Array<Circle>(4);
  const squarePointTxts: Txt[] = new Array<Txt>(4);
  const squarePointArrows: Line[] = new Array<Line>(4);

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
        opacity: 0.0,
      });

      const squarePointTxt: Txt = new Txt({
        scale: 0.1,
        x: squarePoint.position().sub(0.0).normalized.scale(180.0).x,
        fill: COLOR.RED,
        shadowColor: COLOR.BLACK,
        shadowBlur: 6.0,
        text: () => `[${squarePoint.position.x()}, ${-squarePoint.position.y()}]`,
      });

      const squarePointArrow: Line = new Line({
        lineWidth: 8.0,
        points: [
          0.0,
          () => squarePoint.position(),
        ],
        stroke: COLOR.RED,
        endArrow: true,
        arrowSize: 0.0,
        end: 0.0,
        // shadowColor: COLOR.BLACK,
        // shadowBlur: 10.0,
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
    squareCenterArrow.arrowSize(0.0, 0.6, easeInOutCubic),
    squareCenterArrow.end(0.0, 0.6, easeInOutCubic),
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

  yield* beginSlide("Move square around");

  yield* sequence(
    0.1,
    ...squarePointArrows.map(arrow =>
      all(
        arrow.arrowSize(0.0, 0.4, easeInOutCubic),
        arrow.end(0.0, 0.4, easeInOutCubic),
      )
    ),
  );

  yield* moveContentRect(square, Vector2.down.scale(300.0), 0.6, easeInOutCubic);

  const localSpaceToSquareTxt: Txt = new Txt({
    position: squarePoints[2].position().add(new Vector2(220.0, 60.0)),
    scale: 0.12,
    fill: COLOR.RED,
  });

  const localSpaceToWorldTxt: Txt = new Txt({
    y: -200.0,
    scale: 0.12,
    fill: COLOR.BLUE,
  });

  square.rect.add(localSpaceToSquareTxt);
  square.rect.add(localSpaceToWorldTxt);

  yield* beginSlide("Local space to square txt");

  yield* localSpaceToSquareTxt.text("(local space to square)", 0.6);

  yield* beginSlide("Local space to world txt");

  yield* localSpaceToWorldTxt.text("(local space to world)", 0.6);

  yield* beginSlide("Equals world space");

  yield* localSpaceToWorldTxt.text("(local space to world = world space)", 0.6);

  const squarePointWorldSpaceTxt: Txt = squarePointTxts[2].clone();
  squarePointWorldSpaceTxt.position(squarePointTxts[2].position());
  squarePointWorldSpaceTxt.opacity(0.0);

  squarePoints[2].add(squarePointWorldSpaceTxt);

  yield* beginSlide("Copy local space coordinate")

  // hide space txts
  yield* all(
    localSpaceToSquareTxt.opacity(0.0, 0.6, easeInOutCubic),
    localSpaceToSquareTxt.scale(0.1, 0.6, easeInOutCubic),
    localSpaceToWorldTxt.opacity(0.0, 0.6, easeInOutCubic),
    localSpaceToWorldTxt.scale(0.1, 0.6, easeInOutCubic),
  );

  yield* all(
    squarePointWorldSpaceTxt.position(squarePointWorldSpaceTxt.position().addY(-80.0), 0.6, easeInOutCubic),
    squarePointWorldSpaceTxt.opacity(1.0, 0.6, easeInOutCubic),
  )

  yield* squarePointWorldSpaceTxt.text("mul(localToWorld, localPosition)", 0.6);

  yield* beginSlide("Fill in local position");

  yield* squarePointWorldSpaceTxt.text("mul(localToWorld, [100, 100])", 0.6);

  yield* beginSlide("Show square point world position");

  yield* all(
    squarePointWorldSpaceTxt.text(() => {
      const worldPos: Vector2 = squarePoints[2].absolutePosition();
      return `[${(worldPos.x - 960).toFixed()}, ${(540 - worldPos.y).toFixed()}]`;
    }, 0.6),
    squarePointWorldSpaceTxt.fill(COLOR.BLUE, 0.6),
  );

  yield* beginSlide("Vectors to square point");

  yield* sequence(
    0.1,
    squareCenterArrow.end(1.0, 0.6, easeInOutCubic),
    squareCenterArrow.arrowSize(20.0, 0.6, easeInOutCubic),
  );

  yield* sequence(
    0.1,
    squarePointArrows[2].end(1.0, 0.4, easeInOutCubic),
    squarePointArrows[2].arrowSize(20.0, 0.4, easeInOutCubic),
  );

  yield* beginSlide("Rotate and scale square");

  yield* chain(
    square.rect.rotation(-10.0, 0.6, easeInOutCubic),
    square.rect.scale(1.1, 0.6, easeInOutCubic),
  );
});
