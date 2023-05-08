import { COLOR } from "../styles"
import { outlineRects, outlineLayout, setup, focusOnOutlineIndex, outlineTitle } from "../utils/outline_util";
import {
  ContentRectConfig, VertContentRect,
  createVertContentRects,
  moveVertContentRects, fadeVertContentRects,
  sameTxtVertContentRects, changeTxtVertContentRects, focusIdxVertContentRects
} from "../utils/rect_util";

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  yield setup();

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
    transCircle.size(0.0, 2.0, easeInOutCubic),
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
    radius: 20.0,
    gap: 24.0,
    fill: COLOR.WHITE,
    txtScale:0.12,
    txtFill: COLOR.BLACK,
  }

  const topicLayout: Layout = new Layout({
    position: new Vector2(280.0, -320.0),
  });

  const topicRects: VertContentRect = createVertContentRects(
    topics, topicConfig, 1.0, topicLayout
  );

  view.add(topicLayout);

  yield* fadeVertContentRects(
    topicRects, 0.0,
    0.0, 0.0
  );

  yield* sameTxtVertContentRects(
    topicRects, "",
    0.0, 0.0
  )

  yield* beginSlide("Show subtopics");

  yield* all(
    moveVertContentRects(
      topicRects, new Vector2(0.0, 40.0),
      0.6, 0.15, easeInOutCubic
    ),
    fadeVertContentRects(
      topicRects, 1.0,
      0.6, 0.15, easeInOutCubic
    ),
    changeTxtVertContentRects(
      topicRects, topics,
      0.6, 0.15, easeInOutCubic
    ),
  );

  yield* beginSlide("Focus on '#0'");

  yield* focusIdxVertContentRects(
    topicRects, 0, 0.4, 1.4,
    0.6, easeInOutCubic
  );
});
