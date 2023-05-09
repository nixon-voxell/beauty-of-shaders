import { COLOR } from "../styles"
import { outlineRects, outlineLayout, setup, focusOnOutlineIndex, outlineTitle } from "../utils/outline_util";
import {
  ContentRectConfig, VertContentRect,
  createVertContentRects,
  moveVertContentRects, fadeVertContentRects,
  sameTxtVertContentRects, changeTxtVertContentRects, focusIdxVertContentRects, scaleVertContentRects
} from "../utils/rect_util";
import { animSquareGrid, createSquareGrid, SquareGridConfig } from "../utils/grid_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, delay, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuint, easeInOutSine } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  yield setup();

  // const outlineLayout: Layout = new Layout({});

  view.add(outlineTitle);
  view.add(outlineLayout);

  yield* focusOnOutlineIndex(0, 0.0, 1.2);

  const transCircle: Circle = new Circle({
    size: view.size.x() * 2.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 20.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineRects[0].absolutePosition);

  // yield* beginSlide("Transition to outline");

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutQuint),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Introduction to shaders'");

  yield* focusOnOutlineIndex(1, 0.6, 1.2);

  const topics = [
    "0. Why do we need parallelism?",
    "1. Graphics pipeline",
    "2. Coordinate systems",
    "3. Basic mesh concepts",
    "4. Vertex & fragment shaders"
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
    position: new Vector2(400.0, -400.0),
  });

  const topicRects: VertContentRect = createVertContentRects(
    topics, topicConfig, 1.0, topicLayout
  );

  view.add(topicLayout);

  yield* fadeVertContentRects(
    topicRects, 0.0,
    0.0, 0.0
  );

  yield* scaleVertContentRects(
    topicRects, 0.8,
    0.0, 0.0
  );

  yield* sameTxtVertContentRects(
    topicRects, "",
    0.0, 0.0
  );

  yield* beginSlide("Show subtopics");

  yield* all(
    moveVertContentRects(
      topicRects, new Vector2(0.0, 100.0),
      0.6, 0.15, easeInOutCubic
    ),
    fadeVertContentRects(
      topicRects, 1.0,
      0.6, 0.15, easeInOutCubic
    ),
    scaleVertContentRects(
      topicRects, 1.0,
      0.6, 0.15
    ),
    changeTxtVertContentRects(
      topicRects, topics,
      0.6, 0.15, easeInOutCubic
    ),
  );

  yield* beginSlide("Focus on '#0'");

  yield* focusIdxVertContentRects(
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
      ...outlineRects.map((rect) =>
        all(
          rect.scale(0.8, 0.6, easeInOutCubic),
          rect.opacity(0.0, 0.6, easeInOutCubic),
        )
      ),
    ),
    outlineTitle.scale(0.2, 0.6, easeInOutCubic),
    outlineTitle.opacity(0.0, 0.6, easeInOutCubic),

    // fade out contents
    focusIdxVertContentRects(
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
        rect0.position(new Vector2(-1100.0, -40.0), 0.6, easeInOutCubic),
        rect0.opacity(0.6, 0.6, easeInOutCubic),

        txt0.scale(0.09, 0.6, easeInOutCubic),
      )
    ),
  );

  const circleScale: number = 200.0;
  const radius = createSignal(0.8);

  const renderCircle: Circle = new Circle({
    size: () => radius() * circleScale * 2.0,
    fill: COLOR.WHITE,
    opacity: 0.0,
  });
  const circleLine: Line = new Line({
    lineWidth: 10.0,
    points: [
      Vector2.zero,
      // highlight-next-line
      () => Vector2.right.scale(radius() * circleScale),
    ],
    stroke: COLOR.BLACK,
    startArrow: true,
    endArrow: true,
    arrowSize: 20.0,
    end: 0.0,
  });

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
    radius(1.0, 0.6, easeInOutCubic),
    renderCircle.opacity(1.0, 0.6, easeInOutCubic),
  )

  yield* beginSlide("Show radius");

  yield* all(
    circleLine.end(1.0, 0.6, easeInOutCubic),
    radiusTxt.text(() => radius().toFixed(2).toString(), 0.6, easeInOutCubic),
  )

  yield* beginSlide("Scale circle up/down");

  yield* radius(2.0, 1.0, easeInOutCubic).to(1.0, 1.0, easeInOutCubic);

  // create pixel grid
  const pixelParent: Circle = new Circle({
    size: renderCircle.size().mul(1.2),
    fill: COLOR.TRANSPARENT,
  });
  renderCircle.add(pixelParent);

  const pixelConfig: SquareGridConfig = {
    size: 10.0,
    gap: 2.0,
    padding: -2.0,
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
      pixelOriginSize * 0.2, pixelOriginSize,
      0.0, 0.7,
      2.0, easeInOutSine
    ),
  );

  yield* beginSlide("Check pixel distance from circle center");

  yield* all(
    pixelGrid[0][0].scale(2.0, 0.6, easeInOutCubic),
    pixelGrid[0][0].opacity(1.0, 0.6, easeInOutCubic),
  );
});
