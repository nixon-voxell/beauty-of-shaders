import {COLOR} from "../styles"

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import {Rect, Txt} from "@motion-canvas/2d/lib/components";
import {beginSlide, createRef} from "@motion-canvas/core/lib/utils";
import {all} from "@motion-canvas/core/lib/flow";
import {easeInOutCubic, easeInOutQuart, easeInOutQuint} from "@motion-canvas/core/lib/tweening";
import { Color, Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
});
