import { Timeline } from "@akashic-extension/akashic-timeline";
import {
	BACKGROUND_ALPHA,
	BACKGROUND_COLOR,
	BEAR_COLOR,
	BEAR_POS,
	BEAR_SIZE,
	FONT_FAMILY,
	FONT_SIZE,
	GRASS_COLOR,
	GRASS_POS,
	GRASS_SIZE,
	ISLAND_COLOR,
	ISLAND_POS,
	ISLAND_SIZE,
	STUCK_DURATION,
	TIMELIMIT,
	WATERSURFACE_COLOR,
	WATERSURFACE_POS
} from "./constants";
import { FishingRod } from "./entity/FishingRod";
import { Sea } from "./entity/Sea";
import { HUDManager } from "./HUDManager";
import type { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";
import { getResources, setResources } from "./Resources";

declare const window: RPGAtsumaruWindow;

class TsurikkumaStyleGame {
	private scene: g.Scene;
	private root: g.E;
	private sea: Sea;
	private fishingRod: FishingRod;
	private hudManager: HUDManager;
	private isPlaying: boolean = false;

	constructor(scene: g.Scene) {
		this.scene = scene;
		this.root = new g.E({ scene: scene });
		this.scene.append(this.root);
		createStage(this.root);
		createBear(this.root);
		this.sea = createSea(this.root);
		this.fishingRod = createFishingRod(this.root);
		this.hudManager = createHUDManager(this.root);
	}

	/**
	 * ゲームを開始する
	 */
	start(): void {
		this.hudManager.startCountdown(() => this._startGame());
	}

	/**
	 * ゲームを1フレーム進める
	 */
	step(): void {
		if (!this.isPlaying) return;
		this.sea.checkFishOnHook(this.fishingRod);
		this.hudManager.updateTime();
		if (this.hudManager.getNowTime() <= 0) {
			// ゲーム終了
			this.isPlaying = false;
			this._finishGame();
		}
	}

	/**
	 * タップしたときの処理
	 */
	onPointDown(): void {
		if (!this.isPlaying) return;
		this.fishingRod.catchUp(() => {
			const pattern = this.fishingRod.getFishingPattern(this.sea.capturedFishList);
			this.hudManager.addScore(this.hudManager.calcScore(this.sea.capturedFishList));
			this.fishingRod.fishing(pattern);
			this.sea.destroyCapturedFish();
		});
	}

	/**
	 * ゲーム本編開始
	 */
	private _startGame(): void {
		this.isPlaying = true;
		this.sea.startFishTimer();
	}

	/**
	 * ゲーム終了時の処理
	 */
	private _finishGame(): void {
		this.scene.onPointUpCapture.removeAll();
		this.sea.clearFishTimer();
		this.hudManager.showTimeUp();
		if (getResources().param.isAtsumaru) {
			const boardId = 1;
			window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, g.game.vars.gameState.score).then(function() {
				window.RPGAtsumaru.experimental.scoreboards.display(boardId);
			});
		}
	}
}

export function main(param: GameMainParameterObject): void {
	const scene = new g.Scene({ game: g.game });

	let timeLimit = TIMELIMIT;
	if (param.sessionParameter.totalTimeLimit) {
		/**
		 * セッションパラメータで制限時間が指定されたらその値を使用します
		 * 制限時間の 10 秒ほど前にはゲーム上の演出が完了するようにします
		 */
		timeLimit = Math.max(param.sessionParameter.totalTimeLimit - 10, 1);
	}

	setResources({
		timeline: new Timeline(scene),
		font: createFont(),
		timeLimit: timeLimit,
		param: param
	});

	const tsurikkumaStyleGame = new TsurikkumaStyleGame(scene);

	scene.onLoad.add(() => {
		tsurikkumaStyleGame.start();
	});

	scene.onUpdate.add(() => {
		tsurikkumaStyleGame.step();
	});

	scene.onPointDownCapture.add(() => {
		tsurikkumaStyleGame.onPointDown();
	});

	g.game.pushScene(scene);
}

/**
 * フォントを作成
 */
function createFont(): g.DynamicFont {
	return new g.DynamicFont({
		game: g.game,
		fontFamily: FONT_FAMILY,
		size: FONT_SIZE
	});
}

/**
 * 背景を作成
 */
function createStage(parent: g.E): void {
	/**
	 * 背景 (空と海)
	 */
	new g.FilledRect({
		scene: parent.scene,
		cssColor: BACKGROUND_COLOR,
		width: g.game.width,
		height: g.game.height,
		opacity: BACKGROUND_ALPHA,
		parent: parent
	});

	/**
	 * 島
	 */
	new g.FilledRect({
		scene: parent.scene,
		cssColor: ISLAND_COLOR,
		width: ISLAND_SIZE.width,
		height: ISLAND_SIZE.height,
		x: ISLAND_POS.x,
		y: ISLAND_POS.y,
		parent: parent
	});

	/**
	 * 草
	 */
	new g.FilledRect({
		scene: parent.scene,
		cssColor: GRASS_COLOR,
		width: GRASS_SIZE.width,
		height: GRASS_SIZE.height,
		x: GRASS_POS.x,
		y: GRASS_POS.y,
		parent: parent
	});

	/**
	 * 水面
	 */
	new g.FilledRect({
		scene: parent.scene,
		cssColor: WATERSURFACE_COLOR,
		width: g.game.width,
		height: 3,
		x: WATERSURFACE_POS.x,
		y: WATERSURFACE_POS.y,
		parent: parent
	});
}

/**
 * くまを作成
 */
function createBear(parent: g.E): void {
	new g.FilledRect({
		scene: parent.scene,
		cssColor: BEAR_COLOR,
		width: BEAR_SIZE.width,
		height: BEAR_SIZE.height,
		x: BEAR_POS.x,
		y: BEAR_POS.y,
		parent: parent
	});
}

/**
 * 海を作成
 */
function createSea(parent: g.E): Sea {
	return new Sea({ parent });
}

/**
 * 釣竿を作成
 */
function createFishingRod(parent: g.E): FishingRod {
	const fishingRod = new FishingRod({ parent: parent });
	fishingRod.onStuck.add(() => {
		createMissLabel(parent);
	});
	return fishingRod;
}

/**
 * HUDマネージャーを作成
 */
function createHUDManager(parent: g.E): HUDManager {
	const hudManager = new HUDManager({
		scoreLabel: createScoreLabel(parent),
		timeLabel: createTimeLabel(parent),
		systemLabel: createSystemLabel(parent)
	});
	hudManager.setScore(0);
	hudManager.setTimeLimit(getResources().timeLimit);
	return hudManager;
}

/**
 * スコアラベルを作成
 */
function createScoreLabel(parent: g.E): g.Label {
	return new g.Label({
		scene: parent.scene,
		text: "",
		font: getResources().font,
		fontSize: FONT_SIZE,
		width: g.game.width - 10,
		y: 5,
		textAlign: "right",
		widthAutoAdjust: false,
		parent: parent
	});
}

/**
 * 制限時間ラベルを作成
 */
function createTimeLabel(parent: g.E): g.Label {
	return new g.Label({
		scene: parent.scene,
		text: "",
		font: getResources().font,
		fontSize: FONT_SIZE,
		width: g.game.width - 220,
		y: 5,
		textAlign: "right",
		widthAutoAdjust: false,
		parent: parent
	});
}

/**
 *  システムラベルを作成
 */
function createSystemLabel(parent: g.E): g.Label {
	return new g.Label({
		scene: parent.scene,
		text: "3",
		font: getResources().font,
		fontSize: FONT_SIZE * 2,
		x: g.game.width / 2,
		y: g.game.height / 2,
		anchorX: 0.5,
		anchorY: 0.5,
		parent: parent
	});
}

/**
 * 釣りミス時のラベルを作成
 */
function createMissLabel(parent: g.E): void {
	const missLabel = new g.Label({
		scene: parent.scene,
		text: "miss!",
		textColor: "red",
		font: getResources().font,
		fontSize: Math.floor(FONT_SIZE / 2),
		x: BEAR_POS.x + BEAR_SIZE.width * 2,
		y: BEAR_POS.y,
		parent: parent
	});
	getResources()
		.timeline.create(missLabel)
		.wait(STUCK_DURATION)
		.call(() => missLabel.destroy());
}
