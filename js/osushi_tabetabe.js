let ikuraImg, sushiImg; // イメージ
let font; // フォント

// 状態
let title;
let start = false;
let result = false;
// ゲーム情報
let level, score, missCount;
let frameMem;
let sushiArray = [];  //おすし配列

let iX, iY; // いくらちゃん位置

const eatDist = 50; // 衝突判定範囲
const iniSpeed = 10;
const initimer = 90;
let speed = iniSpeed;
let timer = initimer;

function preload() {
  // イメージ読み込み
  ikuraImg = loadImage("./img/ikura/ikura.png");
  sushiImg = loadImage("./img/ikura/s_akami.png");
  // フォント読み込み
  font = loadFont("./font/NotoSansJP-Medium.ttf")
}

// 初期化
function setup() {
  // 描画領域
  createCanvas(windowWidth, windowHeight);
  // 背景
  gradientBackGround();
  // フォント指定
  textFont(font);
  // タイトル表示
  title = true;
  // ゲーム情報初期化
  level = 0;
  score = 0;
  missCount = 0;

  // いくらちゃん初期位置
  ikuraXYInit();
}

// ゲーム情報初期化
function gameInit() {
  // ゲーム情報初期化
  title = false;
  result = false;
  start = true;
  speed = iniSpeed;
  timer = initimer;
  level = 0;
  score = 0;
  missCount = 0;
  // いくらちゃん初期位置
  ikuraXYInit();
  // 初期おすしを配列に追加
  sushiArray.push(new Sushi(iX, 0, sushiImg));
  // 現在フレームを記録
  frameMem = frameCount;
}

// グラデーション背景を描画
function gradientBackGround() {
  let ctx = drawingContext;
  let grad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
  grad.addColorStop(0, "#0068b7");
  grad.addColorStop(1, "#9fd9f6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// いくらちゃんを初期位置に戻す
function ikuraXYInit() {
  iX = windowWidth / 2;
  iY = windowHeight - ikuraImg.height + 325;
}

// 描画
function draw() {
  // 初期化
  clear();
  // 背景色
  gradientBackGround();

  // テキストを表示
  textSize(50);
  noStroke();
  fill(255);
  // レベル
  textAlign(LEFT);
  text("Level " + (level + 1), 10, 60);
  // スコア
  textAlign(CENTER);
  text("Score:" + score, windowWidth / 2, 60);
  // ミス
  textAlign(RIGHT);
  text("Miss:" + missCount + "/3", windowWidth - 10, 60);

  // いくらちゃんを表示
  image(ikuraImg, iX - 252, windowHeight - ikuraImg.height);

  // いくらちゃんダミー円
  // strokeWeight(2);
  // stroke(0);
  // noFill();
  // circle(iX, iY, eatDist);

  if (title === true) {
    // タイトル画面
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("いくらちゃんおすしたべたべゲーム", windowWidth / 2, windowHeight / 2);
    text("タップしてスタート", windowWidth / 2, windowHeight / 2 + 60);
    return;
  }
  else if (result === true) {
    // リザルト画面
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("おしまい", windowWidth / 2, windowHeight / 3);

    // リトライボタン
    fill("#fdd000");
    rect(windowWidth / 2 - 200, windowHeight / 2 - 100, 400, 160, 15);
    textSize(50);
    fill(0);
    textAlign(CENTER);
    text("リトライ", windowWidth / 2, windowHeight / 2);

    // いくらちゃんコメント
    let ikuraMessage = "";
    if (score === 0) {
      ikuraMessage = "ぷんすこ";
    }
    else if (score === 1) {
      ikuraMessage = "たべさせて～";
    }
    else if (score < 20) {
      ikuraMessage = "おなかすいた";
    }
    else if (score < 50) {
      ikuraMessage = "まだたべれるよ";
    }
    else if (score < 100) {
      ikuraMessage = "おいしかった～";
    }
    else if (score < 200) {
      ikuraMessage = "おなかいっぱい　だいまんぞく";
    }
    else {
      ikuraMessage = "もうたべられない　ありがと～";
    }
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text(ikuraMessage, iX, iY - 345);

    return;
  }

  // 各おすし処理
  for (let i = 0; i < sushiArray.length; i++) {
    const s = sushiArray[i];
    // 更新
    s.update();
    // 表示
    s.display();

    // いくらちゃんおすしぱくぱく判定
    if (dist(s.x, s.y, iX, iY) <= eatDist) {
      // たべれた
      // おすし削除
      sushiArray.splice(i, 1);
      // スコア上昇
      score++;
      // print("ok");

      // レベルアップ処理
      if (level < 10) {
        if (score % 3 === 0) {
          level++;
          speed++;
        }
      }
      else if (level < 20) {
        if (score % 4 === 0) {
          level++;
          speed++;
          timer -= 1;
        }
      }
      else if (score % 6 === 0) {
        level++;
        speed++;
        timer -= 2;
      }
    }
    else if (s.y > windowHeight) {
      // たべれなかった
      // おすし削除
      sushiArray.splice(i, 1);
      // ミス
      missCount++;
      // print("ng");

      // 3ミスで終了
      if (missCount >= 3) {
        // おすし削除
        sushiArray.splice(0);
        // いくらちゃん初期位置
        ikuraXYInit();
        // ゲーム終了
        start = false;
        // リザルト表示
        result = true;
      }
    }
    else {
      // do nothing
    }
  }

  // ゲーム中処理
  if (start === true) {
    // タイマーが経過したらおすし出現
    if (frameCount - frameMem >= timer) {
      // print(frameCount);
      const rX = random(eatDist, windowWidth - eatDist)
      sushiArray.push(new Sushi(rX, 0, sushiImg));
      // 現在フレームを記録
      frameMem = frameCount;
    }
  }
}

// クリック時処理
function touchStarted() {
  if (title === true) {
    // タイトルの場合
    gameInit();
  }
  else if (result === true) {
    // リザルトの場合
    // リトライボタン
    if (mouseX >= windowWidth / 2 - 200 && mouseX <= windowWidth / 2 + 200 && mouseY >= windowHeight / 2 - 80 && mouseY <= windowHeight / 2 + 80) {
      gameInit();
    }
  }
  else {
    // マウスX位置をいくらちゃんX位置に
    iX = mouseX;
  }
}

// ドラッグ時処理
function mouseDragged() {
  // マウスX位置をいくらちゃんX位置に
  iX = mouseX;
}

// おすしクラス
class Sushi {
  // 初期化
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.image = img;
  }

  // 表示
  display() {
    // イメージ表示
    image(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
    // ダミー円
    // strokeWeight(2);
    // stroke(0);
    // noFill();
    // circle(this.x, this.y, eatDist);
  }

  // 更新
  update() {
    // Y位置を更新
    this.y += speed;
  }
}

// ウィンドウサイズ変更
function windowResized() {
  // キャンバスサイズも変更
  resizeCanvas(windowWidth, windowHeight);
}