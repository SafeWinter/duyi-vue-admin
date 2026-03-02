const fs = require("node:fs").promises;
const path = require("node:path");

// 需要保留的文件列表
const filesToKeep = [
  "2026-3-2-14-34-9-864-dd6c4.jpg",
  "2026-3-2-14-34-26-646-a6f0f.jpg",
  "2026-3-2-14-34-39-925-0b192.jpg",
  "2026-3-2-14-34-16-14-05e72.jpg",
  "2026-3-2-14-34-32-522-4a2e1.jpg",
  "2026-3-2-14-34-44-619-0e079.jpg",
  "2026-3-1-21-16-21-501-9529e.jpg",
  "2026-3-1-21-16-46-707-87fe0.jpg",
  "2026-3-1-21-16-58-213-35bc2.jpg",
  "2026-3-1-21-16-38-173-b6fd2.jpg",
  "2026-3-2-0-49-58-180-02bf1.jpg",
  "2026-3-2-10-43-14-731-e1648.jpg",
  "2026-3-2-10-45-3-596-25be8.jpg",
  "2026-3-2-10-46-37-408-3abb2.jpg",
  "2026-3-2-10-45-32-886-f2fb9.jpg",
  "2026-3-2-10-46-18-820-a5ad1.jpg",
  "2026-3-2-10-45-57-134-ac31f.jpg",
  "2026-3-2-10-42-59-59-a7130.jpg",
  "2026-3-2-10-43-41-202-7238f.jpg",
  "2026-3-2-11-39-4-635-f11ac.jpg",
  "2026-3-2-10-43-54-700-78960.jpeg",
  "2026-3-2-10-44-44-341-f7599.jpeg",
  "2026-3-2-10-44-25-228-65ca5.jpg",
  "2026-3-2-10-44-8-45-80a34.jpg",
  "2026-3-2-10-42-43-545-9b57d.jpg",
  "2026-3-2-11-41-8-280-3ac1f.jpg",
  "2021-7-28-16-20-54-778-3c658.jpeg",
  "2021-8-4-16-49-3-965-15fe4.png",
  "2021-8-4-16-48-42-640-0cff7.jpeg",
  "favicon.ico",
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
