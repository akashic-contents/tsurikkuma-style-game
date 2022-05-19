import { SCORE_LABEL_FORMAT, TIMELIMIT, TIME_LABEL_FORMAT } from "./constants";
import type { Fish } from "./entity/Fish";
import { getResources } from "./Resources";

/**
 * HUDマネージャークラス生成時のパラメータ
 */
export interface HUDManagerParameterObject {
	/**
	 * スコアラベル
	 */
	readonly scoreLabel: g.Label;
	/**
	 * 制限時間ラベル
	 */
	readonly timeLabel: g.Label;
	/**
	 * システムラベル
	 */
	readonly systemLabel: g.Label;
}

/**
 * HUDマネージャークラス
 * スコア、制限時間、システム文言などの管理を行います
 */
export class HUDManager {
	private _scoreLabel: g.Label;
	private _timeLabel: g.Label;
	private _systemLabel: g.Label;
	private _timeLimit: number;

	constructor(param: HUDManagerParameterObject){
		this._scoreLabel = param.scoreLabel;
		this._timeLabel = param.timeLabel;
		this._systemLabel = param.systemLabel;
		this._timeLimit = TIMELIMIT;
	}

	// ----------
	// スコア関係
	// ----------

	/**
	 * スコアをセットする
	 */
	setScore(score: number): void {
		score = Math.min(score, 99999);

		const scoreText = SCORE_LABEL_FORMAT + `${score}`;
		this._scoreLabel.text = scoreText;
		this._scoreLabel.invalidate();

		if (!g.game.vars.gameState) {
			g.game.vars.gameState = {};
		}
		g.game.vars.gameState.score = score;
	}

	/**
	 * 現時点のスコアを得る
	 */
	getScore(): number {
		if (!g.game.vars.gameState) {
			return 0;
		}
		return g.game.vars.gameState.score;
	}

	/**
	 * スコアの加算
	 */
	addScore(score: number): void {
		this.setScore(this.getScore() + score);
	}

	/**
	 * 釣った魚からスコアを計算
	 */
	calcScore(capturedFishList: Fish[]): number {
		if (capturedFishList.some(fish => fish.score === 0)){
			return 0;
		}
		return capturedFishList.reduce((score, fish) => score += fish.score, 0);
	}

	// ----------
	// 制限時間関係
	// ----------

	/**
	 * 制限時間をセットする
	 */
	setTimeLimit(timeLimit: number): void {
		this._timeLimit = Math.max(timeLimit, 1);
		const timeLimitText = TIME_LABEL_FORMAT + `${timeLimit}`;
		if (this._timeLabel.text !== timeLimitText){
			this._timeLabel.text = timeLimitText;
			this._timeLabel.invalidate();
		}
	}

	/**
	 * 現時点の残り制限時間を得る
	 */
	getNowTime(): number {
		if (this._timeLimit < 0) {
			return 0;
		}
		return this._timeLimit;
	}

	/**
	 * 残り制限時間を更新
	 */
	updateTime(): void {
		const now = Math.max(Math.floor(this._timeLimit), 0);
		const nowTimeText = TIME_LABEL_FORMAT + `${now}`;
		if (this._timeLabel.text !== nowTimeText){
			this._timeLabel.text = nowTimeText;
			this._timeLabel.invalidate();
		}
		this._timeLimit -= 1 / g.game.fps;
	};

	// ----------
	// システムラベル関係
	// ----------

	/**
	 * スタート時のカウントダウン開始
	 */
	startCountdown(finished: () => void): void {
		const timeline = getResources().timeline;
		timeline.create(this._systemLabel, {modified: () => this._systemLabel.invalidate()})
			.wait(1000).call(() => this._systemLabel.text = "2")
			.wait(1000).call(() => this._systemLabel.text="1")
			.wait(1000).call(() => this._systemLabel.text="Start!")
			.wait(500).fadeOut(500)
			.call(() => finished());
	};

	/**
	 * 終了時のシステム文言表示
	 */
	showTimeUp(): void {
		this._systemLabel.text = "TIME UP!";
		this._systemLabel.opacity = 1.0;
		this._systemLabel.invalidate();
	}
}
