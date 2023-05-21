import { COLOR } from "../styles"

import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Rect } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, loop, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, tween } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { CodeBlock, edit, insert, remove } from "@motion-canvas/2d/lib/components/CodeBlock";
import { createSignal, DEFAULT, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
});
