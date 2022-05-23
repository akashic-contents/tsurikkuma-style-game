import type { Tween } from "@akashic-extension/akashic-timeline";
import { FISH_FONT_SIZE } from "../constants";
import { getResources } from "../Resources";
import type { FishingRod } from "./FishingRod";

/**
 * 魚クラス生成時のパラメータ
 */
export interface FishParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
	/**
	 * 魚の名前(文字列)
	 */
	readonly name: string;
	/**
	 * 魚を釣ったときのスコア
	 */
	readonly score: number;
	/**
	 * 泳ぎ方
	 */
	readonly swimmingStyle: SwimmingStyle;
}

/**
 * 泳ぎ方インターフェース
 */
export interface SwimmingStyle {
	/**
	 * 魚が動く方向
	 */
	readonly pattern: "left_to_right" | "right_to_left";
	/**
	 * 魚が泳いでいる深さ (y座標)
	 */
	readonly depth: number;
	/**
	 * 魚の移動時間 (ミリ秒)
	 */
	readonly swimTime: number;
}

/**
 * 魚クラス
 */
export class Fish {
	private _parent: g.E;
	private _label: g.Label;
	private _score: number;
	private _swimmingStyle: SwimmingStyle;

	/**
	 * 泳ぐアニメーション用の Tween
	 */
	private _swimTween: Tween | null = null;
	/**
	 *  既に釣り上げられたかどうか
	 */
	private _isCaptured: boolean;

	constructor(param: FishParameterObject) {
		this._parent = param.parent;
		this._label = this._createLabel(param);
		this._parent.append(this._label);
		this._isCaptured = false;
		this._score = param.score;
		this._swimmingStyle = param.swimmingStyle;
	}

	get isCaptured(): boolean {
		return this._isCaptured;
	}

	get name(): string {
		return this._label.text;
	}

	get score(): number {
		return this._score;
	}

	/**
	 * 魚の当たり判定を返す
	 */
	get area(): g.CommonArea {
		return {
			width: this._label.width,
			height: this._label.height,
			x: this._label.x,
			y: this._label.y
		};
	}

	destroy(): void {
		this._label.destroy();
	}

	/**
	 * 釣られる
	 */
	followHook(fishingRod: FishingRod): void {
		this._label.onUpdate.add(() => {
			this._label.y = Math.min(fishingRod.hookArea.y, this._label.y);
			this._label.modified();
		});
	}

	/**
	 * 泳ぐ
	 */
	swim(): void {
		const timeline = getResources().timeline;
		const toX = this._label.x < g.game.width / 2 ? g.game.width : -this._label.width;
		if (this._swimTween) {
			timeline.remove(this._swimTween);
		}
		this._swimTween = timeline
			.create(this._label)
			.moveTo(toX, this._label.y, this._swimmingStyle.swimTime)
			.call(() => this._label.destroy());
	}

	/**
	 * 泳ぎをやめる
	 */
	stop(): void {
		this._isCaptured = true;
		if (this._swimTween) {
			getResources().timeline.remove(this._swimTween);
			this._swimTween = null;
		}
	}

	/**
	 * 魚ラベル作成
	 */
	private _createLabel(param: FishParameterObject): g.Label {
		const pos = this._initialPos(param);
		return new g.Label({
			scene: param.parent.scene,
			text: param.name,
			font: getResources().font,
			fontSize: FISH_FONT_SIZE,
			x: pos.x,
			y: pos.y
		});
	}

	/**
	 * 初期位置生成
	 */
	private _initialPos(param: FishParameterObject): g.CommonOffset {
		switch (param.swimmingStyle.pattern) {
			case "left_to_right":
				return { x: -FISH_FONT_SIZE, y: param.swimmingStyle.depth };
			case "right_to_left":
				return { x: g.game.width, y: param.swimmingStyle.depth };
		}
	}
}
