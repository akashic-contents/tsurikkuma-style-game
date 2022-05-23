import {
	FISHING_DURATION,
	FISHING_WAIT_DURATION,
	HOOK_COLOR,
	HOOK_POS,
	HOOK_POS_WHEN_UP,
	HOOK_SIZE,
	ROD_ANGLE,
	ROD_COLOR,
	ROD_POS,
	ROD_SIZE,
	ROD_STRING_COLOR,
	ROD_STRING_HEIGHT_WHEN_UP,
	ROD_STRING_POS,
	ROD_STRING_SIZE,
	STUCK_DURATION
} from "../constants";
import { getResources } from "../Resources";
import type { Fish } from "./Fish";

/**
 * 釣りのパターン
 */
type FishingPattern = "Default" | "Stuck";

/**
 * 釣り竿クラス生成時のパラメータ
 */
export interface FishingRodParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
}

/**
 * 釣り竿クラス
 */
export class FishingRod {
	/**
	 * スタック時のトリガー
	 */
	readonly onStuck: g.Trigger<void> = new g.Trigger();

	private _parent: g.E;
	private _rodString: g.FilledRect;
	private _hook: g.E;

	/**
	 * 釣り上げ中（魚との当たり判定がある状態）かどうか
	 */
	private _isCatching: boolean;
	/**
	 * 釣り中かどうか
	 */
	private _isFishing: boolean;

	constructor(param: FishingRodParameterObject) {
		this._parent = param.parent;
		this._isCatching = false;
		this._isFishing = false;
		this._createRod();
		this._createRodString();
		this._createHook();
	}

	get isCatching(): boolean {
		return this._isCatching;
	}

	/**
	 * 釣り針の当たり判定を返す
	 */
	get hookArea(): g.CommonArea {
		return {
			width: this._hook.width,
			height: this._hook.height,
			x: this._hook.x,
			y: this._hook.y
		};
	}

	/**
	 * 釣り上げる
	 */
	catchUp(finished: () => void): void {
		if (this._isFishing || this._isCatching) return;
		this._isCatching = true;
		this._isFishing = true;

		const timeline = getResources().timeline;
		timeline.create(this._rodString).to({height:ROD_STRING_HEIGHT_WHEN_UP}, FISHING_DURATION).wait(FISHING_WAIT_DURATION);
		timeline.create(this._hook).moveTo(this._hook.x, HOOK_POS_WHEN_UP.y, FISHING_DURATION).wait(FISHING_WAIT_DURATION)
			.call(() => {
				this._isCatching = false;
				finished();
			});
	}

	/**
	 * 釣った魚からパターンを判定
	 */
	getFishingPattern(capturedFishList: Fish[]): FishingPattern {
		let pattern: FishingPattern = "Default";
		capturedFishList.forEach(fish => {
			if (pattern !== "Default") return;
			switch (fish.name){
				case "くらげ":
					pattern = "Stuck";
					break;
			}
		});
		return pattern;
	}

	/**
	 * パターンに従って釣りをする
	 */
	fishing(pattern: FishingPattern): void {
		switch (pattern){
			case "Default":
				this._swingDown();
				break;
			case "Stuck":
				this._stuck();
				break;
		}
	}

	/**
	 * 振り下ろす
	 */
	private _swingDown(): void {
		const timeline = getResources().timeline;

		timeline.create(this._rodString).to({height: ROD_STRING_SIZE.height}, FISHING_DURATION);

		timeline.create(this._hook).moveTo(this._hook.x, HOOK_POS.y, FISHING_DURATION).call(() => {
			this._isFishing = false;
		});
	}

	/**
	 * スタックさせる
	 */
	private _stuck(): void {
		this.onStuck.fire();
		// ${STUCK_DURATION} ミリ秒後に、スタックを解除し、釣竿を振り下ろす
		const timeline = getResources().timeline;
		timeline.create(this._rodString).wait(STUCK_DURATION);
		timeline.create(this._hook).wait(STUCK_DURATION)
			.call(() => {
				this._swingDown();
			});
	}

	/**
	 * 釣竿を作成する
	 */
	private _createRod(): void {
		new g.FilledRect({
			scene: this._parent.scene,
			cssColor: ROD_COLOR,
			width: ROD_SIZE.width,
			height: ROD_SIZE. height,
			x: ROD_POS.x,
			y: ROD_POS.y,
			angle: ROD_ANGLE,
			parent: this._parent,
			anchorX: null,
			anchorY: null
		});
	}

	/**
	 * 釣り糸を作成する
	 */
	private _createRodString(): void {
		this._rodString = new g.FilledRect({
			scene: this._parent.scene,
			cssColor: ROD_STRING_COLOR,
			width: ROD_STRING_SIZE.width,
			height: ROD_STRING_SIZE. height,
			x: ROD_STRING_POS.x,
			y: ROD_STRING_POS.y,
			parent: this._parent
		});
	}

	/**
	 * 釣り針を作成する
	 */
	private _createHook(): void {
		const scene = this._parent.scene;

		this._hook = new g.E({
			scene: scene,
			width: HOOK_SIZE.width,
			height: HOOK_SIZE.height,
			x: HOOK_POS.x,
			y: HOOK_POS.y,
			parent: this._parent
		});

		new g.FilledRect({
			scene: scene,
			cssColor: HOOK_COLOR,
			width: 10,
			height: this._hook.height,
			x: this._hook.width - 10,
			parent: this._hook
		});

		new g.FilledRect({
			scene: scene,
			cssColor: HOOK_COLOR,
			width : this._hook.width,
			height: 10,
			y: this._hook.height - 10,
			parent: this._hook
		});

		new g.FilledRect({
			scene: scene,
			cssColor: HOOK_COLOR,
			width: 10,
			height: 20,
			y: this._hook.height - 20,
			parent: this._hook
		});
	}
}
