import {
  width as platformWidth,
  height as platformHeight,
  src as platformSrc,
  // @ts-ignore
} from "../assets/platform.png?metadata";
import {
  width as platformSmallTallWidth,
  height as platformSmallTallHeight,
  src as platformSmallTallSrc,
  // @ts-ignore
} from "../assets/platformSmallTall.png?metadata";
import {
  width as hillsWidth,
  height as hillsHeight,
  src as hillsSrc,
  // @ts-ignore
} from "../assets/hills.png?metadata";
import {
  width as backgroundWidth,
  height as backgroundHeight,
  src as backgroundSrc,
  // @ts-ignore
} from "../assets/background.png?metadata";
import {
  width as spriteRunLeftWidth,
  height as spriteRunLeftHeight,
  src as spriteRunLeftSrc,
  // @ts-ignore
} from "../assets/spriteRunLeft.png?metadata";
import {
  width as spriteRunRightWidth,
  height as spriteRunRightHeight,
  src as spriteRunRightSrc,
  // @ts-ignore
} from "../assets/spriteRunRight.png?metadata";
import {
  width as spriteStandLeftWidth,
  height as spriteStandLeftHeight,
  src as spriteStandLeftSrc,
  // @ts-ignore
} from "../assets/spriteStandLeft.png?metadata";
import {
  width as spriteStandRightWidth,
  height as spriteStandRightHeight,
  src as spriteStandRightSrc,
  // @ts-ignore
} from "../assets/spriteStandRight.png?metadata";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const c = canvas.getContext("2d")!;

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  width: number;
  height: number;
  speed: number;
  frames: number;
  sprites: {
    stand: {
      left: HTMLImageElement;
      right: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
    run: {
      left: HTMLImageElement;
      right: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
  };
  currentSprite: HTMLImageElement;
  currentCropWidth: number;

  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;

    this.frames = 0;
    this.sprites = {
      stand: {
        left: createImage(
          spriteStandLeftSrc,
          spriteStandLeftWidth,
          spriteStandLeftHeight
        ),
        right: createImage(
          spriteStandRightSrc,
          spriteStandRightWidth,
          spriteStandRightHeight
        ),
        cropWidth: 177,
        width: 66,
      },
      run: {
        left: createImage(
          spriteRunLeftSrc,
          spriteRunLeftWidth,
          spriteRunLeftHeight
        ),
        right: createImage(
          spriteRunRightSrc,
          spriteRunRightWidth,
          spriteRunRightHeight
        ),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  position: { x: number; y: number };
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: HTMLImageElement;
  }) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width as number;
    this.height = image.height as number;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  position: { x: number; y: number };
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: HTMLImageElement;
  }) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width as number;
    this.height = image.height as number;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(
  imageSrc: string,
  imageWidth: number,
  imageHeight: number
): HTMLImageElement {
  const image = new Image();
  image.src = imageSrc;
  image.width = imageWidth;
  image.height = imageHeight;
  return image;
}

let platformImage = createImage(platformSrc, platformWidth, platformHeight);
let hillsImage = createImage(hillsSrc, hillsWidth, hillsHeight);
let backgroundImage = createImage(
  backgroundSrc,
  backgroundWidth,
  backgroundHeight
);
let platformSmallTallImage = createImage(
  platformSmallTallSrc,
  platformSmallTallWidth,
  platformSmallTallHeight
);

let player = new Player();
let platforms: any[] = [];
let genericObjects: any[] = [];

let lastKey: string;
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let scrollOffset = 0;

function init() {
  platformImage = createImage(platformSrc, platformWidth, platformHeight);
  hillsImage = createImage(hillsSrc, hillsWidth, hillsHeight);
  backgroundImage = createImage(
    backgroundSrc,
    backgroundWidth,
    backgroundHeight
  );
  platformSmallTallImage = createImage(
    platformSmallTallSrc,
    platformSmallTallWidth,
    platformSmallTallHeight
  );

  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImage }),
    new GenericObject({ x: -1, y: -1, image: hillsImage }),
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c?.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if (scrollOffset > platformImage.width * 5 + 700 - 2) {
    console.log("you win");
  }

  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

init();
animate();

addEventListener("keydown", ({ code }: KeyboardEvent) => {
  switch (code) {
    case "KeyW":
      player.velocity.y -= 25;
      lastKey = "up";
      break;
    case "KeyA":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "KeyS":
      lastKey = "down";
      break;
    case "KeyD":
      keys.right.pressed = true;
      lastKey = "right";
      break;
  }
});

addEventListener("keyup", ({ code }: KeyboardEvent) => {
  switch (code) {
    case "KeyW":
      lastKey = "up";
      break;
    case "KeyA":
      keys.left.pressed = false;
      lastKey = "left";
      break;
    case "KeyS":
      lastKey = "down";
      break;
    case "KeyD":
      keys.right.pressed = false;
      lastKey = "right";
      break;
  }
});

export {};
