import { COLOR } from "../styles";
import { rectScaleReview } from "../utils/anim_util"
import { SquareGridConfig, createSquareGrid, animSquareGrid } from "../utils/grid_util";

import { Line, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, delay, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutSine } from "@motion-canvas/core/lib/tweening";
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
    rectScaleReview(shaderRect, 0.6, 0.9, easeInOutCubic),
    // shaderRect.size(deviceRectSize, 0.6, easeInOutCubic),
    shaderRect.opacity(1.0, 0.6, easeInOutCubic),
    shaderTxt.text("Shader", 0.6, easeInOutCubic),
  );

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
  );

  yield* beginSlide("Show GPU device");

  const gpuDevice: Rect = new Rect({
    x: 400.0,
    size: 800.0,
    radius: 50.0,
    fill: COLOR.GREEN,
    opacity: 0.0,
  });

  const gpuTxt: Txt = new Txt({
    // y: -gpuDevice.size.y() * 0.5 - 50.0,
    scale: 0.3,
    fill: COLOR.BLACK,
  });

  view.add(gpuDevice);
  gpuDevice.add(gpuTxt);

  yield* shaderRect.position(shaderRect.position().sub(new Vector2(500.0, 300.0)), 0.6);
  yield* all(
    rectScaleReview(gpuDevice, 0.6, 0.9, easeInOutCubic),
    gpuTxt.text("GPU", 0.6),
  )

  const gridConfig0: SquareGridConfig = {
    size: 4,
    gap: 30,
    padding: 100,
  };
  const gridConfig1: SquareGridConfig = {
    size: 6,
    gap: 20,
    padding: 100,
  };

  const gridConfig: SquareGridConfig = {
    size: 11,
    gap: 10,
    padding: 100,
  };

  const cores0: Rect[][] = createSquareGrid(gridConfig0, COLOR.BLACK, gpuDevice);
  const cores1: Rect[][] = createSquareGrid(gridConfig1, COLOR.BLACK, gpuDevice);
  const cores: Rect[][] = createSquareGrid(gridConfig, COLOR.BLACK, gpuDevice);
  const corePrograms: Rect[][] = createSquareGrid(gridConfig, COLOR.BLACK, gpuDevice);
  const coreInputs: Rect[][] = createSquareGrid(gridConfig, COLOR.BLACK, gpuDevice);
  const coreOutputs: Rect[][] = createSquareGrid(gridConfig, COLOR.BLACK, gpuDevice);

  const invGridSize = 1.0 / gridConfig.size;

  for (var x = 0; x < gridConfig.size; x++) {
    for (var y = 0; y < gridConfig.size; y++) {
      const coreProg: Rect = corePrograms[x][y];
      const coreIn: Rect = coreInputs[x][y];
      const coreOut: Rect = coreOutputs[x][y];

      const uv: Vector2 = new Vector2(x * invGridSize, 1.0 - y * invGridSize);
      const dist: number = uv.sub(0.5).magnitude;

      const uvColor: Vector2 = new Vector2(Math.trunc(uv.x * 255), Math.trunc(uv.y * 255));
      const distColor: number = Math.trunc(dist * 255);

      coreProg.fill(COLOR.BLUE);
      coreIn.fill(`rgb(${uvColor.x}, ${uvColor.y}, 0)`);
      coreOut.fill(`rgb(${distColor}, ${distColor}, ${distColor})`);

      // coreProg.opacity(1.0);

      gpuDevice.add(coreProg);
      gpuDevice.add(coreIn);
      gpuDevice.add(coreOut);
    }
  }

  const core0OriginSize: number = cores0[0][0].width();
  const core1OriginSize: number = cores1[0][0].width();
  const coreOriginSize: number = cores[0][0].width();

  yield* beginSlide("Show GPU cores0");

  yield* gpuTxt.text("", 0.4);
  yield* animSquareGrid(
    gridConfig0, cores0,
    core0OriginSize * 0.5, core0OriginSize,
    0.0, 1.0,
    1.0, easeInOutSine
  );

  yield* beginSlide("Show GPU cores1");

  yield* sequence(
    0.1,
    animSquareGrid(
      gridConfig0, cores0,
      core0OriginSize, core0OriginSize * 0.5,
      1.0, 0.0,
      1.0, easeInOutSine
    ),
    animSquareGrid(
      gridConfig1, cores1,
      core1OriginSize * 0.5, core1OriginSize,
      0.0, 1.0,
      1.0, easeInOutSine
    ),
  );

  yield* beginSlide("More cores final");

  yield* sequence(
    0.1,
    animSquareGrid(
      gridConfig1, cores1,
      core1OriginSize, core1OriginSize * 0.5,
      1.0, 0.0,
      1.0, easeInOutSine
    ),
    animSquareGrid(
      gridConfig, cores,
      coreOriginSize * 0.5, coreOriginSize,
      0.0, 1.0,
      1.0, easeInOutSine
    ),
  );

  yield* beginSlide("Show GPU programs");

  yield* animSquareGrid(
    gridConfig, corePrograms,
    coreOriginSize * 0.2, coreOriginSize * 0.7,
    0.0, 0.7,
    2.0, easeInOutSine
  );

  // create input rect
  const inputRect: Rect = new Rect({
    x: shaderRect.position.x,
    y: -340.0,
    size: 140.0,
    radius: 30.0,
    fill: "rgb(200, 200, 0)",
    opacity: 0.0,
  });
  const inputTxt: Txt = new Txt({
    scale: 0.12,
    fill: COLOR.BLACK,
  });
  const inputLine: Line = new Line({
    x: shaderRect.position.x,
    y: -250.0,
    lineWidth: 10.0,
    stroke: COLOR.WHITE,
    points: [
      [0.0, 0.0],
      [0.0, 80.0],
    ],
    end: 0.0,
    endArrow: true,
    arrowSize: 0.0,
  });

  inputRect.add(inputTxt);
  view.add(inputLine);
  view.add(inputRect);

  // create output rect
  const outputRect: Rect = new Rect({
    x: shaderRect.position.x,
    y: 340.0,
    size: 140.0,
    radius: 30.0,
    fill: COLOR.WHITE,
    opacity: 0.0,
  });
  const outputTxt: Txt = inputTxt.clone();
  const outputLine: Line = inputLine.clone();
  outputLine.position.x(inputLine.position.x());
  outputLine.position.y(170.0);

  outputRect.add(outputTxt);
  view.add(outputLine);
  view.add(outputRect);

  yield* beginSlide("Add input to shader");

  yield* shaderRect.position.y(0.0, 0.6, easeInOutCubic);
  yield* all(
    rectScaleReview(inputRect, 0.6, 0.9, easeInOutCubic),
    inputTxt.text("Input", 0.6),
    delay(
      0.3,
      sequence(
        0.1,
        inputLine.end(1.0, 0.6),
        inputLine.arrowSize(20.0, 0.6),
      )
    ),
  );

  yield* beginSlide("Show GPU inputs");

  yield* animSquareGrid(
    gridConfig, coreInputs,
    coreOriginSize * 0.2, coreOriginSize * 0.7,
    0.0, 1.0,
    2.0, easeInOutSine
  );

  yield* beginSlide("Add output from shader");

  yield* all(
    delay(
      0.3,
      all(
        rectScaleReview(outputRect, 0.6, 0.9, easeInOutCubic),
        outputTxt.text("Output", 0.6),
      )
    ),
    sequence(
      0.1,
      outputLine.end(1.0, 0.6),
      outputLine.arrowSize(20.0, 0.6),
    )
  );

  yield* beginSlide("Show GPU outputs");

  yield* animSquareGrid(
    gridConfig, coreOutputs,
    coreOriginSize * 0.2, coreOriginSize * 0.72,
    0.0, 1.0,
    2.0, easeInOutSine
  );
});
