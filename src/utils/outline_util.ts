import { Layout, Txt, Rect } from "@motion-canvas/2d/lib/components";
import { all } from "@motion-canvas/core/lib/flow";

import { COLOR } from "../styles"
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

function createOutlineRect(text: string) {
  return new Rect({
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
}

var outlineTitle: Txt;
var outlineRects: Rect[];
var outlineLayout: Layout;

async function setup() {
  outlineTitle = new Txt({
    scale: 0.3,
    position: new Vector2(-500.0, -400.0),
    fill: COLOR.WHITE,
    text: "Beauty of Shaders"
  });

  outlineRects = new Array<Rect>(
    createOutlineRect("What are shaders anyway?"),
    // #1: What is a Shader? (definition)
    // #2: Types of Shaders

    // column 1
    // graphics pipeline specific shaders
    // rasterizer: fragment shader, vertex shader, geometry shader, tesselation shader
    // ray tracing: ray generation shader, hit/miss shader

    // column 2
    // compute shaders (GPGPU) -> can be used for non graphics related stuff (e.g. physics simulation)

    createOutlineRect("Introduction to shaders"),
    // #0: Why do we need parallelism?
    // #1: Graphics pipeline
    // #2: Coordinate systems
    // #3: Basic mesh concepts
    // #4: Vertex & fragment shaders

    createOutlineRect("Writing your first shader!"),

    createOutlineRect("Debugging & what's next?"),
    // https://developer.nvidia.com/gpugems/gpugems/contributors
    // https://www.realtimerendering.com/raytracinggems/
  );

  outlineLayout = new Layout({
    layout: true,
    direction: "row",
    padding: 100,
    paddingTop: 240,
    width: "100%",
    height: "100%",

    children: [
      new Layout({
        layout: true,
        direction: "column",
        width: "30%",
        height: "100%",
        gap:10,
      }),
    ],
  });

  const innerOutlineLayout = outlineLayout.children()[0];

  for (var o = 0; o < outlineRects.length; o++) {
    innerOutlineLayout.add(outlineRects[o]);
  }
}

function* focusOnOutlineIndex(index: number, duration: number, scale: number) {
  const focusRect: Rect = outlineRects[index];

  yield* all(
    focusRect.opacity(1.0, duration, easeInOutCubic),
    focusRect.scale(scale, duration, easeInOutCubic),

    ...outlineRects.slice(0, index).map((content) =>
      all(
        content.opacity(0.4, duration, easeInOutCubic),
        content.scale(1.0, duration, easeInOutCubic),
      )
    ),
    ...outlineRects.slice(index + 1).map((content) =>
      all(
        content.opacity(0.4, duration, easeInOutCubic),
        content.scale(1.0, duration, easeInOutCubic),
      )
    ),
  );
}

export { setup, focusOnOutlineIndex, outlineTitle, outlineRects, outlineLayout };
