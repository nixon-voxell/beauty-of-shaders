import { COLOR } from "../styles"
import {
  ContentRectConfig, ContentRect, createContentRect,
  scaleContentRect, fadeContentRect, positionContentRect, changeContentTxt
} from "../utils/rect_util";

import { all, delay } from "@motion-canvas/core/lib/flow";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { Layout } from "@motion-canvas/2d/lib/components";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";

function createTitleCont(title: string, parent: Layout): ContentRect {
  const titleConfig: ContentRectConfig = {
    size: new Vector2(420.0, 98.0),
    radius: 10.0,
    gap: 10.0,
    fill: COLOR.WHITE,
    txtScale: 0.09,
    txtFill: COLOR.BLACK,
  }
  const titleCont: ContentRect = createContentRect(
    title,
    new Vector2(-700.0, -440.0), titleConfig, 0.6, parent
  );

  return titleCont;
}

function* changeTitleAtCenter(titleCont: ContentRect, newTitle: string) {
  yield* all(
    positionContentRect(titleCont, 0.0, 0.6, easeInOutCubic),
    fadeContentRect(titleCont, 1.0, 0.6, easeInOutCubic),
  );

  yield* scaleContentRect(titleCont, 1.4, 0.6, easeInOutCubic);
  yield* delay(
    0.3,
    changeContentTxt(titleCont, newTitle, 0.6),
  );
}

function* moveTitleToTopLeft(titleCont: ContentRect) {
  yield* all(
    positionContentRect(titleCont, new Vector2(-700.0, -440.0), 0.6, easeInOutCubic),
    titleCont.rect.fill("#8A8C8E", 0.6, easeInOutCubic),
    scaleContentRect(titleCont, 1.0, 0.6, easeInOutCubic),
  );
}

export { createTitleCont, changeTitleAtCenter, moveTitleToTopLeft, }
