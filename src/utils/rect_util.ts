import { Txt, Rect, Layout } from "@motion-canvas/2d/lib/components";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import type { TimingFunction } from "@motion-canvas/core/lib/tweening";

type ContentRectConfig = {
  size: Vector2,
  radius: number,
  gap: number,
  fill: string,
  txtScale: number,
  txtFill: string,
}

type VertContentRect = {
  rects: Rect[],
  txts: Txt[],
}

function createVertContentRects(
  contTxts: string[],
  config: ContentRectConfig, initialOpacity: number,
  parent: Layout
): VertContentRect {
  const contents: VertContentRect = {
    rects: new Array<Rect>(contTxts.length),
    txts: new Array<Txt>(contTxts.length),
  };

  for (var c = 0; c < contTxts.length; c++) {
    const rect: Rect = new Rect({
      y: c * (config.size.y + config.gap),
      size: config.size,
      radius: config.radius,
      fill: config.fill,
      opacity: initialOpacity,
    });

    const txt: Txt = new Txt({
      text: contTxts[c],
      scale: config.txtScale,
      fill: config.txtFill,
    });

    contents.rects[c] = rect;
    contents.txts[c] = txt;

    rect.add(txt);
    parent.add(rect);
  }

  return contents;
}

function* moveVertContentRects(
  content: VertContentRect, movement: Vector2,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.position(rect.position().add(movement), duration, timingFunc),
    ),
  );
}

function* fadeVertContentRects(
  content: VertContentRect, opacity: number,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.opacity(opacity, duration, timingFunc),
    ),
  );
}

function* scaleVertContentRects(
  content: VertContentRect, scale: number,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.scale(scale, duration, timingFunc),
    ),
  );
}

function* sameTxtVertContentRects(
  content: VertContentRect, text: string,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.txts.map((txt) =>
      txt.text(text, duration, timingFunc),
    ),
  );
}

function* changeTxtVertContentRects(
  content: VertContentRect, contTxts: string[],
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.txts.map((txt, index) =>
      txt.text(contTxts[index], duration, timingFunc),
    ),
  );
}

function* focusIdxVertContentRects(
  content: VertContentRect, index: number, scaleUp: number,
  fadeOpacity: number, scaleDown: number,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* all(
    content.rects[index].opacity(1.0, duration, timingFunc),
    content.rects[index].scale(scaleUp, duration, timingFunc),

    sequence(
      seqDelay,
      ...content.rects.slice(0, index).map((content) =>
        all(
          content.opacity(fadeOpacity, duration, timingFunc),
          content.scale(scaleDown, duration, timingFunc),
        )
      ),
      ...content.rects.slice(index + 1).map((content) =>
        all(
          content.opacity(fadeOpacity, duration, timingFunc),
          content.scale(scaleDown, duration, timingFunc),
        )
      ),
    )
  );
}

export {
  ContentRectConfig, VertContentRect,
  createVertContentRects,
  moveVertContentRects, fadeVertContentRects, scaleVertContentRects,
  sameTxtVertContentRects, changeTxtVertContentRects,
  focusIdxVertContentRects,
}
