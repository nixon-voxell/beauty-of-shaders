import { Txt, Rect, Layout } from "@motion-canvas/2d/lib/components";
import { all, sequence } from "@motion-canvas/core/lib/flow";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import type { TimingFunction } from "@motion-canvas/core/lib/tweening";
import { SignalValue } from "@motion-canvas/core/lib/signals";

type ContentRectConfig = {
  size: Vector2,
  radius: number,
  gap: number,
  fill: string,
  txtScale: number,
  txtFill: string,
}

type ContentRect = {
  rect: Rect,
  txt: Txt,
}

function createContentRect(
  cont: SignalValue<string>, position: SignalValue<PossibleVector2<number>>,
  config: ContentRectConfig, opacity: number,
  parent: Layout
): ContentRect {
  const content: ContentRect = {
    rect: new Rect({
      position,
      size: config.size,
      radius: config.radius,
      fill: config.fill,
      opacity: opacity,
    }),
    txt: new Txt({
      text: cont,
      scale: config.txtScale,
      fill: config.txtFill,
    }),
  }

  content.rect.add(content.txt);
  parent.add(content.rect);

  return content;
}

function* moveContentRect(
  content: ContentRect, movement: PossibleVector2<number>,
  duration: number, timingFunc?: TimingFunction
) {
  const rect: Rect = content.rect;
  yield* rect.position(rect.position().add(movement), duration, timingFunc);
}

function* positionContentRect(
  content: ContentRect, position: PossibleVector2<number>,
  duration: number, timingFunc?: TimingFunction
) {
  const rect: Rect = content.rect;
  yield* rect.position(position, duration, timingFunc);
}

function* fadeContentRect(
  content: ContentRect, opacity: number,
  duration: number, timingFunc?: TimingFunction
) {
  const rect: Rect = content.rect;
  yield* rect.opacity(opacity, duration, timingFunc);
}

function* scaleContentRect(
  content: ContentRect, scale: number,
  duration: number, timingFunc?: TimingFunction
) {
  const rect: Rect = content.rect;
  yield* rect.scale(scale, duration, timingFunc);
}

function* changeContentTxt(
  content: ContentRect, cont: string,
  duration: number, timingFunc?: TimingFunction
) {
  const txt: Txt = content.txt;
  yield* txt.text(cont, duration, timingFunc);
}

function* scaleContentTxt(
  content: ContentRect, scale: number,
  duration: number, timingFunc?: TimingFunction
) {
  const txt: Txt = content.txt;
  yield* txt.scale(scale, duration, timingFunc);
}

export {
  ContentRect, createContentRect,
  positionContentRect, moveContentRect, fadeContentRect, scaleContentRect,
  changeContentTxt, scaleContentTxt,
}

type MultiContentRect = {
  rects: Rect[],
  txts: Txt[],
}

function createMulContentRects(
  contTxts: string[],
  config: ContentRectConfig, opacity: number,
  parent: Layout, direction: Vector2 = Vector2.up,
): MultiContentRect {
  const contents: MultiContentRect = {
    rects: new Array<Rect>(contTxts.length),
    txts: new Array<Txt>(contTxts.length),
  };

  for (var c = 0; c < contTxts.length; c++) {
    const rect: Rect = new Rect({
      position: direction.mul(config.size).add(direction.mul(config.gap)).mul(c),
      size: config.size,
      radius: config.radius,
      fill: config.fill,
      opacity: opacity,
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

function createMulEmptyContentRects(
  count: number,
  config: ContentRectConfig, opacity: number,
  parent: Layout, direction: Vector2 = Vector2.up,
): MultiContentRect {
  const contents: MultiContentRect = {
    rects: new Array<Rect>(count),
    txts: new Array<Txt>(count),
  };

  for (var c = 0; c < count; c++) {
    const rect: Rect = new Rect({
      position: direction.mul(config.size).add(direction.mul(config.gap)).mul(c),
      size: config.size,
      radius: config.radius,
      fill: config.fill,
      opacity: opacity,
    });

    const txt: Txt = new Txt({
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

function* moveMulContentRects(
  content: MultiContentRect, movement: Vector2,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.position(rect.position().add(movement), duration, timingFunc),
    ),
  );
}

function* fadeMulContentRects(
  content: MultiContentRect, opacity: number,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.opacity(opacity, duration, timingFunc),
    ),
  );
}

function* scaleMulContentRects(
  content: MultiContentRect, scale: number,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.rects.map((rect) =>
      rect.scale(scale, duration, timingFunc),
    ),
  );
}

function* sameTxtMulContentRects(
  content: MultiContentRect, text: string,
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.txts.map((txt) =>
      txt.text(text, duration, timingFunc),
    ),
  );
}

function* changeTxtMulContentRects(
  content: MultiContentRect, contTxts: string[],
  duration: number, seqDelay: number, timingFunc?: TimingFunction
) {
  yield* sequence(
    seqDelay,
    ...content.txts.map((txt, index) =>
      txt.text(contTxts[index], duration, timingFunc),
    ),
  );
}

function* focusIdxMulContentRects(
  content: MultiContentRect, index: number, scaleUp: number,
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
  ContentRectConfig, MultiContentRect,
  createMulContentRects, createMulEmptyContentRects,
  moveMulContentRects, fadeMulContentRects, scaleMulContentRects,
  sameTxtMulContentRects, changeTxtMulContentRects,
  focusIdxMulContentRects,
}
