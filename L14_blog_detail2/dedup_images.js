const fs = require("node:fs").promises;
const path = require("node:path");

// 需要保留的文件列表
const filesToKeep = [
  "2026-2-26-17-0-11-571-d9fb4.jpeg",
  "2021-7-28-15-15-33-316-3fc18.jpeg",
  "2021-6-29-10-23-30-427-57add.jpg",
  "2026-2-26-17-0-50-312-e7595.jpg",
  "2026-2-26-15-47-13-596-09773.jpg",
  "2026-2-26-17-14-50-855-88f5e.jpg",
  "2026-2-28-12-50-59-363-f9883.jpg",
];

// 将保留的文件列表转换为Set，方便快速查找
const keepSet = new Set(filesToKeep);

async function cleanImages() {
  try {
    // 获取当前文件夹下的所有文件
    const files = await fs.readdir(process.cwd());

    // 过滤出所有.jpg和.jpeg文件
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".jpg" || ext === ".jpeg";
    });

    console.log(`找到 ${imageFiles.length} 个图片文件`);

    let deletedCount = 0;
    let keptCount = 0;

    // 遍历所有图片文件
    for (const file of imageFiles) {
      // 检查文件是否在保留列表中
      if (keepSet.has(file)) {
        console.log(`✅ 保留: ${file}`);
        keptCount++;
      } else {
        try {
          // 删除文件
          await fs.unlink(path.join(process.cwd(), file));
          console.log(`❌ 删除: ${file}`);
          deletedCount++;
        } catch (err) {
          console.error(`删除失败 ${file}:`, err.message);
        }
      }
    }

    console.log("\n========== 操作完成 ==========");
    console.log(`保留文件数: ${keptCount}`);
    console.log(`删除文件数: ${deletedCount}`);
    console.log("==============================");
  } catch (err) {
    console.error("执行过程中出现错误:", err);
  }
}

// 执行清理函数
cleanImages();
