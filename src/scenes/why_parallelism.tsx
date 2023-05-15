import { COLOR } from "../styles"
import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";
import {
  ContentRectConfig, MultiContentRect,
  createMulContentRects,
  moveMulContentRects, fadeMulContentRects,
  focusIdxMulContentRects, scaleMulContentRects,
  ContentRect, createContentRect, scaleContentRect, fadeContentRect
} from "../utils/rect_util";
import { animateDistanceLine, createDistanceLine } from "../utils/arrow_util";
import { animSquareGrid, createSquareGrid, SquareGridConfig } from "../utils/grid_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
// import { CodeBlock, edit, insert, remove } from '@motion-canvas/2d/lib/components/CodeBlock';
import { Circle, Layout, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, delay, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuint, easeInOutSine, TimingFunction, tween } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { cancel, ThreadGenerator } from "@motion-canvas/core/lib/threading";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const outlineCont: OutlineContent = setup();

  view.add(outlineCont.outlineTitle);
  view.add(outlineCont.outlineLayout);

  yield* focusOnOutlineIndex(outlineCont, 0, 0.0, 1.2);

  const transCircle: Circle = new Circle({
    size: view.size.x() * 2.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 20.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineCont.outlineRects[0].absolutePosition);

  yield* beginSlide("Transition to outline");

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Introduction to shaders'");

  yield* focusOnOutlineIndex(outlineCont, 1, 0.6, 1.2);

  const topics = [
    "0. Why do we need parallelism?",
    "1. Coordinate systems",
    "2. Basic mesh concepts",
    "3. Graphics pipeline",
  ];

  const topicConfig: ContentRectConfig = {
    size: new Vector2(600.0, 140.0),
    radius: 10.0,
    gap: 10.0,
    fill: COLOR.WHITE,
    txtScale:0.12,
    txtFill: COLOR.BLACK,
  }

  const topicLayout: Layout = new Layout({
    position: new Vector2(400.0, -300.0),
  });

  const topicRects: MultiContentRect = createMulContentRects(
    topics, topicConfig, 1.0, topicLayout
  );

  view.add(topicLayout);

  yield* fadeMulContentRects(
    topicRects, 0.0,
    0.0, 0.0
  );

  yield* scaleMulContentRects(
    topicRects, 0.8,
    0.0, 0.0
  );

  yield* beginSlide("Show subtopics");

  yield* all(
    moveMulContentRects(
      topicRects, new Vector2(0.0, 100.0),
      0.6, 0.3, easeInOutCubic
    ),
    fadeMulContentRects(
      topicRects, 1.0,
      0.6, 0.3, easeInOutCubic
    ),
    scaleMulContentRects(
      topicRects, 1.0,
      0.6, 0.3, easeInOutCubic
    ),
  );

  yield* beginSlide("Focus on '#0'");

  yield* focusIdxMulContentRects(
    topicRects, 0, 1.4,
    0.4, 1.0,
    0.6, 0.0, easeInOutCubic
  );

  const rect0: Rect = topicRects.rects[0];
  const txt0: Txt = topicRects.txts[0];

  yield* beginSlide("Move to top left");

  yield* all(
    // fade out outline
    sequence(
      0.1,
      ...outlineCont.outlineRects.map((rect) =>
        all(
          rect.scale(0.8, 0.6, easeInOutCubic),
          rect.opacity(0.0, 0.6, easeInOutCubic),
        )
      ),
    ),
    outlineCont.outlineTitle.scale(0.2, 0.6, easeInOutCubic),
    outlineCont.outlineTitle.opacity(0.0, 0.6, easeInOutCubic),

    // fade out contents
    focusIdxMulContentRects(
      topicRects, 0, 1.4,
      0.0, 0.8,
      0.6, 0.1, easeInOutCubic
    ),

    delay(
      0.3,
      all(
        // move 'Why do we need parallelism to top left'
        rect0.scale(1.0, 0.6, easeInOutCubic),
        rect0.size(rect0.size().mul(0.7), 0.6, easeInOutCubic),
        rect0.position(new Vector2(-1100.0, -140.0), 0.6, easeInOutCubic),
        rect0.opacity(0.6, 0.6, easeInOutCubic),

        txt0.scale(0.09, 0.6, easeInOutCubic),
      )
    ),
  );

  const circleScale: number = 50.0;
  const radius = createSignal(4.0);

  const renderCircle: Circle = new Circle({
    size: () => radius() * circleScale * 2.0,
    fill: COLOR.WHITE,
    opacity: 0.0,
  });
  const circleLine: Line = createDistanceLine(
    0.0, COLOR.BLACK, [
      Vector2.zero,
      () => Vector2.right.scale(radius() * circleScale),
    ]
  );

  const radiusTxt: Txt = new Txt({
    y: 50.0,
    x: () => radius() * circleScale * 0.5,
    scale: 0.12,
    fill: COLOR.BLACK,
  });

  view.add(renderCircle);
  renderCircle.add(circleLine);
  circleLine.add(radiusTxt);

  yield* beginSlide("Show circle");

  yield* all(
    radius(4.5, 0.6, easeInOutCubic),
    renderCircle.opacity(1.0, 0.6, easeInOutCubic),
  )

  yield* beginSlide("Show radius");

  yield* all(
    animateDistanceLine(circleLine, 0.6, easeInOutQuint),
    radiusTxt.text(() => radius().toFixed(2).toString(), 0.6, easeInOutCubic),
  )

  // yield* beginSlide("Scale circle up/down");

  yield* radius(9.0, 1.0, easeInOutCubic).to(4.5, 1.0, easeInOutCubic);

  // create pixel grid
  const pixelParent: Circle = new Circle({
    size: renderCircle.size(),
    fill: COLOR.TRANSPARENT,
  });
  renderCircle.add(pixelParent);

  const pixelConfig: SquareGridConfig = {
    size: 9,
    gap: 2.0,
    padding: -2.0,
    radius: 0.0,
  };
  const pixelGrid: Rect[][] = createSquareGrid(pixelConfig, COLOR.BLACK, pixelParent);

  for (var x = 0; x < pixelConfig.size; x++) {
    for (var y = 0; y < pixelConfig.size; y++) {
      const pixel: Rect = pixelGrid[x][y];

      pixel.lineWidth(2.0);
      pixel.stroke(COLOR.BLUE);
    }
  }

  const pixelOriginSize: number = pixelGrid[0][0].width();

  yield* beginSlide("Create pixel grid");

  yield* all(
    animSquareGrid(
      pixelConfig, pixelGrid,
      pixelOriginSize * 0.6, pixelOriginSize,
      0.0, 0.7,
      2.0, easeInOutSine
    ),
  );

  const firstPixel: Rect = pixelGrid[0][pixelConfig.size - 1];

  function* scalePixel(
    pixel: Rect, scale: number, opacity: number, zIndex: number,
    duration: number = 0.6, timingFunc: TimingFunction = easeInOutCubic
  ) {
    yield* all(
      pixel.scale(scale, duration, timingFunc),
      pixel.opacity(opacity, duration, timingFunc),
      pixel.zIndex(zIndex, duration, timingFunc),
    );
  }

  // used for first pixel
  const firstPixCoordTxt: Txt = new Txt({
    position: firstPixel.position().sub(Vector2.down.scale(40.0)),
    scale: 0.08,
    fill: COLOR.YELLOW,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,
    text: "coordinate",
    opacity: 0.0
  });

  view.add(firstPixCoordTxt);

  yield* beginSlide("Show first pixel");

  yield* all(
    scalePixel(firstPixel, 1.4, 1.0, 1.0),
  );

  yield* all(
    firstPixCoordTxt.position.y(firstPixCoordTxt.position.y() + 20.0, 0.5, easeInOutCubic),
    firstPixCoordTxt.opacity(1.0, 0.4, easeInOutCubic),
    firstPixCoordTxt.scale(0.1, 0.4, easeInOutCubic),
  );

  const measureLineDist: number = 80.0;

  const pixelsHeightLine: Line = createDistanceLine(
    new Vector2(-renderCircle.size.x() * 0.5 - measureLineDist, renderCircle.size.y() * 0.5),
    COLOR.GREEN, [
      0.0,
      Vector2.down.scale(renderCircle.size.y()),
    ]
  );
  const pixelsHeightTxt: Txt = new Txt({
    position: new Vector2(-40.0, -renderCircle.size.y() * 0.5),
    rotation: -90.0,
    scale: 0.1,
    fill: COLOR.GREEN,
  });

  const pixelsWidthLine: Line = createDistanceLine(
    new Vector2(-renderCircle.size.x() * 0.5, -renderCircle.size.y() * 0.5 - measureLineDist),
    COLOR.RED, [
      0.0,
      Vector2.right.scale(renderCircle.size.y()),
    ]
  );
  const pixelsWidthTxt: Txt = new Txt({
    position: new Vector2(renderCircle.size.y() * 0.5, -40.0),
    scale: 0.1,
    fill: COLOR.RED,
  });

  pixelsHeightLine.add(pixelsHeightTxt);
  pixelsWidthLine.add(pixelsWidthTxt);
  view.add(pixelsHeightLine);
  view.add(pixelsWidthLine);

  yield* beginSlide("Show pixel grid size");

  yield* all(
    animateDistanceLine(pixelsHeightLine, 0.6, easeInOutQuint),
    pixelsHeightTxt.text("9 pixels", 0.6),
  );
  yield* all(
    animateDistanceLine(pixelsWidthLine, 0.6, easeInOutQuint),
    pixelsWidthTxt.text("9 pixels", 0.6),
  );

  yield* beginSlide("Show first pixel coordinate");

  yield* firstPixCoordTxt.text("[0, 0]", 0.6);

  // used for center pixel
  const centerPixCoordTxt: Txt = firstPixCoordTxt.clone();
  const gridCenterIdx: number = (pixelConfig.size - 1) / 2;
  const centerPixel: Rect = pixelGrid[gridCenterIdx][gridCenterIdx];
  centerPixCoordTxt.position(centerPixel.position());
  centerPixCoordTxt.position.y(centerPixCoordTxt.position.y() + 60.0);
  centerPixCoordTxt.text("");

  view.add(centerPixCoordTxt);

  yield* beginSlide("Show center pixel coordinate");

  yield* all(
    scalePixel(centerPixel, 1.4, 1.0, 1.0),
    centerPixCoordTxt.text("[4, 4]", 0.6),
  );

  const measureLine: Line = createDistanceLine(
    0.0, COLOR.YELLOW, [
      firstPixel.position(),
      centerPixel.position(),
    ]
  );
  measureLine.shadowColor(COLOR.BLACK);
  measureLine.shadowBlur(24.0);
  const firstCenterDistCode: Txt = new Txt({
    position: new Vector2(-100.0, 150.0),
    offset: new Vector2(-1, 0),
    scale: 0.1,
    fill: COLOR.WHITE,
    shadowBlur: 10.0,
    shadowColor: COLOR.BLACK,
  });

  yield measureLine.add(firstCenterDistCode),
  view.add(measureLine);

  yield* beginSlide("Distance between 1st and center");

  yield* all(
    animateDistanceLine(measureLine, 0.6, easeInOutCubic),
    firstCenterDistCode.text("sqrt((x1 - x0)^2 + (y1 - y0)^2)", 0.6),
  );

  yield* beginSlide("Replace variables with values");

  yield* firstCenterDistCode.text("sqrt((4 - 0)^2 + (4 - 0)^2)", 0.6);

  yield* beginSlide("Simplify equation #1");

  yield* firstCenterDistCode.text("sqrt(16 + 16)", 0.6);

  yield* beginSlide("Simplify equation #2");

  yield* firstCenterDistCode.text("sqrt(32)", 0.6);

  yield* beginSlide("Simplify equation #3");

  yield* firstCenterDistCode.text("≈5.66", 0.6);

  const greaterThanRadiusTxt: Txt = new Txt({
    position: new Vector2(20.0, 150.0),
    scale: 0.14,
    fill: COLOR.RED,
    shadowBlur: 10.0,
    shadowColor: COLOR.BLACK,
    text: "> " + radius(),
    opacity: 0.0,
  });
  const smallerThanRadiusTxt: Txt = new Txt({
    scale: 0.14,
    fill: COLOR.GREEN,
    shadowBlur: 10.0,
    shadowColor: COLOR.BLACK,
    text: "≤ " + radius(),
    opacity: 0.0,
  });

  view.add(greaterThanRadiusTxt);
  view.add(smallerThanRadiusTxt);

  yield* beginSlide("Show greater than radius");

  yield* all(
    greaterThanRadiusTxt.position.x(greaterThanRadiusTxt.position.x() + 20.0, 0.4, easeInOutCubic),
    greaterThanRadiusTxt.opacity(1.0, 0.4, easeInOutCubic),
  );

  yield* beginSlide("Repeat the same process for each pixel");

  // cleanup
  yield* all(
    animateDistanceLine(measureLine, 0.6, easeInOutCubic, 0.5, 0.5, 0.0, 0.1, 0.0),
    firstCenterDistCode.opacity(0.0, 0.6, easeInOutCubic),
    centerPixCoordTxt.opacity(0.0, 0.6, easeInOutCubic),
    firstPixCoordTxt.opacity(0.0, 0.6, easeInOutCubic),
    greaterThanRadiusTxt.opacity(0.0, 0.6, easeInOutCubic),
    scalePixel(firstPixel, 1.0, 0.7, 0.0, 0.6, easeInOutCubic),
    scalePixel(centerPixel, 1.0, 0.7, 0.0, 0.6, easeInOutCubic),
  )

  const pixel00: Rect = pixelGrid[0][0];
  measureLine.points([
    pixel00.position,
    centerPixel.position,
  ]);
  greaterThanRadiusTxt.position(pixel00.position().add(centerPixel.position()).scale(0.5));
  smallerThanRadiusTxt.position(pixel00.position().add(centerPixel.position()).scale(0.5));

  const verbalConfig: ContentRectConfig = {
    size: new Vector2(460.0, 220.0),
    gap: 0.0,
    radius: 20.0,
    fill: COLOR.WHITE,
    txtScale: 0.12,
    txtFill: COLOR.BLACK,
  }

  const verbalCont: ContentRect = createContentRect(
    "", Vector2.right.scale(560.0), verbalConfig, 0.0, view
  );

  const pixelsHeightTxtClone = pixelsHeightTxt.clone();
  const pixelsWidthTxtClone = pixelsWidthTxt.clone();

  const calculationLayout: Layout = new Layout({});

  view.add(calculationLayout);

  calculationLayout.add(pixelsHeightTxtClone);
  calculationLayout.add(pixelsWidthTxtClone);
  pixelsHeightTxtClone.absolutePosition(pixelsHeightTxt.absolutePosition());
  pixelsWidthTxtClone.absolutePosition(pixelsWidthTxt.absolutePosition());

  pixelsHeightTxtClone.opacity(0.0);
  pixelsWidthTxtClone.opacity(0.0);

  yield* animateDistanceLine(measureLine, 0.6, easeInOutCubic, 0.0, 1.0, 20.0, 0.0, 0.0);
  yield* scaleContentRect(verbalCont, 0.8, 0.0, easeInOutCubic);

  const colorPixDuration: number = 0.15;
  const drawCirclePixelTask: ThreadGenerator = yield chain(
    ...pixelGrid.map((pixels) =>
      chain(
        ...pixels.map((pixel) =>
          chain(
            // move measure line to correct position
            measureLine.points([
              centerPixel.position,
              pixel.position,
            ], 0.0),

            all(
              scalePixel(pixel, 1.4, 1.0, 1.0, colorPixDuration, easeInOutCubic),
              greaterThanRadiusTxt.position(
                pixel.position().add(centerPixel.position()).scale(0.5), colorPixDuration, easeInOutCubic
              ),
              smallerThanRadiusTxt.position(
                pixel.position().add(centerPixel.position()).scale(0.5), colorPixDuration, easeInOutCubic
              ),

              tween(colorPixDuration, () => {
                const vec: Vector2 = centerPixel.position().sub(pixel.position());

                if (vec.magnitude > radius() * circleScale) {
                  greaterThanRadiusTxt.opacity(1.0);
                  smallerThanRadiusTxt.opacity(0.0);
                  pixel.fill(COLOR.BLACK);
                } else {
                  smallerThanRadiusTxt.opacity(1.0);
                  greaterThanRadiusTxt.opacity(0.0);
                  pixel.fill(COLOR.WHITE);
                }
              }),
            ),

            scalePixel(pixel, 1.0, 0.7, 0.0, colorPixDuration, easeInOutCubic),
          )
        ),
      ),
    ),
  );

  yield* beginSlide("Imagin doing this the serial way");

  yield* all(
    scaleContentRect(verbalCont, 1.0, 0.6, easeInOutCubic),
    fadeContentRect(verbalCont, 1.0, 0.6, easeInOutCubic),
    verbalCont.txt.text("Imagine doing this\none by one", 0.6),
  );

  yield* verbalCont.txt.text("Imagine doing this\none by one\n(the serial way)", 0.6);

  yield* beginSlide("x axis pixels");

  yield* sequence(
    0.3,
    pixelsWidthTxtClone.opacity(1.0, 0.6, easeInOutCubic),
    all(
      pixelsWidthTxtClone.rotation(0.0, 0.6, easeInOutCubic),
      pixelsWidthTxtClone.position(verbalCont.rect.position().add(new Vector2(-160.0, 200.0)), 0.6, easeInOutCubic),
    ),
  );

  yield* beginSlide("y axis pixels");

  yield* sequence(
    0.3,
    pixelsHeightTxtClone.opacity(1.0, 0.6, easeInOutCubic),
    all(
      pixelsHeightTxtClone.rotation(0.0, 0.6, easeInOutCubic),
      pixelsHeightTxtClone.position(verbalCont.rect.position().addY(200.0), 0.6, easeInOutCubic),
    ),
  );

  const multiplyTxt: Txt = new Txt({
    position: pixelsWidthTxtClone.position().addX(80.0),
    scale: 0.1,
    fill: COLOR.WHITE,
    text: "x",
    opacity: 0.0,
  });
  const equalTxt: Txt = new Txt({
    position: pixelsHeightTxtClone.position().addX(80.0),
    scale: 0.1,
    fill: COLOR.WHITE,
    text: "=",
    opacity: 0.0,
  });
  const resultTxt: Txt = new Txt({
    position: pixelsHeightTxtClone.position().addX(170.0),
    scale: 0.1,
    fill: COLOR.YELLOW,
    text: "81 pixels",
    opacity: 0.0,
  });

  const underlineRect: Rect = new Rect({
    position: pixelsHeightTxtClone.position().add(new Vector2(114.0, 30.0)),
    size: new Vector2(0.0, 6.0),
    fill: COLOR.YELLOW,
  });
  calculationLayout.add(multiplyTxt);
  calculationLayout.add(equalTxt);
  calculationLayout.add(resultTxt);
  calculationLayout.add(underlineRect);

  yield* beginSlide("Multiply pixels");

  yield* sequence(
    0.3,
    multiplyTxt.opacity(1.0, 0.6, easeInOutCubic),
    equalTxt.opacity(1.0, 0.6, easeInOutCubic),
    resultTxt.opacity(1.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Modern display");

  yield* sequence(
    0.5,
    all(
      pixelsWidthTxtClone.text("1920", 0.6),
      multiplyTxt.position.x(multiplyTxt.position.x() - 30.0, 0.6, easeInOutCubic),
    ),
    all(
      pixelsHeightTxtClone.text("1080", 0.6),
      pixelsHeightTxtClone.position.x(pixelsHeightTxtClone.position.x() - 60.0, 0.6, easeInOutCubic),
    ),
    all(
      resultTxt.text("2,073,600", 0.6),
      resultTxt.position.x(resultTxt.position.x() - 60.0, 0.6),
      equalTxt.position.x(equalTxt.position.x() - 90.0, 0.6),
    ),
    all(
      resultTxt.scale(0.15, 0.6, easeInOutCubic),
      underlineRect.size.x(200.0, 0.6, easeInOutCubic),
    )
  );

  yield* beginSlide("Stop drawing circle, transition out");

  cancel(drawCirclePixelTask);

  yield* sequence(
    0.1,
    all(
      scaleContentRect(verbalCont, 0.8, 0.6, easeInOutCubic),
      fadeContentRect(verbalCont, 0.0, 0.6, easeInOutCubic),
    ),
    calculationLayout.opacity(0.0, 0.6, easeInOutCubic),
    all(
      animateDistanceLine(measureLine, 0.6, easeInOutCubic, 0.5, 0.5, 0.0, 0.1, 0.0),
      greaterThanRadiusTxt.opacity(0.0, 0.6, easeInOutCubic),
      smallerThanRadiusTxt.opacity(0.0, 0.6, easeInOutCubic),
    ),
    // fade out circle
    all(
      renderCircle.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      animateDistanceLine(pixelsHeightLine, 0.6, easeInOutCubic, 0.5, 0.5, 0.0, 0.1, 0.0),
      pixelsWidthTxt.text("", 0.6),
      animateDistanceLine(pixelsWidthLine, 0.6, easeInOutCubic, 0.5, 0.5, 0.0, 0.1, 0.0),
      pixelsHeightTxt.text("", 0.6),
    ),
  );
});
