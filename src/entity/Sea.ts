import { FISH_FONT_SIZE, FISH_INTERVAL, SWIMMING_TIME_RANGE, WATERSURFACE_POS } from "../constants";
import { Fish } from "./Fish";
import type { FishingRod } from "./FishingRod";

/**
 * 魚情報インターフェース
 */
interface FishInfo {
	/**
	 * 魚の名前
	 */
	readonly name: string;

	/**
	 * 獲得できるスコア
	 */
	readonly score: number;
}

/**
 * 出現する魚の種類
 */
const fishInfoList: FishInfo[] = [
	{name: "さかな", score: 1},
	{name: "くらげ", score: 0}
];

/**
 * 海クラス生成時のパラメータ
 */
export interface SeaParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
}

/**
 * 海クラス
 */
export class Sea {
	/**
	 * 釣られた魚リスト
	 */
	capturedFishList: Fish[];

	private _parent: g.E;

	/**
	 * 作成した魚リスト
	 */
	private _fishList: Fish[];

	/**
	 * 魚作成タイマー
	 */
	private _fishTimerIdentifier: g.TimerIdentifier;

	constructor(param: SeaParameterObject){
		this.capturedFishList = [];
		this._parent = param.parent;
		this._fishList = [];
	}

	/**
	 * 定期的に魚を作成する
	 */
	startFishTimer(): void {
		this._fishTimerIdentifier = this._parent.scene.setInterval(() => {
			const fish = this._createRandomFish(this._parent);
			fish.swim();
			this._fishList.push(fish);
		}, FISH_INTERVAL);
	}

	/**
	 * タイマーをクリアする
	 */
	clearFishTimer(): void {
		if (!this._fishTimerIdentifier) return;
		this._parent.scene.clearInterval(this._fishTimerIdentifier);
		this._fishTimerIdentifier = null;
	}

	/**
	 * 釣り針と魚の当たり判定をチェックする
	 */
	checkFishOnHook(fishingRod: FishingRod): void {
		if (!this._fishList.length) return;
		if (!fishingRod.isCatching) return;
		this._fishList.forEach(fish => {
			// 釣り針と魚が当たっていた場合は釣り上げる
			if (g.Collision.intersectAreas(fishingRod.hookArea, fish.area)) {
				if (fish.isCaptured) return;
				fish.stop();
				fish.followHook(fishingRod);
				this._fishList = this._fishList.filter(item => item !== fish);
				this.capturedFishList.push(fish);
			}
		});
	}

	/**
	 * 捕まえた魚たちを destroy する
	 */
	destroyCapturedFish(): void {
		this.capturedFishList.forEach(capturedFish => capturedFish.destroy());
		this.capturedFishList = [];
	}

	/**
	 * ランダムな魚を作成
	 */
	private _createRandomFish(parent: g.E): Fish {
		// 作成する魚の種類
		const fishIdx = Math.floor(g.game.random.generate() * fishInfoList.length);
		// 魚の泳ぎ方のパターン
		const pattern = (Math.floor(g.game.random.generate() * 2)) ? "right_to_left" : "left_to_right";
		// 魚が泳ぐ水深
		const depth = WATERSURFACE_POS.y + FISH_FONT_SIZE * Math.floor(g.game.random.generate() * 5);
		// 魚が泳ぐ時間
		const swimTime = Math.floor(
			g.game.random.generate() * (SWIMMING_TIME_RANGE.max - SWIMMING_TIME_RANGE.min)
		) + SWIMMING_TIME_RANGE.min;

		return new Fish({
			parent: parent,
			name: fishInfoList[fishIdx].name,
			score: fishInfoList[fishIdx].score,
			swimmingStyle: {
				pattern: pattern,
				depth: depth,
				swimTime: swimTime
			}
		});
	}
}
