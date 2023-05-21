import { COLOR } from "../styles"
import {
  ContentRectConfig, MultiContentRect,
  createMulContentRects,
  moveMulContentRects, fadeMulContentRects,
  focusIdxMulContentRects, scaleMulContentRects,
} from "../utils/rect_util";

import uvcoord from "../../images/uvcoord.png"
import tools from "../../images/tools.png"
import vector from "../../images/vector.png"

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Img, Layout, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, loop, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const title: Txt = new Txt({
    scale: 0.2,
    fill: COLOR.WHITE,
    text: "Tips & tricks for debugging shaders",
    opacity: 0.0,
  })

  view.add(title);

  yield* all(
    title.scale(0.3, 0.6, easeInOutCubic),
    title.opacity(1.0, 0.6, easeInOutCubic),
  );

  const tips = [
    "Always go visual",
    "Invest time in building tools",
    "Build intuition",
  ];

  const tipConfig: ContentRectConfig = {
    size: new Vector2(600.0, 160.0),
    radius: 10.0,
    gap: 20.0,
    fill: COLOR.WHITE,
    txtScale:0.12,
    txtFill: COLOR.BLACK,
  }

  const tipLayout: Layout = new Layout({
    y: -100.0,
    x: -200.0,
  });

  const tipCont: MultiContentRect = createMulContentRects(
    tips, tipConfig, 1.0, tipLayout
  );

  for (var t = 0; t < tips.length; t++) {
    const tipRect: Rect = tipCont.rects[t];
    const tipTxt: Txt = tipCont.txts[t];

    tipTxt.offset(new Vector2(-1, 0))
    tipTxt.x(-tipRect.size.x() * 0.4);
  }

  // images
  const imgStrs: string[] = [uvcoord, tools, vector];
  const imgIcons: Img[] = new Array<Img>(imgStrs.length);

  for (var i = 0; i < imgIcons.length; i++) {
    const imgIcon: Img = new Img({
      x: 500.0,
      scale: 0.2,
      src: imgStrs[i],
      shadowColor: COLOR.WHITE_SHADOW,
      shadowBlur: 10.0,
      shadowOffset: 4.0,
      opacity: 0.0,
    });

    tipCont.rects[i].add(imgIcon);
    imgIcons[i] = imgIcon;
  }

  view.add(tipLayout);

  yield* fadeMulContentRects(tipCont, 0.0, 0.0, 0.0);
  yield* scaleMulContentRects(tipCont, 0.6, 0.0, 0.0);

  yield* chain(
    all(
      title.y(title.y() - 300.0, 0.6, easeInOutCubic),
      title.scale(0.25, 0.6, easeInOutCubic),
    ),
  );

  for (var t = 0; t < tips.length; t++) {
    yield* beginSlide("Tip #" + t.toString());

    yield* sequence(
      0.3,
      all(
        tipCont.rects[t].scale(1.0, 0.6, easeInOutCubic),
        tipCont.rects[t].opacity(1.0, 0.6, easeInOutCubic),
      ),
      all(
        imgIcons[t].scale(0.28, 0.6, easeInOutCubic),
        imgIcons[t].opacity(1.0, 0.6, easeInOutCubic),
      ),
    );
  }
});
