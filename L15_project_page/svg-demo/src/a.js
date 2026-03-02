console.log('module a');

const req = require.context('./icons/svg', false, /\.svg$/);
console.log('req.keys():', req.keys());

const box = document.querySelector('.box');

// 动态导入所有 SVG 并创建对应的图标
req.keys().forEach(key => {
  const {default: symbol} = req(key);
  console.log(`Symbol for ${key}:`, symbol);
  // console.log('Symbol content:', symbol.content); // 这里是完整的 symbol 字符串
  
  // 使用 DOMParser 解析 symbol.content
  const parser = new DOMParser();
  const doc = parser.parseFromString(symbol.content, 'image/svg+xml');
  const symbolElement = doc.documentElement;
  
  // 创建 SVG 元素
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // 复制 symbol 的所有属性到 svg
  Array.from(symbolElement.attributes).forEach(attr => {
    svg.setAttribute(attr.name, attr.value);
  });
  
  // 复制 symbol 的所有子节点到 svg
  Array.from(symbolElement.childNodes).forEach(node => {
    svg.appendChild(node.cloneNode(true));
  });
  
  // 添加样式类
  svg.classList.add('icon');
  
  box.append(svg);
});