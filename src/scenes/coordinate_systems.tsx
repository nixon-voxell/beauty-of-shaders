import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import {
  Layout, Txt, Rect
} from "@motion-canvas/2d/lib/components";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import { all, sequence, waitFor } from "@motion-canvas/core/lib/flow";

import {COLOR} from "../styles"
import { Vector2 } from "@motion-canvas/core/lib/types";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  view.add(
    <>
      <Rect
        position={new Vector2(-700.0, -400.0)}
        size={new Vector2(320.0, 80.0)}
        fill={COLOR.LIGHT_BLUE}
        radius={10.0}
      >
        <Txt
          scale={0.1}
        >
          Coordinate Systems
        </Txt>
      </Rect>
    </>
  );

  yield* beginSlide("test");
  yield* waitFor(2.0);
});
