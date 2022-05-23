import type { Timeline } from "@akashic-extension/akashic-timeline";
import type { GameMainParameterObject } from "./parameterObject";

/**
 * ゲーム全体で使うリソース
 */
interface Resources {
	readonly font: g.DynamicFont;
	readonly timeline: Timeline;
	readonly timeLimit: number;
	readonly param: GameMainParameterObject;
}

export function getResources(): Resources {
	return g.game.vars.resouces;
}

export function setResources(resouces: Resources): void {
	g.game.vars.resouces = resouces;
}
