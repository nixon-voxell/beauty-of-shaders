import { COLOR } from "../styles"
import { outlineRects, outlineLayout, setup, focusOnOutlineIndex, outlineTitle } from "../utils/outline_util";
import {
  ContentRectConfig, VertContentRect,
  createVertContentRects,
  moveVertContentRects, fadeVertContentRects,
  sameTxtVertContentRects, changeTxtVertContentRects, focusIdxVertContentRects, scaleVertContentRects
} from "../utils/rect_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, delay, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuint } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

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

  yield* beginSlide("Circle zoom in transition");

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
        rect0.size(rect0.size().mul(0.8), 0.6, easeInOutCubic),
        rect0.position(new Vector2(-1000.0, 0.0), 0.6, easeInOutCubic),

        txt0.scale(0.1, 0.6, easeInOutCubic),
      )
    ),
  );
});
