console.log('module b');

const req = require.context('./icons/svg', false, /\.svg$/);
console.log('req.keys():', req.keys());

const box = document.querySelector('.box');

// 动态导入所有 SVG 并创建对应的图标
req.keys().forEach(key => {
  const {default: symbol} = req(key);
  console.log(`Symbol for ${key}:`, symbol);
  
  // 根据需要创建对应的 SVG 元素
  // const iconName = key.match(/\.\/(.*)\.svg$/)[1];
  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.classList.add('icon');
  
  const iconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  iconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${symbol.id}`);
  iconSvg.appendChild(iconUse);
  
  box.append(iconSvg);
});