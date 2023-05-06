import { COLOR } from "../styles";
import { rectScaleReview } from "../utils/anim_util"

import { Rect, Txt } from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { beginSlide, useRandom } from "@motion-canvas/core/lib/utils";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const random = useRandom();

  const shaderRect: Rect = new Rect({
    size: new Vector2(240.0, 300.0),
    radius: 50.0,
    fill: COLOR.BLUE,
    opacity: 0.0,
  });

  const shaderTxt: Txt = new Txt({
    scale: 0.15,
    fill: COLOR.BLACK,
  });

  view.add(shaderRect);
  shaderRect.add(shaderTxt);

	yield* beginSlide("Draw shader rect");

  yield* all (
    rectScaleReview(shaderRect, 0.6, easeInOutCubic),
    // shaderRect.size(deviceRectSize, 0.6, easeInOutCubic),
    shaderRect.opacity(1.0, 0.6, easeInOutCubic),
    shaderTxt.text("Shader", 0.6, easeInOutCubic),
  );

  // yield* beginSlide("Draw shader lines");

  const lineRect: Rect = new Rect({
    size: new Vector2(0.0, 20.0),
    radius: 4.0,
    fill: COLOR.BLACK,
  });

  const lineCount: number = 5;
  const lineGap: number = 32.0;
  const minLineLength: number = 50.0;
  const maxLineLength: number = 140.0;
  const lineRects: Rect[] = new Array<Rect>();
  const lineLengths: number[] = random.floatArray(lineCount, minLineLength, maxLineLength);

  for (var l = 0; l < lineCount; l++) {
    const line: Rect = lineRect.clone();
    lineRects.push(line);
    shaderRect.add(line);

    // move to animation start position
    line.position.x(-lineLengths[l] / 2);
    line.position.y(-30.0 + lineGap * l);
  }

  yield* shaderTxt.position.y(shaderTxt.position.y() - 80.0, 0.6),
  yield* sequence(
    0.1,
    ...lineRects.map((line, index) =>
      all(
        line.size.x(lineLengths[index], 0.4, easeInOutCubic),
        line.position.x(0.0 - (maxLineLength - lineLengths[index]) * 0.5, 0.4, easeInOutCubic),
      )
    )
  )

  yield* beginSlide("");

  const gpuDevice: Rect = new Rect({
    x: 400.0,
    size: 800.0,
    radius: 50.0,
    fill: COLOR.GREEN,
    opacity: 0.0,
  });

  const gpuTxt: Txt = new Txt({
    scale: 0.3,
    fill: COLOR.BLACK,
  });

  view.add(gpuDevice);
  gpuDevice.add(gpuTxt);

  yield* shaderRect.position(shaderRect.position().sub(new Vector2(700.0, 300.0)), 0.6);
  yield* all(
    rectScaleReview(gpuDevice, 0.6, easeInOutCubic),
    gpuTxt.text("GPU", 0.6),
  )

  yield* beginSlide("");
});
