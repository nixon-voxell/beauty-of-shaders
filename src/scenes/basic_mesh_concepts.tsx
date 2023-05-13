import { COLOR } from "../styles"
import {
  ContentRectConfig, ContentRect, createContentRect,
  scaleContentRect, fadeContentRect, moveContentRect
} from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Grid, Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuart, tween} from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const titleCont: ContentRect = createTitleCont("1. Coordinate systems", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "2. Basic mesh concepts");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);
});
