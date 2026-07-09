const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const piexif = require('piexifjs');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

/**
 * 画像ファイルから撮影日を取得
 * EXIFデータを優先、なければファイル更新日を使用
 */
async function getPhotoDate(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // JPEG の場合のみ EXIF 情報を取得
    if (ext === '.jpg' || ext === '.jpeg') {
      const data = await fs.readFile(filePath);
      try {
        const exif = piexif.load(data.buffer);
        const exifDate = exif['Exif'][piexif.ExifIFD.DateTimeOriginal];
        
        if (exifDate) {
          const dateStr = exifDate.toString();
          // EXIF形式: "YYYY:MM:DD HH:MM:SS"
          const [datePart] = dateStr.split(' ');
          const [year, month, day] = datePart.split(':');
          return new Date(year, parseInt(month) - 1, day);
        }
      } catch (e) {
        // EXIF取得失敗時はファイル更新日を使用
      }
    }
    
    // ファイル更新日を取得
    const stats = await fs.stat(filePath);
    return new Date(stats.mtime);
  } catch (error) {
    console.error(`Error getting photo date for ${filePath}:`, error);
    return new Date();
  }
}

/**
 * 写真情報を取得
 */
async function getPhotoInfo(filePath) {
  try {
    const date = await getPhotoDate(filePath);
    const stats = await fs.stat(filePath);
    
    return {
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      date: date.toISOString(),
      year: date.getFullYear(),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 写真を撮影日ごとにフォルダに振り分け
 */
async function organizePhotos(sourceFolder, destFolder) {
  const results = {
    total: 0,
    moved: 0,
    failed: 0,
    errors: [],
    summary: {},
  };

  try {
    // ソースフォルダの存在確認
    const stats = await fs.stat(sourceFolder);
    if (!stats.isDirectory()) {
      throw new Error('ソースフォルダが見つかりません');
    }

    // 出力フォルダの存在確認・作成
    const outputFolder = destFolder || sourceFolder;
    await fs.mkdir(outputFolder, { recursive: true });

    // フォルダ内の全ファイルを取得
    const files = await fs.readdir(sourceFolder, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(sourceFolder, file.name);
      const ext = path.extname(file.name).toLowerCase();

      // 画像ファイルのみ処理
      if (!IMAGE_EXTENSIONS.includes(ext)) {
        continue;
      }

      results.total++;

      try {
        // 撮影日情報を取得
        const photoInfo = await getPhotoInfo(filePath);
        const { year, month, day } = photoInfo;

        // 移動先フォルダを作成
        const destFolderPath = path.join(outputFolder, year, month, day);
        await fs.mkdir(destFolderPath, { recursive: true });

        // ファイルを移動
        const destPath = path.join(destFolderPath, file.name);
        await fs.rename(filePath, destPath);

        results.moved++;

        // サマリーを更新
        const folderKey = `${year}/${month}/${day}`;
        results.summary[folderKey] = (results.summary[folderKey] || 0) + 1;
      } catch (error) {
        results.failed++;
        results.errors.push({
          file: file.name,
          error: error.message,
        });
      }
    }
  } catch (error) {
    throw error;
  }

  return results;
}

/**
 * フォルダツリーを取得
 */
async function getDirectoryTree(dirPath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return null;

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const tree = {
      name: path.basename(dirPath),
      path: dirPath,
      type: 'directory',
      children: [],
    };

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        const subTree = await getDirectoryTree(itemPath, maxDepth, currentDepth + 1);
        if (subTree) {
          tree.children.push(subTree);
        }
      }
    }

    return tree;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return null;
  }
}

/**
 * フォルダ内のファイル一覧を取得
 */
async function getDirectoryFiles(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const stats = await fs.stat(itemPath);

      files.push({
        name: item.name,
        path: itemPath,
        type: item.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        modified: stats.mtime.toISOString(),
      });
    }

    return files;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    throw error;
  }
}

module.exports = {
  getPhotoDate,
  getPhotoInfo,
  organizePhotos,
  getDirectoryTree,
  getDirectoryFiles,
};