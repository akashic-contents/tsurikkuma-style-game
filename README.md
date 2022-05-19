# つりっくま風ゲーム

つりっくまのような制限時間内に魚を釣るゲームのテンプレートになります。
改造することでオリジナルのゲームが作れます。

## 実行方法

以下のコマンドで実行できます。

```
npm install
npm run build
akashic-sandbox .
```

## ソースコード

- `script/main.ts`: 最初に実行されるコードです。
- `script/constants.ts`: ゲームで利用する定数がまとめられています。
- `script/entity/Sea.ts`: 海のエンティティです。次の機能が実装されています。
  - 出現する魚の管理
  - 一定間隔で魚を生成する処理
  - 生成した魚の管理
  - 魚と釣り針の当たり判定
- `script/entity/Fish.ts`: 魚のエンティティです。次の機能が実装されています。
  - 魚の描画
  - 泳ぐアニメーション
  - 釣られるアニメーション
- `script/entity/FishingRod.ts`: 釣り竿のエンティティです。次の機能が実装されています。
  - 釣り竿の描画
  - 釣るアニメーション
- `script/HUDManager.ts`: スコアや制限時間に関する機能が実装されています。
- `script/Resource.ts`: フォントや Timeline などゲーム全体で利用するリソースを保存します。

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](./LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
