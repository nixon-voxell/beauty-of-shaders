import {makeScene2D} from "@motion-canvas/2d/lib/scenes";
import {
  Layout, Txt, Rect
} from "@motion-canvas/2d/lib/components";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import { all, sequence } from "@motion-canvas/core/lib/flow";

import {COLOR} from "../styles"
import { Vector2 } from "@motion-canvas/core/lib/types";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const title = createRef<Txt>();
  const outlineLayout = createRef<Layout>();

  view.add(
    <>
      <Txt
        ref={title}
        scale={0.3}
        y={-400.0}
        fill={COLOR.WHITE}
      >
        Beauty of Shaders
      </Txt>

      <Layout layout
        ref={outlineLayout}
        direction={"column"}
        gap={10}
        padding={100}
        paddingTop={240}
        width={"40%"}
        height={"100%"}
      >
      </Layout>
    </>
  );

  function createContentRect(text: string) {
    return new Rect({
      width: "100%",
      height: "100%",
      // fill: COLOR.TRANSPARENT,

      children: [
        new Rect({
              width: "100%",
              height: "100%",
              fill: COLOR.LIGHT_BLUE,
              radius: 10,

              children: [
                new Txt({
                  layout: false,
                  text: text,
                  scale: 0.12,
                  fill: COLOR.BLACK,
                })
              ],
            })
      ],
    })
  }

  const contents: Rect[] = new Array<Rect>(
    createContentRect("Coordinate Systems").children()[0] as Rect,
    createContentRect("Basic Mesh Concepts").children()[0] as Rect,
    createContentRect("Graphics Pipeline").children()[0] as Rect,
    createContentRect("Vertex & Fragment Shaders").children()[0] as Rect,
    createContentRect("Writing your First Shader").children()[0] as Rect,
    createContentRect("Debugging Shaders").children()[0] as Rect,
    createContentRect("What's Next").children()[0] as Rect,
  );

  const contentSizes: Vector2[] = new Array<Vector2>();

  for (let c = 0; c < contents.length; c++) {
    outlineLayout().add(contents[c]);
    contentSizes.push(contents[c].scale());
  }

  for (let c = 0; c < contents.length; c++) {
    contents[c].scale(new Vector2(0.6, 0.8));
    contents[c].opacity(0.0);
  }

  //.one by one animation
  // for (let c = 0; c < contents.length; c++) {
  //   yield* beginSlide("Content #" + c)

  //   const content = contents[c];
  //   yield* all(
  //     content.scale(contentSizes[c], 0.6, easeInOutCubic),
  //     content.opacity(1.0, 0.6, easeInOutCubic),
  //   )
  // }

  yield* beginSlide("Outline")

  yield* sequence(
    0.1,
    ...contents.map((content, i) =>
      all(
        content.scale(contentSizes[i], 0.6, easeInOutCubic),
        content.opacity(1.0, 0.6, easeInOutCubic),
      )
    ),
  );

  yield* beginSlide("Focus on Coordinate Systems");

  yield* all(
    contents[0].scale(1.5, 0.6, easeInOutCubic),
    sequence(
      0.1,
      ...contents.slice(1).map((content) =>
        all(
          content.scale(new Vector2(0.6, 0.8), 0.4, easeInOutCubic),
          content.opacity(0.0, 0.4, easeInOutCubic),
        )
      ),
    ),
    title().opacity(0.0, 0.6),
    title().scale(0.1, 0.6),
  );

  const content0 = contents[0];
  const content0Pos = content0.absolutePosition();
  const content0Size = content0.size();

  content0.layout(false);
  content0.absolutePosition(content0Pos);
  content0.size(content0Size);

  yield* beginSlide("Move to top right");

  yield* all(
    content0.position(new Vector2(-700.0, -400.0), 0.6, easeInOutCubic),
    content0.size(new Vector2(320.0, 80.0), 0.6),
    content0.scale(1.0, 0.6),
    content0.children()[0].scale(0.1, 0.6),
  )
});
