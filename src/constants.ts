/**
 * ゲーム定数
 */

/**
 * 制限時間(セッションパラメータで制限時間が指定されたらその値を使用します)
 */
export const TIMELIMIT = 30;

/**
 * フォントサイズ
 */
export const FONT_SIZE = 36;

/**
 * フォントファミリー
 */
export const FONT_FAMILY = g.FontFamily.SansSerif;

/**
 * 背景の色
 */
export const BACKGROUND_COLOR = "#3fa7ff";

/**
 * 背景の透過度
 */
export const BACKGROUND_ALPHA = 0.8;

/**
 * 島の色
 */
export const ISLAND_COLOR = "#ffeca8";

/**
 * 島の大きさ
 */
export const ISLAND_SIZE = {width: 200, height: 80};

/**
 * 島の座標
 */
export const ISLAND_POS = {x: 0, y: g.game.height * 0.5 - ISLAND_SIZE.height};

/**
 * 草の色
 */
export const GRASS_COLOR = "#549637";

/**
 * 草の大きさ
 */
export const GRASS_SIZE = {width: ISLAND_SIZE.width - 40, height: ISLAND_SIZE.height / 2};

/**
 * 草の座標
 */
export const GRASS_POS = {x: 0, y: ISLAND_POS.y - 20};

/**
 * 水面の高さ
 */
export const WATERSURFACE_POS = {x: 0, y: g.game.height * 0.4};

/**
 * 水面の色
 */
export const WATERSURFACE_COLOR = "#252525";

/**
 * くまの色
 */
export const BEAR_COLOR = "white";

/**
 * くまの大きさ
 */
export const BEAR_SIZE = {width: 50, height: 65};

/**
 * くまの座標
 */
export const BEAR_POS = {x: 100, y: GRASS_POS.y - BEAR_SIZE.height / 2};

/**
 * 魚のサイズ（横幅は魚の名前の長さに依存
 */
export const FISH_FONT_SIZE = 36;

/**
 * 魚の生成間隔[ミリ秒]
 */
export const FISH_INTERVAL = 2000;

/**
 * 魚が泳ぐ時間範囲[ミリ秒]
 */
export const SWIMMING_TIME_RANGE = {min: 5000, max: 10000};

/**
 * 釣り竿の色
 */
export const ROD_COLOR = "#835031";

/**
 * 釣り竿の大きさ
 */
export const ROD_SIZE = {width: 3, height: 100};

/**
 * 釣り竿の座標
 */
export const ROD_POS = {x: 155, y: 50};

/**
 * 釣り竿の角度
 */
export const ROD_ANGLE = 30;

/**
 * 釣り糸の色
 */
export const ROD_STRING_COLOR = "#252525";

/**
 * 釣り糸の大きさ
 */
export const ROD_STRING_SIZE = {width: 3, height: 280};

/**
 * 釣り糸の座標
 */
export const ROD_STRING_POS = {x: 180, y: ROD_POS.y + 8};

/**
 * 釣り上げ時の釣り糸の長さ
 */
export const ROD_STRING_HEIGHT_WHEN_UP = ROD_STRING_SIZE.height / 5;

/**
 * 釣り針の色
 */
export const HOOK_COLOR = "#525252";

/**
 * 釣り針の大きさ
 */
export const HOOK_SIZE = {width: FISH_FONT_SIZE, height: FISH_FONT_SIZE};

/**
 * 釣り針の座標
 */
export const HOOK_POS = {x: ROD_STRING_POS.x - 30, y: ROD_POS.y + ROD_STRING_SIZE.height};

/**
 * 釣り上げ時の釣り針の高さ
 */
export const HOOK_POS_WHEN_UP = {x: HOOK_POS.x, y: HOOK_POS.y / 4};

/**
 * スコアラベルフォーマット
 */
export const SCORE_LABEL_FORMAT = "SCORE:";

/**
 * 制限時間ラベルのフォーマット
 */
export const TIME_LABEL_FORMAT = "TIME:";

/**
 * 釣りに要する時間[ミリ秒]
 */
export const FISHING_DURATION = 1000;

/**
 * 釣り待機時間[ミリ秒]
 */
export const FISHING_WAIT_DURATION = 300;

/**
 * スタック時間[ミリ秒]
 */
export const STUCK_DURATION = 2000;
