import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle} from '@motion-canvas/2d/lib/components';
import {createRef, beginSlide} from '@motion-canvas/core/lib/utils';
import {all, sequence} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();

  view.add(
    <Circle
      ref={myCircle}
      // try changing these properties:
      x={-300}
      width={140}
      height={140}
      fill="#e13238"
    />,
  );

  yield* beginSlide("#1");
  yield* all(
    myCircle().position.x(300, 1),
    myCircle().fill("#e6a700", 1),
  );

  yield* beginSlide("#2");
  yield* all(
    myCircle().position.x(-300, 1),
    myCircle().fill("#e13238", 1),
  );
});
