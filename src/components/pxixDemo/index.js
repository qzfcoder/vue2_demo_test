import * as PIXI from 'pixi.js';
const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

export default class Game {
  constructor(el) {
    return this.init(el);
  }
  init(el) {
    // 初始化
    this.app = new PIXI.Application({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    });
    el.appendChild(this.app.view);
    this.loader = new PIXI.Loader();
    this.loader
      .add('bg', 'assets/1.jpg')
      .add('wave', 'assets/logo.png')
      .load(this.render.bind(this));
    return this;
  }
  render(loader, resources) {
    // 渲染
    this.resources = resources;
    const bg = PIXI.Sprite.from(resources.bg.texture);
    bg.anchor.set(0.5);
    bg.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    bg.scale.set(0.5, 0.5);

    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.addChild(bg);
    this.app.stage.addChild(this.container);
    this.container.filters = [];
    this.displacementSprite = new PIXI.Sprite.from(resources.wave.texture);
    this.displacementSprite.texture.baseTexture.wrapMode =
      PIXI.WRAP_MODES.REPEAT;
    this.displacementSprite.scale.set(1);

    const displacementFilter = new PIXI.filters.DisplacementFilter(
      this.displacementSprite
    );
    this.container.addChild(this.displacementSprite);
    this.container.filters.push(displacementFilter);

    this.app.ticker.add(this.step.bind(this));
  }
  step() {
    const { displacementSprite } = this;
    displacementSprite.x += 1.7;
    if (displacementSprite.x >= displacementSprite.width) {
      displacementSprite.x = 0;
    }
  }
}
