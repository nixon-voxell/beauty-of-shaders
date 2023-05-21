import { COLOR } from "../styles"
import {
  ContentRectConfig, MultiContentRect,
  createMulContentRects,
  moveMulContentRects, fadeMulContentRects,
  focusIdxMulContentRects, scaleMulContentRects,
} from "../utils/rect_util";
import { Three } from "../components/Three"
import * as network from "./three/network"

import uvcoord from "../../images/uvcoord.png"
import tools from "../../images/tools.png"
import vector from "../../images/vector.png"
import linear_algebra from "../../images/linear_algebra.png"
import linear_algebraqr from "../../images/linear_algebraqr.png"
import gpugems from "../../images/gpugems.png"
import gpugemsqr from "../../images/gpugemsqr.png"
import codingadv from "../../images/codingadv.png"
import apulogo from "../../images/apulogo.png"
import apugdclogo from "../../images/apugdclogo.png"

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Img, Layout, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { beginSlide } from "@motion-canvas/core/lib/utils";
import { all, chain, loop, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, tween } from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  network.setupScene();
  const planeMat = network.planeMesh.material;
  planeMat.uniforms.opacity.value = 0.0;
  const networkLoopTask: ThreadGenerator = yield loop(
    Infinity,
    () => {
      planeMat.uniforms.utime.value += 0.016;
    }
  );

  const three: Three = new Three({
    quality: 2,
    width: 1920,
    height: 1080,
    zoom: 1080,
    camera: network.camera,
    scene: network.threeScene,
  });

  view.add(three);

  const title: Txt = new Txt({
    scale: 0.2,
    fill: COLOR.WHITE,
    text: "Tips & tricks for debugging shaders",
    opacity: 0.0,
    shadowColor: COLOR.BLACK,
    shadowBlur: 10.0,
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

  const nextImgStrs: string[] = [linear_algebra, gpugems];
  const nextqrImgStrs: string[] = [linear_algebraqr, gpugemsqr];

  const nextImgs: Img[] = new Array<Img>(nextImgStrs.length);
  const nextqrImgs: Img[] = new Array<Img>(nextqrImgStrs.length);

  const offsetY = 360.0;
  const globalOffsetY = -80.0;
  for (var n = 0; n < nextImgStrs.length; n++) {
    const nextImg: Img = new Img({
      y: n * offsetY + globalOffsetY,
      x: -600.0,
      offset: new Vector2(-1, 0),
      scale: 0.2,
      src: nextImgStrs[n],
      opacity: 0.0,
    });
    const nextqrImg: Img = new Img({
      y: n * offsetY + globalOffsetY,
      x: 400.0,
      offset: new Vector2(-1, 0),
      scale: 0.2,
      src: nextqrImgStrs[n],
      opacity: 0.0,
    });

    view.add(nextImg);
    view.add(nextqrImg);

    nextImgs[n] = nextImg;
    nextqrImgs[n] = nextqrImg;
  }

  yield* beginSlide("Fade out");

  yield* all(
    title.text("What's next?", 0.6),
    fadeMulContentRects(tipCont, 0.0, 0.6, 0.1),
    scaleMulContentRects(tipCont, 0.6, 0.6, 0.1),
  );

  yield* beginSlide("What's next");

  yield* sequence(
    0.1,
    ...nextImgs.map(img => all(
      img.scale(0.4, 0.6, easeInOutCubic),
      img.opacity(1.0, 0.6, easeInOutCubic),
    )),
    ...nextqrImgs.map(img => all(
      img.scale(0.4, 0.6, easeInOutCubic),
      img.opacity(1.0, 0.6, easeInOutCubic),
    )),
  );

  const codingadvImg: Img = new Img({
    y: 200.0,
    scale: 0.2,
    src: codingadv,
    shadowColor: COLOR.BLACK,
    shadowBlur: 20.0,
    opacity: 0.0,
  });

  const apulogoImg: Img = new Img({
    x: -800.0,
    y: 360.0,
    scale: 0.02,
    offset: new Vector2(0, -1),
    src: apulogo,
    shadowColor: COLOR.BLACK,
    shadowBlur: 20.0,
    opacity: 0.0,
  });

  const apugdclogoImg: Img = new Img({
    x: -600.0,
    y: 360.0,
    scale: 0.05,
    offset: new Vector2(0, -1),
    src: apugdclogo,
    shadowColor: COLOR.BLACK,
    shadowBlur: 20.0,
    opacity: 0.0,
  });

  view.add(codingadvImg);
  view.add(apulogoImg);
  view.add(apugdclogoImg);

  yield* beginSlide("Thank you");

  yield* chain(
    sequence(
      0.1,
      ...nextImgs.map(img => all(
        img.scale(0.2, 0.6, easeInOutCubic),
        img.opacity(0.0, 0.6, easeInOutCubic),
      )),
      ...nextqrImgs.map(img => all(
        img.scale(0.2, 0.6, easeInOutCubic),
        img.opacity(0.0, 0.6, easeInOutCubic),
      )),

      // show thank you
      tween(1.0, value => planeMat.uniforms.opacity.value = easeInOutCubic(value)),
      title.text("Thank you!", 0.6),
      all(
        title.y(-100.0, 0.6, easeInOutCubic),
        title.scale(0.5, 0.6, easeInOutCubic),
      ),
    ),

    sequence(
      0.1,
      all(
        codingadvImg.scale(0.4, 0.6, easeInOutCubic),
        codingadvImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
      all(
        apugdclogoImg.scale(0.1, 0.6, easeInOutCubic),
        apugdclogoImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
      all(
        apulogoImg.scale(0.04, 0.6, easeInOutCubic),
        apulogoImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
    )
  );

  yield* beginSlide("End!!!");

  yield* view.opacity(0.0, 2.0, easeInOutCubic);
});
