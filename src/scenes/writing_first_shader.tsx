import { COLOR } from "../styles"
import { Three } from "../components/Three"
import * as write_shader from "./three/write_shader"
import { OutlineContent, setup, focusOnOutlineIndex } from "../utils/outline_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import * as THREE from "three";
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
  const outlineCont: OutlineContent = setup();

  outlineCont.outlineTitle.zIndex(-1);
  outlineCont.outlineLayout.zIndex(-1);
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
    zIndex: -1,
  });

  view.add(transCircle);

  transCircle.absolutePosition(outlineCont.outlineRects[1].absolutePosition());

  yield* all(
    transCircle.size(0.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
  );

  yield* beginSlide("Focus on 'Writing your first shader!'");

  yield* focusOnOutlineIndex(outlineCont, 2, 0.6, 1.2);

  yield* beginSlide("Show resultant shader");

  transCircle.absolutePosition(outlineCont.outlineRects[2].absolutePosition());

  write_shader.setupScene();
  const uniforms = write_shader.planeMesh.material.uniforms;

  const threeRect: Rect = new Rect({
    x: 300.0,
    size: view.size(),
    scale: 0.2,
    lineWidth: 20.0,
    stroke: COLOR.WHITE_SHADOW,
    shadowColor: COLOR.BLUE_SHADOW,
    shadowBlur: 40.0,
    fill: COLOR.BLACK,
    opacity: 0.0,
    zIndex: -1,
  })
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
  view.add(threeRect);

  yield* all(
    three.scale(0.4, 0.6, easeInOutCubic),
    three.opacity(1.0, 0.6, easeInOutCubic),
    threeRect.scale(0.4, 0.6, easeInOutCubic),
    threeRect.opacity(1.0, 0.6, easeInOutCubic),
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
    all(
      threeRect.position(threeRect.position().add(new Vector2(230.0, -200.0)), 1.0, easeInOutCubic),
      three.position(three.position().add(new Vector2(230.0, -200.0)), 1.0, easeInOutCubic),
    ),
  );

  const codeRect: Rect = new Rect({
    x: -400.0,
    scale: 0.5,
    size: new Vector2(1020.0, 900.0),
    radius: 60.0,
    fill: COLOR.DARK_SHADOW,
    lineWidth: 4.0,
    stroke: COLOR.WHITE_SHADOW,
    opacity: 0.0,
  });
  const code: CodeBlock = new CodeBlock({
    x: -codeRect.size().x * 0.5 + codeRect.radius().x * 0.2,
    y: -codeRect.size().y * 0.5 + codeRect.radius().y * 0.5,
    scale: 0.1,
    offset: new Vector2(-1, -1),
    language: "glsl",
    code: `
    precision mediump float;
    
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`,
  });

  codeRect.add(code);
  view.add(codeRect);

  yield* beginSlide("Show code");

  yield* chain(
    sequence(
      0.1,
      tween(0.6, value => {
        value = easeInOutCubic(value);

        uniforms.resultOpacity.value = 1.0 - value;
        uniforms.colorOpacity.value = value;
      }),
      all(
        codeRect.scale(1.0, 0.6, easeInOutCubic),
        codeRect.opacity(1.0, 0.6, easeInOutCubic),
      ),
    ),
  );

  yield* beginSlide("Change to cyan");

  var s0: number = 22;

  yield* all(
    code.selection(
      [
        [[3, s0], [3, s0 + 3]],
      ],
      0.6, easeInOutCubic
    ),
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus = 1.0 - value;

      uniforms.color.value = new THREE.Vector3(oneMinus, 1.0, 1.0);
      code.code(`
        precision mediump float;
        
        void main() {
          gl_FragColor = vec4(${oneMinus.toFixed(1)}, 1.0, 1.0, 1.0);
        }`
      )
    }),
  );

  yield* beginSlide("Change to green");

  s0 = 32;

  yield* all(
    code.selection(
      [
        [[3, s0], [3, s0 + 3]],
      ],
      0.6, easeInOutCubic
    ),
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus = 1.0 - value;

      uniforms.color.value = new THREE.Vector3(0.0, 1.0, oneMinus);
      code.code(`
        precision mediump float;
        
        void main() {
          gl_FragColor = vec4(0.0, 1.0, ${oneMinus.toFixed(1)}, 1.0);
        }`
      )
    }),
  );

  yield* beginSlide("Insert time");

  yield* code.edit(1.0, true)`
  precision mediump float;${insert("\nuniform float time;")}
  
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }`;

  yield* beginSlide("Add sinTime");

  yield* code.edit(1.0, true)`
  precision mediump float;
  uniform float time;
  
  void main() {${insert(`\n  float sinTime = sin(time);\n`)}
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }`;

  yield* beginSlide("Replace FragColor with sinTime");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {
  float sinTime = sin(time);

  gl_FragColor = vec4(${edit("0.0, 1.0, 0.0", "vec3(sinTime)")}, 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.colorOpacity.value = oneMinus;
      uniforms.sinTimeOpacity.value = value;
    }),
  );

  yield* beginSlide("Scale sinTime");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {
  float sinTime = sin(time);
  ${insert("float scaledSinTime = (sinTime + 1.0) * 0.5;\n")}
  gl_FragColor = vec4(vec3(${edit("sinTime", "scaledSinTime")}), 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.sinTimeOpacity.value = oneMinus;
      uniforms.scaledSinTimeOpacity.value = value;
    }),
  );

  yield* beginSlide("Mix scaledSinTime");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {
  float sinTime = sin(time);
  float scaledSinTime = (sinTime + 1.0) * 0.5;${insert("\n  float mixTime = mix(0.2, 0.3, scaledSinTime);")}

  gl_FragColor = vec4(vec3(${edit("scaledSinTime", "mixTime")}), 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.scaledSinTimeOpacity.value = oneMinus;
      uniforms.mixTimeOpacity.value = value;
    }),
  );

  yield* beginSlide("Comment out sinTime");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {
  ${insert("// ")}float sinTime = sin(time);
  ${insert("// ")}float scaledSinTime = (sinTime + 1.0) * 0.5;
  ${insert("// ")}float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(vec3(mixTime), 1.0);
}`,
  );

  yield* beginSlide("Display FragCoord.xy");

  uniforms.shiftCoord.value = new THREE.Vector2(0.0, 0.0);

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {
  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(${edit("vec3(mixTime),", "gl_FragCoord.xy, 0.0,")} 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.scaledSinTimeOpacity.value = oneMinus;
      uniforms.shiftedCoordOpacity.value = value;
    }),
  );

  yield* beginSlide("Create shiftedCoord variable");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;

void main() {${insert("\n  vec2 shiftedCoord = gl_FragCoord.xy;\n")}
  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(${edit("gl_FragCoord.xy", "shiftedCoord")}, 0.0, 1.0);
}`,
  );

  yield* beginSlide("Add resolution");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;${insert("\nuniform vec2 resolution;")}

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy;

  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(shiftedCoord, 0.0, 1.0);
}`,
  );

  yield* beginSlide("Setup shift coordinate");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy${insert(" - vec2(0.0, 0.0) * resolution")};

  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(shiftedCoord, 0.0, 1.0);
}`,
  );

  const shiftCoord: SimpleSignal<Vector2> = createSignal(new Vector2(0.0, 0.0));

  code.code(() => `
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy - vec2(${shiftCoord().x.toFixed(1)}, ${shiftCoord().y.toFixed(1)}) * resolution;

  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(shiftedCoord, 0.0, 1.0);
}`)

  yield* beginSlide("Shift coordinate right");

  yield* all(
    shiftCoord(new Vector2(0.5, 0.0), 1.0, easeInOutCubic),
    tween(1.0, _ => {
      uniforms.shiftCoord.value = shiftCoord();
    }),
  );

  yield* beginSlide("Shift coordinate up");

  yield* all(
    shiftCoord(new Vector2(0.5, 0.5), 1.0, easeInOutCubic),
    tween(1.0, _ => {
      uniforms.shiftCoord.value = shiftCoord();
    }),
  );

  yield* beginSlide("Create uniformCoord variable");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy - vec2(0.5, 0.5) * resolution;${insert("\n  vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);")}

  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(${edit("shiftedCoord", "uniformCoord")}, 0.0, 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.shiftedCoordOpacity.value = oneMinus;
      uniforms.uniformCoordOpacity.value = value;
    }),
  );

  yield* beginSlide("View length of uniformCoord");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy - vec2(0.5, 0.5) * resolution;
  vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);${insert("\n  float uniformCoordLength = length(uniformCoord);")}

  // float sinTime = sin(time);
  // float scaledSinTime = (sinTime + 1.0) * 0.5;
  // float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(${edit("uniformCoord", "uniformCoordLength")}, 0.0, 1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.uniformCoordOpacity.value = oneMinus;
      uniforms.uniformCoordLenOpacity.value = value;
    }),
  );

  yield* beginSlide("Uncomment sinTime");

  yield* all(
    code.selection(
      [
        [[9, 0], [9, 100]],
        [[10, 0], [10, 100]],
        [[11, 0], [11, 100]]
      ],
      0.6, easeInOutCubic
    ),
    code.edit(1.0, false)`
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy - vec2(0.5, 0.5) * resolution;
  vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);
  float uniformCoordLength = length(uniformCoord);

  ${remove("// ")}float sinTime = sin(time);
  ${remove("// ")}float scaledSinTime = (sinTime + 1.0) * 0.5;
  ${remove("// ")}float mixTime = mix(0.2, 0.3, scaledSinTime);

  gl_FragColor = vec4(uniformCoordLength, 0.0, 1.0);
}`,
  );

  yield* beginSlide("Insert division");

  yield* all(
    code.edit(1.0, true)`
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 shiftedCoord = gl_FragCoord.xy - vec2(0.5, 0.5) * resolution;
  vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);
  float uniformCoordLength = length(uniformCoord);

  float sinTime = sin(time);
  float scaledSinTime = (sinTime + 1.0) * 0.5;
  float mixTime = mix(0.2, 0.3, scaledSinTime);${insert("\n\n  float div = mixTime / uniformCoordLength;")}

  gl_FragColor = vec4(${edit("uniformCoordLength", "vec3(div)")}, ${remove("0.0, ")}1.0);
}`,
    tween(1.0, value => {
      value = easeInOutCubic(value);
      const oneMinus: number = 1.0 - value;

      uniforms.uniformCoordLenOpacity.value = oneMinus;
      uniforms.resultOpacity.value = value;
    }),
  );

  yield* beginSlide("Reveal entire code");

  yield* code.selection(DEFAULT, 0.6, easeInOutCubic);

  yield* beginSlide("Fade out");

  yield* chain(
    all(
      codeRect.scale(0.8, 0.6, easeInOutCubic),
      codeRect.opacity(0.0, 0.6, easeInOutCubic),

      threeRect.opacity(0.0, 0.6, easeInOutCubic),
      tween(0.6, value => {
        value = easeInOutCubic(value);
        const oneMinus = 1.0 - value;

        uniforms.opacity.value = oneMinus;
      }),
    ),

    // return to outline
    all(
      transCircle.size(0.0, 2.0, easeInOutCubic),
      transCircle.lineWidth(2.0, 2.0, easeInOutCubic),
    ),
  );

  yield* beginSlide("Focus on 'Debugging & what's next?'")

  yield* focusOnOutlineIndex(outlineCont, 3, 0.6, 1.2);

  transCircle.absolutePosition(outlineCont.outlineRects[3].absolutePosition());

  yield* beginSlide("Circle zoom in transition")

  yield* all(
    transCircle.size(view.size.x() * 2.0, 2.0, easeInOutCubic),
    transCircle.lineWidth(20.0, 2.0, easeInOutCubic),
  );
});
