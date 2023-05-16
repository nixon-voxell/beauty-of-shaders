import { COLOR } from "../styles"
import instaLogo from "../../images/instalogo.svg"
import voxell from "../../images/voxell.png"
import instaQR from "../../images/instaqr.png"

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { Layout, Rect, Txt, Img } from "@motion-canvas/2d/lib/components";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import { all, chain, sequence } from "@motion-canvas/core/lib/flow";
import { easeInOutCubic, easeInOutQuart, easeInOutQuint } from "@motion-canvas/core/lib/tweening";
import { Color, Vector2 } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
  view.fontFamily(`"Consolas", monospace`).fontWeight(700).fontSize(256);

  const selfIntroTitle: Txt = new Txt({
    scale: 0.2,
    fill: COLOR.WHITE,
    text: "Nixon",
    opacity: 0.0,
  });

  view.add(selfIntroTitle);

  yield* beginSlide("Show speaker name");

  yield* all(
    selfIntroTitle.scale(0.4, 0.4, easeInOutCubic),
    selfIntroTitle.opacity(1.0, 0.4, easeInOutCubic),
  );

  const infoRect: Rect = new Rect({
    y: 200.0,
    scale: 0.8,
    size: new Vector2(1000.0, 500.0),
    radius: 60.0,
    fill: COLOR.BLUE,
    opacity: 0.0,
  });
  const infos: string[] = [
    "game development course (just finished year 1)",
    "2 years+ graphics programmer",
    "like making games & developing cool stuff",
  ];
  const infoTxtLayout: Layout = new Layout({
    position: new Vector2(-400.0, -80.0),
  });
  const infoTxts: Txt[] = new Array<Txt>();
  const infoHeight: number = 80.0;

  for (var i = 0; i < infos.length; i++) {
    const infoTxt = new Txt({
      y: i * infoHeight,
      scale: 0.1,
      offset: new Vector2(-1, 0),
      fill: COLOR.BLACK,
      text: infos[i],
      opacity: 0.0,
    });

    infoTxts.push(infoTxt);
    infoTxtLayout.add(infoTxt)
  }

  view.add(infoRect);
  infoRect.add(infoTxtLayout);

  yield* beginSlide("Show speaker info");

  yield* chain(
    sequence(
      0.1,
      selfIntroTitle.position.y(-200.0, 0.6, easeInOutCubic),
      selfIntroTitle.text("About me", 0.6),
      all(
        infoRect.scale(1.0, 0.6, easeInOutCubic),
        infoRect.opacity(1.0, 0.6, easeInOutCubic),
      ),
    ),
  );

  for (var i = 0; i < infoTxts.length; i++) {
    yield* beginSlide(`Show info #${i}`);

    yield* all(
      infoTxts[i].scale(0.13, 0.6, easeInOutCubic),
      infoTxts[i].opacity(1.0, 0.6, easeInOutCubic),
    );
  }

  const instaLogoImg: Img = new Img({
    position: new Vector2(-400.0, -180.0),
    scale: 0.1,
    src: instaLogo,
    opacity: 0.0,
  });
  const voxellImg: Img = new Img({
    position: new Vector2(-400.0, 180.0),
    scale: 0.2,
    src: voxell,
    shadowColor: COLOR.CYAN,
    shadowBlur: 20.0,
    opacity: 0.0,
  });
  const instaQRImg: Img = new Img({
    position: new Vector2(200.0, 0.0),
    scale: 0.5,
    src: instaQR,
    opacity: 0.0,
  });

  const linkTreeInBio: Txt = new Txt({
    y: 500.0,
    scale: 0.3,
    fill: COLOR.LIGHT_BLUE,
    text: "Linktree in bio",
  });

  instaQRImg.add(linkTreeInBio);
  view.add(instaLogoImg);
  view.add(voxellImg);
  view.add(instaQRImg);

  yield* beginSlide("Show insta qr code");

  yield* chain(
    all(
      infoRect.scale(0.8, 0.6, easeInOutCubic),
      infoRect.opacity(0.0, 0.6, easeInOutCubic),
      selfIntroTitle.text("Find me here", 0.6),
      selfIntroTitle.y(selfIntroTitle.y() - 200.0, 0.6, easeInOutCubic),
    ),
    sequence(
      0.1,
      all(
        instaLogoImg.scale(0.2, 0.6, easeInOutCubic),
        instaLogoImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
      all(
        voxellImg.scale(0.3, 0.6, easeInOutCubic),
        voxellImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
      all(
        instaQRImg.scale(0.6, 0.6, easeInOutCubic),
        instaQRImg.opacity(1.0, 0.6, easeInOutCubic),
      ),
    ),
  );

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

  // clear up self intro
  yield* sequence(
    0.05,
    all(
      selfIntroTitle.scale(0.2, 0.4, easeInOutCubic),
      selfIntroTitle.opacity(0.0, 0.4, easeInOutCubic),
    ),
    all(
      instaLogoImg.scale(0.1, 0.4, easeInOutCubic),
      instaLogoImg.opacity(0.0, 0.4, easeInOutCubic),
    ),
    all(
      voxellImg.scale(0.2, 0.4, easeInOutCubic),
      voxellImg.opacity(0.0, 0.4, easeInOutCubic),
    ),
    all(
      instaQRImg.scale(0.5, 0.4, easeInOutCubic),
      instaQRImg.opacity(0.0, 0.4, easeInOutCubic),
    ),
  );

  yield* all(
    backdrop().opacity(1.0, 1.0, easeInOutQuart),
    backdrop().size.y("50%", 1.0, easeInOutQuart),
    title0().opacity(1.0, 1.0, easeInOutQuart),
  );

  yield* beginSlide("#1");

  yield* all(
    backdrop().size.x("65%", 1.0, easeInOutQuint),
    title0().text("Coding Adventure #1", 1.0),
  );

  yield* beginSlide("Beauty of Shaders");

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
