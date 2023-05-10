import {COLOR} from "../styles"

import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import {Rect, Txt} from "@motion-canvas/2d/lib/components";
import {beginSlide, createRef} from "@motion-canvas/core/lib/utils";
import {all} from "@motion-canvas/core/lib/flow";
import {easeInOutCubic, easeInOutQuart, easeInOutQuint} from "@motion-canvas/core/lib/tweening";
import { Color, Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const backdrop = createRef<Rect>();
  const title0 = createRef<Txt>();
  const title1 = createRef<Txt>();

  view.add(
    <>
      <Rect
        cache
        ref={backdrop}
        width={"60%"}
        height={"0%"}
        fill={COLOR.GREEN}
        radius={40}
        smoothCorners
        opacity={0.0}
      >
      </Rect>
      <Txt
        ref={title0}
        scale={0.3}
        opacity={0.0}
        fill={COLOR.BLACK}
      >
        Coding Adventure
      </Txt>
      <Txt
        ref={title1}
        scale={0.3}
        opacity={0.0}
        fill={COLOR.BLACK}
      >
        Beauty of Shaders
      </Txt>
    </>
  );

  const title0OriginPos = title0().position();
  const title1OriginPos = title1().position();

  yield* beginSlide("Coding Adventure");

  yield* all(
    backdrop().opacity(1.0, 1.0, easeInOutQuart),
    backdrop().size.y("50%", 1.0, easeInOutQuart),
    title0().opacity(1.0, 1.0, easeInOutQuart),
  );

  yield* beginSlide("#1");

  yield* all(
    backdrop().size.x("65%", 1.0, easeInOutQuint),
    title0().text("Coding Adventure #1", 1.0),
  )

  yield* beginSlide("Beauty of Shaders")

  yield* all(
    backdrop().fill(COLOR.BLUE, 1.0, easeInOutCubic, Color.createLerp("lab")),
    title0().position.y(title0OriginPos.y - 100.0, 1.0, easeInOutQuint),
    title0().scale(0.2, 1.0, easeInOutQuint),
    title0().fill(COLOR.INDIGO, 1.0, easeInOutCubic, Color.createLerp("lab")),
    title1().opacity(1.0, 1.0, easeInOutQuint),
    title1().position.y(title1OriginPos.y + 50.0, 1.0, easeInOutQuint),
  );

  yield* beginSlide("Closing");

	yield* all(
    backdrop().size.x("50%", 0.6, easeInOutCubic),
    backdrop().size.y("30%", 0.6, easeInOutCubic),
    backdrop().opacity(0.0, 0.6, easeInOutCubic),
    title0().position(title0OriginPos, 0.6, easeInOutQuint),
    title0().opacity(0.0, 0.6, easeInOutQuint),
    title1().fill(COLOR.WHITE, 0.6, easeInOutCubic),
  );

  yield* title1().position(new Vector2(-500.0, -400.0), 1.0, easeInOutCubic);
});
