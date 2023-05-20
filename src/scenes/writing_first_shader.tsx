import { COLOR } from "../styles"
import { Three } from "../components/Three"
import * as write_shader from "./three/write_shader"

import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, loop, sequence, waitFor } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, tween } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { cancel, ThreadGenerator } from "@motion-canvas/core/lib/threading";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const outlineCont: OutlineContent = setup();

  view.add(outlineCont.outlineTitle);
  view.add(outlineCont.outlineLayout);

  yield* focusOnOutlineIndex(outlineCont, 1, 0.0, 1.2);

  const transCircle: Circle = new Circle({
    size: view.size.x() * 2.0,
    fill: COLOR.BLACK,
    stroke: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 100.0,
    lineWidth: 20.0,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineCont.outlineRects[1].absolutePosition());

  // yield* beginSlide("Transition to outline");

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Writing your first shader!'");

  yield* focusOnOutlineIndex(outlineCont, 2, 0.6, 1.2);

  yield* beginSlide("Show resultant shader");

  transCircle.absolutePosition(outlineCont.outlineRects[2].absolutePosition());

  write_shader.setupScene();

  const three: Three = new Three({
    x: 300.0,
    scale: 0.2,
    quality: 2,
    width: 1920,
    height: 1080,
    zoom: 1080,
    camera: write_shader.camera,
    scene: write_shader.threeScene,
    opacity: 0.0,
  });

  view.add(three);

  yield* all(
    three.scale(0.4, 0.6, easeInOutCubic),
    three.opacity(1.0, 0.6, easeInOutCubic),
  );

  const shaderLoopTask: ThreadGenerator = yield loop(
    Infinity,
    () => {
      write_shader.planeMesh.material.uniforms.utime.value += 0.016;
    }
  );

  yield* beginSlide("Focus into 'Writing your first shader!'");

  yield* sequence(
    0.3,
    all(
      transCircle.size(view.size.x() * 2.0, 2.0, easeInOutCubic),
      transCircle.lineWidth(20.0, 2.0, easeInOutCubic),
    ),
   three.position(three.position().add(200.0), 1.0, easeInOutCubic),
  );
});
