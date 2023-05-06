import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {CubicBezier} from '@motion-canvas/2d/lib/components';
import {beginSlide, createRef} from '@motion-canvas/core/lib/utils';

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const bezier = createRef<CubicBezier>();

  view.add(
    <CubicBezier
      ref={bezier}
      lineWidth={6}
      stroke={'lightseagreen'}
      p0={[-200, -70]}
      p1={[120, -120]}
      p2={[-120, 120]}
      p3={[200, 70]}
      end={0}
    />,
  );

	yield* beginSlide("Draw GPU");
  yield* bezier().end(1, 1);
  yield* bezier().start(1, 1).to(0, 1);
});
