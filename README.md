# Photo Organizer

📸 写真を撮影日ごとにフォルダに振り分けるクロスプラットフォーム デスクトップアプリケーション

## 機能

- ✨ **自動整理**: EXIF情報から撮影日を自動取得して写真を整理
- 📁 **フォルダ構成**: `YYYY/MM/DD` 形式で自動生成
- 🖼️ **複数形式対応**: JPG、PNG、GIF、BMP、WebP対応
- 🔄 **フォールバック**: EXIF情報がない場合はファイル更新日を使用
- 💻 **クロスプラットフォーム**: Windows、Mac、Linux対応
- 🎨 **モダンUI**: React + Electronで快適な操作性

## インストール

### 必要な環境

- Node.js 14 以上
- npm または yarn

### セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/tsuyoshi2008/photo-organizer.git
cd photo-organizer

# 依存関係をインストール
npm install

# 開発モードで起動
npm start

# ビルド（本番環境用）
npm run build
```

## 使い方

1. **フォルダを選択**: 整理したい写真が入っているフォルダを選択します
2. **プレビュー確認**: 検出された写真の情報を確認します
3. **実行**: 「写真を整理開始」ボタンをクリックして整理を開始します
4. **結果確認**: 整理結果のサマリーが表示されます

## 技術スタック

- **フロントエンド**: React 18
- **デスクトップ**: Electron
- **メタデータ取得**: piexifjs (EXIF情報読込)
- **UI/UX**: React Icons
- **ビルド**: electron-builder

## ファイル構成

```
photo-organizer/
├── public/
│   ├── electron.js          # Electronメインプロセス
│   ├── preload.js          # プリロード・スクリプト
│   ├── photo-organizer.js  # 写真整理ロジック
│   └── index.html          # HTML テンプレート
├── src/
│   ├── components/         # React コンポーネント
│   │   ├── FolderSelector.js
│   │   ├── PhotoPreview.js
│   │   ├── OrganizeButton.js
│   │   └── ResultsDisplay.js
│   ├── App.js              # メインコンポーネント
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## トラブルシューティング

### Electron が起動しない

```bash
# node_modules をクリアして再インストール
rm -rf node_modules package-lock.json
npm install
```

### EXIF情報が読み込めない

- JPEGファイル以外はEXIF情報を使用できません
- その場合、ファイルの更新日から自動的に日付を取得します

## ライセンス

MIT License

## 作者

tsuyoshi2008

## サポート

問題が発生した場合は、[Issue](https://github.com/tsuyoshi2008/photo-organizer/issues) を作成してください。
