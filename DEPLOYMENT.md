# GitHub Pages 展開ガイド

## 🚀 GitHub Pages でのゲーム展開方法

### 1. リポジトリの準備
このプロジェクトをGitHubリポジトリにプッシュします：

```bash
git remote add origin https://github.com/yourusername/color-chain-battle.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages の有効化

1. GitHubリポジトリのページに移動
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. Source で「Deploy from a branch」を選択
5. Branch で「main」を選択
6. Folder で「/ (root)」を選択
7. 「Save」をクリック

### 3. 展開完了

数分後、以下のURLでゲームがプレイできます：
```
https://yourusername.github.io/repositoryname/
```

## 📝 必要なファイル

- ✅ `index.html` - メインHTMLファイル
- ✅ `game.js` - ゲームロジック
- ✅ `README.md` - プロジェクト説明
- ✅ `DEPLOYMENT.md` - このファイル

## 🎯 展開後の確認事項

1. **ゲームの動作確認**
   - ゲームが正常に読み込まれるか
   - 両方の画面が表示されるか
   - クリック操作が機能するか

2. **レスポンシブデザイン**
   - デスクトップブラウザでの表示
   - タブレット・スマートフォンでの表示

3. **パフォーマンス**
   - ゲーム動作の滑らかさ
   - 画面切り替えの応答性

## 🔧 トラブルシューティング

### ゲームが表示されない場合

1. **キャッシュの問題**
   - ブラウザのキャッシュをクリア
   - ハードリフレッシュ (Ctrl+F5)

2. **ファイルパスの問題**
   - 相対パスが正しく設定されているか確認
   - `game.js`が正しく読み込まれているか確認

3. **JavaScript エラー**
   - ブラウザの開発者ツールでエラーを確認
   - コンソールログをチェック

### 更新が反映されない場合

1. **GitHub Pages の更新待機**
   - 変更が反映されるまで数分待機
   - Actions タブで展開状況を確認

2. **ブラウザキャッシュ**
   - シークレットモードでアクセス
   - 別のブラウザでテスト

## 📱 モバイル対応

ゲームはレスポンシブデザインで作成されており、以下のデバイスに対応：

- **デスクトップ**: Chrome, Firefox, Safari, Edge
- **タブレット**: iPad, Android タブレット
- **スマートフォン**: iPhone, Android スマートフォン

## 🌐 カスタムドメイン設定

独自ドメインを使用したい場合：

1. `CNAME` ファイルをリポジトリのルートに作成
2. ファイルにドメイン名を記述
3. DNS設定でGitHub Pagesを指定

## 📊 アクセス解析

Google Analytics や GitHub のトラフィック分析を活用して、ゲームのプレイ状況を把握できます。

## 🎉 展開完了！

これで「Color Chain Battle」がGitHub Pages上で世界中の人にプレイしてもらえるようになりました！

---

**問題が発生した場合は、GitHub の Issues でお知らせください。**