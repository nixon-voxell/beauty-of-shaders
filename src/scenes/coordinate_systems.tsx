import {COLOR} from "../styles"
import {
  ContentRectConfig,
  ContentRect, createContentRect, scaleContentRect, fadeContentRect, positionContentRect, changeContentTxt, moveContentRect
} from "../utils/rect_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Grid, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import { all, chain, delay, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { arcLerp, easeInOutCubic, easeInOutQuart, easeInOutSine, map, tween} from "@motion-canvas/core/lib/tweening";
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
    spacing: 60.0,
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
      centerPointTxt.text("center of world", 0.6),
    )
  );

  const squareConfig: ContentRectConfig = {
    size: Vector2.one.scale(200.0),
    gap: 0.0,
    radius: 0.0,
    fill: COLOR.WHITE,
    txtFill: COLOR.BLACK,
    txtScale: 0.1,
  }

  const square: ContentRect = createContentRect("", 300.0, squareConfig, 0.0, grid);
  yield* scaleContentRect(square, 0.8, 0.0);

  square.txt.text(() => `world:\n[${square.rect.position.x().toFixed()}, ${square.rect.position.y().toFixed()}]`);
  square.txt.position(new Vector2(-10.0, 60.0));

  yield* beginSlide("Show square");

  yield* all(
    scaleContentRect(square, 1.0, 0.6, easeInOutCubic),
    fadeContentRect(square, 1.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Move square around");

  var squareOriginPos: Vector2 = square.rect.position();

  yield* chain(
    tween(
      2.0, value => {
        value = easeInOutCubic(value);
        square.rect.position(Vector2.arcLerp(squareOriginPos, new Vector2(0.0, -240.0), value, true));
      }
    ),

    waitFor(0.4),
    moveContentRect(square, new Vector2(-200.0, 100.0), 1.0, easeInOutCubic),

    waitFor(0.4),
    moveContentRect(square, new Vector2(-400.0, 400.0), 1.5, easeInOutCubic),
  );

  const squareCenterPoint: Circle = new Circle({
    scale: 0.8,
    size: 40.0,
    fill: COLOR.RED,
    opacity: 0.0,
  })

  square.rect.add(squareCenterPoint);

  yield* beginSlide("Show square center point");

  yield* all(
    squareCenterPoint.opacity(1.0, 0.6, easeInOutCubic),
    squareCenterPoint.scale(1.0, 0.6, easeInOutCubic),
  );
});
