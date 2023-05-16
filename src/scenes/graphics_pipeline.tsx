import { COLOR } from "../styles"
import { ContentRect, ContentRectConfig, createContentRect, fadeContentRect, scaleContentRect, } from "../utils/rect_util";
import { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft } from "../utils/subtopic_util";
import { createSquareGrid, SquareGridConfig } from "../utils/grid_util";
import { BarConfig, BarGroup, createBarGroup, animateBarGroup } from "../utils/bar_util";

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Circle, Layout, Line, Ray, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide, useRandom } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutExpo, easeInOutSine, map, TimingFunction, tween } from "@motion-canvas/core/lib/tweening";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { createSignal, SimpleSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);
  const random = useRandom(7919);

  const titleCont: ContentRect = createTitleCont("1. Basic mesh concepts", view);

  yield* beginSlide("Change title");

  yield* changeTitleAtCenter(titleCont, "2. Graphics pipeline");

  yield* beginSlide("Move title to top left");

  yield* moveTitleToTopLeft(titleCont);

  const size: SimpleSignal<number> = createSignal(190.0);
  const points: SimpleSignal<PossibleVector2<number>>[] = new Array(4);
  points[0] = createSignal(() => new Vector2(-size(), -size()));
  points[1] = createSignal(() => new Vector2(size(), -size()));
  points[2] = createSignal(() => new Vector2(-size(), size()));

  const triangle: Line = new Line({
    lineJoin: "bevel",
    lineWidth: 4.0,
    points: points.slice(0, 3),
    closed: true,
    stroke: COLOR.WHITE,
    fill: COLOR.TRANSPARENT,
    end: 0.0,
  });

  const layoutQuad: Layout = new Layout({});
  layoutQuad.add(triangle);
  view.add(layoutQuad);

  yield* beginSlide("Draw triangle");

  yield* sequence(
    0.1,
    triangle.end(1.0, 0.6, easeInOutCubic),
    triangle.fill(COLOR.WHITE_SHADOW, 0.6, easeInOutCubic),
    size(200.0, 0.6, easeInOutCubic),
  );

  // create grid & animate half of it
  const pixelLayout: Layout = new Layout({
    position: layoutQuad.position(),
    size: size() * 2.0,
  });

  view.add(pixelLayout);
  const pixelConfig: SquareGridConfig = {
    size: 6,
    gap: 0.0,
    padding: 0.0,
    radius: 0.0,
  };
  const pixelGrid: Rect[][] = createSquareGrid(pixelConfig, COLOR.WHITE_SHADOW, pixelLayout);

  for (var x = 0; x < pixelConfig.size; x++) {
    for (var y = 0; y < pixelConfig.size; y++) {
      const pixel: Rect = pixelGrid[x][y];

      pixel.lineWidth(2.0);
      pixel.stroke(COLOR.WHITE);
    }
  }

  function* animHalfSquareGrid(
    gridConfig: SquareGridConfig, rects: Rect[][],
    startSize: number, endSize: number,
    startOpacity: number, endOpacity: number,
    duration: number, timingFunc: TimingFunction
  ) {
    yield* tween(
      duration, value => {
        const scaledValue = gridConfig.size * timingFunc(value);

        for (var x = 0; x < gridConfig.size; x++) {
          for (var y = 0; y < gridConfig.size; y++) {
            const rect: Rect = rects[x][y];

            // constraint value to between 0.0 and 1.0
            var localValue = scaledValue - x - y;
            if (localValue <= 0.0) continue;

            localValue = Math.min(Math.max(localValue, 0.0), 1.0);

            rect.size(map(startSize, endSize, localValue));
            rect.opacity(map(startOpacity, endOpacity, localValue));
          }
        }
      }
    );
  }

  const pixel00: Rect = pixelGrid[0][0];
  const pixelOriginSize: number = pixel00.width();

  yield* beginSlide("Rasterize triangle");

  yield* animHalfSquareGrid(
    pixelConfig, pixelGrid,
    pixelOriginSize * 0.6, pixelOriginSize,
    0.0, 1.0,
    1.0, easeInOutSine
  );

  const rasterizerTitle: Txt = new Txt({
    y: -300.0,
    scale: 0.1,
    fill: COLOR.WHITE,
    text: "Rasterizer",
    opacity: 0.0,
  });

  view.add(rasterizerTitle);

  yield* beginSlide("Show rasterizer title");

  yield* all(
    rasterizerTitle.scale(0.2, 0.6, easeInOutCubic),
    rasterizerTitle.opacity(1.0, 0.6, easeInOutCubic),
  );

  const canIMoveThisTxt: Txt = new Txt({
    y: -40.0,
    scale: 0.1,
    fill: COLOR.BLUE,
    text: "can I move this?",
  });
  const canIMoveThisPoint: Circle = new Circle({
    position: points[1],
    scale: 0.8,
    size: 40.0,
    fill: COLOR.BLUE,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,
    opacity: 0.0,
  });

  canIMoveThisPoint.add(canIMoveThisTxt);
  view.add(canIMoveThisPoint);

  yield* beginSlide("Prompt of moving a vertex");

  yield* chain(
    all(
      canIMoveThisPoint.scale(1.0, 0.6, easeInOutCubic),
      canIMoveThisPoint.opacity(1.0, 0.6, easeInOutCubic),
    ),
    points[1]((points[1]() as Vector2).addY(100.0), 1.0, easeInOutCubic).to(points[1](), 1.0, easeInOutCubic),
  );

  // create arrows from geometry to rasterize
  const geoToVert: Ray = new Ray({
    x: -560.0,
    lineWidth: 10.0,
    toX: 60.0,
    endArrow: true,
    arrowSize: 20.0,
    stroke: COLOR.WHITE,
    end: 0.0,
  });
  const vertToRast: Ray = geoToVert.clone();
  vertToRast.x(-200);

  view.add(geoToVert);
  view.add(vertToRast);

  // create vertex shader program
  const vertexRectConf: ContentRectConfig = {
    size: new Vector2(150.0, 180.0),
    gap: 0.0,
    radius: 40.0,
    fill: COLOR.YELLOW,
    txtFill: COLOR.BLACK,
    txtScale: 0.1,
  };
  const vertexCont: ContentRect = createContentRect(
    "Vertex", Vector2.left.scale(340.0), vertexRectConf, 0.0, view
  );
  vertexCont.txt.position.y(-40.0);
  yield* scaleContentRect(vertexCont, 0.8, 0.0);

  // create vertex shader program bars
  const vertexBarLayout: Layout = new Layout({
    position: new Vector2(-40.0, -10.0),
  });
  const vertexBarConf: BarConfig = {
    count: 5,
    gap: 6.0,
    height: 10.0,
    minLength: 40.0,
    maxLength: 90.0,
  }
  const vertexBarGroup: BarGroup = createBarGroup(
    vertexBarConf, COLOR.BLACK,
    random, vertexBarLayout
  );
  vertexCont.rect.add(vertexBarLayout);

  yield* beginSlide("Insert vertex shader");

  yield* chain(
    sequence(
      0.1,
      all(
        canIMoveThisPoint.scale(0.8, 0.4, easeInOutCubic),
        canIMoveThisPoint.opacity(0.0, 0.4, easeInOutCubic),
      ),
      all(
        triangle.scale(0.5, 0.6, easeInOutCubic),
        triangle.position.x(triangle.position.x() - 700.0, 0.6, easeInOutCubic),
      ),
      pixelLayout.scale(0.5, 0.6, easeInOutCubic),
    ),
    geoToVert.end(1.0, 0.6, easeInOutCubic),
    sequence(
      0.1,
      all(
        fadeContentRect(vertexCont, 1.0, 0.6, easeInOutCubic),
        scaleContentRect(vertexCont, 1.0, 0.6, easeInOutCubic),
      ),
      animateBarGroup(vertexBarGroup, 0.06, 0.4, easeInOutExpo),
    ),
    vertToRast.end(1.0, 0.6, easeInOutCubic),
  );

  yield* beginSlide("Pop rasterize");

  const scaleRatio: number = 1.3;

  yield* sequence(
    0.3,
    all(
      pixelLayout.scale(0.7, 1.0, easeInOutCubic),
      animHalfSquareGrid(
        pixelConfig, pixelGrid,
        pixelOriginSize, pixelOriginSize * scaleRatio,
        1.0, 0.8,
        1.0, easeInOutSine
      ),
    ),
    animHalfSquareGrid(
      pixelConfig, pixelGrid,
      pixelOriginSize * scaleRatio, pixelOriginSize,
      0.8, 1.0,
      1.0, easeInOutSine
    ),
    pixelLayout.scale(0.5, 0.6, easeInOutCubic),
  );

  // create arrows from geometry to rasterize
  const rastToFrag: Ray = geoToVert.clone();
  const fragToRender: Ray = geoToVert.clone();
  rastToFrag.x(140.0);
  rastToFrag.end(0.0);
  fragToRender.x(500.0);
  fragToRender.end(0.0);

  view.add(rastToFrag);
  view.add(fragToRender);

  // create fragment shader program
  const fragRectConf: ContentRectConfig = {
    size: new Vector2(150.0, 180.0),
    gap: 0.0,
    radius: 40.0,
    fill: COLOR.BLUE,
    txtFill: COLOR.BLACK,
    txtScale: 0.1,
  };
  const fragCont: ContentRect = createContentRect(
    "Fragment", Vector2.right.scale(340.0), fragRectConf, 0.0, view
  );
  fragCont.txt.position.y(-40.0);
  yield* scaleContentRect(fragCont, 0.8, 0.0);

  // create fragment shader program bars
  const fragBarLayout: Layout = new Layout({
    position: new Vector2(-40.0, -10.0),
  });
  const fragBarConf: BarConfig = {
    count: 5,
    gap: 6.0,
    height: 10.0,
    minLength: 50.0,
    maxLength: 80.0,
  }
  const fragBarGroup: BarGroup = createBarGroup(
    fragBarConf, COLOR.BLACK,
    random, fragBarLayout
  );
  fragCont.rect.add(fragBarLayout);

  const renderLayout: Layout = new Layout({
    x: 700.0,
    scale: 0.5,
    size: size() * 2.0,
  });
  view.add(renderLayout);

  const renderGrid: Rect[][] = createSquareGrid(pixelConfig, COLOR.WHITE_SHADOW, renderLayout);

  const invPixGridSize: number = 1.0 / pixelConfig.size;
  for (var x = 0; x < pixelConfig.size; x++) {
    for (var y = 0; y < pixelConfig.size; y++) {
      const pixel: Rect = renderGrid[x][y];

      const xColor: number = Math.trunc(x * invPixGridSize * 255);
      const yColor: number = Math.trunc(y * invPixGridSize * 255);
      pixel.fill(`rgb(255, ${xColor}, ${yColor})`);
    }
  }

  yield* beginSlide("Insert fragment shader");

  yield* chain(
    rastToFrag.end(1.0, 0.6, easeInOutCubic),
    sequence(
      0.1,
      all(
        fadeContentRect(fragCont, 1.0, 0.6, easeInOutCubic),
        scaleContentRect(fragCont, 1.0, 0.6, easeInOutCubic),
      ),
      animateBarGroup(fragBarGroup, 0.06, 0.4, easeInOutExpo),
    ),
    fragToRender.end(1.0, 0.6, easeInOutCubic),
    animHalfSquareGrid(
      pixelConfig, renderGrid,
      pixelOriginSize * 0.6, pixelOriginSize,
      0.0, 1.0,
      1.0, easeInOutSine
    ),
  );

  yield* beginSlide("Fade out scene");

  yield* sequence(
    0.05,
    all(
      triangle.scale(0.2, 0.6, easeInOutCubic),
      triangle.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      geoToVert.scale(0.8, 0.6, easeInOutCubic),
      geoToVert.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      vertexCont.rect.scale(0.8, 0.6, easeInOutCubic),
      vertexCont.rect.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      vertToRast.scale(0.8, 0.6, easeInOutCubic),
      vertToRast.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      pixelLayout.scale(0.2, 0.6, easeInOutCubic),
      pixelLayout.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      rastToFrag.scale(0.8, 0.6, easeInOutCubic),
      rastToFrag.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      fragCont.rect.scale(0.8, 0.6, easeInOutCubic),
      fragCont.rect.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      fragToRender.scale(0.8, 0.6, easeInOutCubic),
      fragToRender.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      renderLayout.scale(0.2, 0.6, easeInOutCubic),
      renderLayout.opacity(0.0, 0.6, easeInOutCubic),
    ),
    all(
      rasterizerTitle.scale(0.1, 0.6, easeInOutCubic),
      rasterizerTitle.opacity(0.0, 0.6, easeInOutCubic),
      titleCont.rect.scale(0.1, 0.6, easeInOutCubic),
      titleCont.rect.opacity(0.0, 0.6, easeInOutCubic),
    ),
  )
});
