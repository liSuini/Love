/**
 * 24个姿势的SVG教学示意图
 * 每个图为简化双人侧面线条轮廓，纯几何线条，教学示意风格
 * viewBox: 0 0 200 120
 * 人物A（蓝色 #4a90d9）在下方/前方，人物B（粉色 #e8788e）在上方/后方
 */

const C_A = '#4a90d9' // 人物A颜色
const C_B = '#e8788e' // 人物B颜色
const SW = 2.2        // 线宽

// 辅助：圆头
function head(cx, cy, r, color) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${SW}"/>`
}

// 辅助：线段
function line(x1, y1, x2, y2, color, w = SW) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
}

// 辅助：弧线
function arc(x1, y1, x2, y2, color, r = 20, sweep = 0) {
  return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${SW}" stroke-linecap="round"/>`
}

// 基础床面线
const bedLine = `<line x1="10" y1="110" x2="190" y2="110" stroke="#ccc" stroke-width="1.5" stroke-dasharray="4 3"/>`

export const poseSvgs = {
  // 1. 传教士式 — A仰卧，B在上方俯撑
  'pose-001': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(75,110,145,110,C_A)}${arc(75,100,145,110,C_A,12,0)}${line(75,100,80,75,C_A)}${line(80,75,110,75,C_A)}${line(110,75,120,100,C_A)}${head(85,70,6,C_A)}
    ${line(85,68,70,55,C_B)}${line(70,55,75,40,C_B)}${line(75,40,105,40,C_B)}${arc(105,40,120,55,C_B,10,0)}${line(120,55,115,68,C_B)}${head(110,33,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">传教士式</text>
  </svg>`,

  // 2. 女上位 — A仰卧，B跨坐面朝A
  'pose-002': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(60,110,140,110,C_A)}${arc(60,100,140,110,C_A,12,0)}${line(60,100,70,80,C_A)}${line(70,80,130,80,C_A)}${line(130,80,140,100,C_A)}${head(70,75,6,C_A)}
    ${arc(85,60,125,60,C_B,20,1)}${line(85,60,90,45,C_B)}${line(90,45,120,45,C_B)}${line(120,45,125,60,C_B)}${line(85,60,80,75,C_B)}${line(125,60,130,75,C_B)}${head(105,40,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">女上位</text>
  </svg>`,

  // 3. 侧卧式 — 双方面对面侧躺
  'pose-003': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(50,105,150,105,C_A)}${line(50,105,50,85,C_A)}${arc(50,85,100,80,C_A,30,1)}${line(100,80,150,105,C_A)}${head(55,82,6,C_A)}
    ${line(50,100,150,100,C_B)}${line(150,100,150,80,C_B)}${arc(150,80,100,75,C_B,30,0)}${line(100,75,50,100,C_B)}${head(145,77,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">侧卧式</text>
  </svg>`,

  // 4. 后入式 — A四肢撑地，B从后方
  'pose-004': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(80,110,95,110,C_A)}${line(95,110,100,90,C_A)}${arc(100,90,140,90,C_A,20,0)}${line(140,90,160,110,C_A)}${line(100,90,90,75,C_A)}${line(90,75,85,90,C_A)}${head(95,72,5,C_A)}
    ${line(50,110,65,110,C_B)}${line(65,110,75,90,C_B)}${arc(75,90,90,85,C_B,10,0)}${line(90,85,75,75,C_B)}${line(75,75,65,90,C_B)}${line(75,85,70,110,C_B)}${head(88,78,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">后入式</text>
  </svg>`,

  // 5. 坐姿面对面 — A坐姿，B跨坐面朝
  'pose-005': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(85,110,130,110,C_A)}${line(85,110,75,85,C_A)}${arc(75,85,120,75,C_A,25,1)}${line(120,75,130,110,C_A)}${head(80,80,6,C_A)}
    ${arc(85,55,120,55,C_B,18,1)}${line(85,55,90,38,C_B)}${line(90,38,115,38,C_B)}${line(115,38,120,55,C_B)}${line(85,55,82,70,C_B)}${line(120,55,123,70,C_B)}${head(105,33,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">坐姿面对面</text>
  </svg>`,

  // 6. 坐姿背对 — A坐姿，B背对跨坐
  'pose-006': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(80,110,130,110,C_A)}${line(80,110,70,85,C_A)}${arc(70,85,120,75,C_A,25,1)}${line(120,75,130,110,C_A)}${head(75,80,6,C_A)}
    ${arc(75,55,120,55,C_B,22,1)}${line(75,55,75,38,C_B)}${line(75,38,120,38,C_B)}${line(120,38,120,55,C_B)}${line(75,55,72,70,C_B)}${line(120,55,128,70,C_B)}${head(80,33,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">坐姿背对</text>
  </svg>`,

  // 7. 剪刀式 — 双方侧躺腿部交叉
  'pose-007': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(40,105,90,105,C_A)}${line(40,105,40,85,C_A)}${arc(40,85,90,90,C_A,25,0)}${line(90,90,140,80,C_A)}${head(45,82,5,C_A)}
    ${line(70,105,150,105,C_B)}${line(150,105,150,85,C_B)}${arc(150,85,100,90,C_B,25,1)}${line(100,90,60,80,C_B)}${head(145,82,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">剪刀式</text>
  </svg>`,

  // 8. 抬腿传教士 — A仰卧抬腿，B正面
  'pose-008': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(75,110,145,110,C_A)}${arc(75,110,100,95,C_A,15,0)}${line(100,95,95,65,C_A)}${line(95,65,85,50,C_A)}${head(90,45,5,C_A)}
    ${line(85,68,70,55,C_B)}${line(70,55,75,40,C_B)}${line(75,40,105,40,C_B)}${arc(105,40,120,55,C_B,10,0)}${line(120,55,115,68,C_B)}${head(110,33,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">抬腿传教士</text>
  </svg>`,

  // 9. 站立面对面 — 靠墙站立
  'pose-009': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="10" x2="40" y2="110" stroke="#ccc" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${line(45,110,65,110,C_A)}${line(45,110,45,60,C_A)}${line(45,60,50,35,C_A)}${line(50,35,60,35,C_A)}${line(60,35,65,60,C_A)}${line(55,60,75,55,C_A)}${head(52,28,5,C_A)}
    ${line(75,110,95,110,C_B)}${line(75,110,78,60,C_B)}${line(78,60,65,35,C_B)}${line(65,35,75,32,C_B)}${arc(75,32,90,45,C_B,10,0)}${line(90,45,95,75,C_B)}${line(85,55,80,60,C_B)}${head(72,26,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">站立面对面</text>
  </svg>`,

  // 10. 桌边后入 — A趴在桌边，B站立
  'pose-010': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="100" y1="85" x2="180" y2="85" stroke="#ccc" stroke-width="1.5"/>
    ${line(100,85,180,85,C_A)}${line(100,85,60,85,C_A)}${arc(60,85,50,70,C_A,10,1)}${line(50,70,55,55,C_A)}${line(55,55,65,55,C_A)}${line(65,55,70,70,C_A)}${line(60,70,55,85,C_A)}${head(58,50,5,C_A)}
    ${line(20,110,40,110,C_B)}${line(20,110,25,70,C_B)}${line(25,70,30,40,C_B)}${line(30,40,45,40,C_B)}${line(45,40,50,75,C_B)}${line(35,45,55,75,C_B)}${head(37,33,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">桌边后入</text>
  </svg>`,

  // 11. 莲座式 — A坐，B蹲姿面朝
  'pose-011': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(80,110,130,110,C_A)}${line(80,110,70,90,C_A)}${arc(70,90,120,85,C_A,25,1)}${line(120,85,130,110,C_A)}${head(75,85,6,C_A)}
    ${arc(85,60,115,60,C_B,15,1)}${line(85,60,78,80,C_B)}${line(78,80,82,110,C_B)}${line(115,60,122,80,C_B)}${line(122,80,118,110,C_B)}${line(85,60,90,40,C_B)}${line(90,40,110,40,C_B)}${line(110,40,115,60,C_B)}${head(100,35,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">莲座式</text>
  </svg>`,

  // 12. 改良传教士 — A仰卧垫枕，B正面
  'pose-012': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    <rect x="85" y="105" width="30" height="8" fill="none" stroke="#ddd" stroke-width="1" rx="3"/>
    ${line(65,105,145,110,C_A)}${arc(65,105,85,95,C_A,15,0)}${line(85,95,120,90,C_A)}${line(120,90,145,108,C_A)}${head(75,90,6,C_A)}
    ${line(85,68,70,55,C_B)}${line(70,55,75,40,C_B)}${line(75,40,105,40,C_B)}${arc(105,40,120,55,C_B,10,0)}${line(120,55,115,68,C_B)}${head(110,33,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">改良传教士</text>
  </svg>`,

  // 13. 反向女上位 — A仰卧，B背对跨坐
  'pose-013': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(60,110,140,110,C_A)}${arc(60,100,140,110,C_A,12,0)}${line(60,100,70,80,C_A)}${line(70,80,130,80,C_A)}${line(130,80,140,100,C_A)}${head(70,75,6,C_A)}
    ${arc(75,55,125,55,C_B,25,1)}${line(75,55,78,38,C_B)}${line(78,38,122,38,C_B)}${line(122,38,125,55,C_B)}${line(75,55,80,72,C_B)}${line(125,55,120,72,C_B)}${head(82,33,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">反向女上位</text>
  </svg>`,

  // 14. 侧入式 — A侧卧，B跪在旁边
  'pose-014': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(60,110,140,110,C_A)}${line(60,110,60,95,C_A)}${arc(60,95,140,100,C_A,40,0)}${line(140,100,155,85,C_A)}${head(65,90,5,C_A)}
    ${line(120,110,140,110,C_B)}${line(120,110,115,80,C_B)}${arc(115,80,125,70,C_B,8,0)}${line(125,70,140,75,C_B)}${line(140,75,145,80,C_B)}${line(125,70,120,80,C_B)}${head(128,65,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">侧入式</text>
  </svg>`,

  // 15. 合掌式 — 双方坐姿紧密贴合
  'pose-015': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(75,110,130,110,C_A)}${line(75,110,70,80,C_A)}${line(70,80,100,55,C_A)}${line(100,55,115,55,C_A)}${line(115,55,130,80,C_A)}${line(130,80,130,110,C_A)}${head(75,75,5,C_A)}
    ${line(70,110,75,75,C_B)}${line(75,75,100,50,C_B)}${line(100,50,115,50,C_B)}${line(115,50,130,75,C_B)}${line(130,75,130,110,C_B)}${arc(75,75,90,70,C_B,8,1)}${head(128,72,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">合掌式</text>
  </svg>`,

  // 16. 俯卧后入 — A俯卧，B上方
  'pose-016': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(60,110,160,110,C_A)}${arc(60,110,120,102,C_A,30,0)}${line(120,102,160,110,C_A)}${head(65,106,5,C_A)}
    ${line(85,95,70,80,C_B)}${line(70,80,75,60,C_B)}${line(75,60,105,60,C_B)}${arc(105,60,140,75,C_B,20,0)}${line(140,75,135,95,C_B)}${line(90,60,85,75,C_B)}${head(110,55,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">俯卧后入</text>
  </svg>`,

  // 17. 悬空式 — B站立托起A
  'pose-017': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(70,110,90,65,C_A)}${line(90,65,95,40,C_A)}${line(95,40,110,40,C_A)}${line(110,40,120,55,C_A)}${line(120,55,135,80,C_A)}${line(135,80,115,95,C_A)}${line(115,95,90,65,C_A)}${head(100,33,5,C_A)}
    ${line(60,110,80,110,C_B)}${line(60,110,68,65,C_B)}${line(68,65,75,35,C_B)}${line(75,35,90,35,C_B)}${line(90,35,95,70,C_B)}${line(90,35,88,55,C_B)}${line(88,55,65,60,C_B)}${head(82,28,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">悬空式</text>
  </svg>`,

  // 18. 曲膝后入 — A跪趴，B从后
  'pose-018': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(75,110,95,110,C_A)}${line(95,110,100,85,C_A)}${arc(100,85,145,85,C_A,25,0)}${line(145,85,160,110,C_A)}${line(100,85,70,75,C_A)}${line(70,75,75,85,C_A)}${head(80,72,5,C_A)}
    ${line(45,110,60,110,C_B)}${line(45,110,52,70,C_B)}${line(52,70,60,40,C_B)}${line(60,40,75,40,C_B)}${line(75,40,80,75,C_B)}${line(65,45,85,70,C_B)}${head(67,33,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">曲膝后入</text>
  </svg>`,

  // 19. 仰卧抬腿 — A坐姿，B仰卧抬腿
  'pose-019': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(80,110,130,110,C_A)}${line(80,110,70,85,C_A)}${arc(70,85,110,70,C_A,20,1)}${line(110,70,130,85,C_A)}${head(75,80,5,C_A)}
    ${line(100,110,170,110,C_B)}${arc(100,110,115,95,C_B,15,0)}${line(115,95,110,65,C_B)}${line(110,65,100,45,C_B)}${line(100,45,90,35,C_B)}${line(90,35,95,60,C_B)}${line(95,60,115,70,C_B)}${head(88,30,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">仰卧抬腿</text>
  </svg>`,

  // 20. 莲花式 — 双方盘腿坐姿
  'pose-020': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(65,110,135,110,C_A)}${line(65,110,60,90,C_A)}${arc(60,90,90,80,C_A,15,1)}${line(90,80,100,75,C_A)}${line(100,75,100,55,C_A)}${line(100,55,90,55,C_A)}${line(90,55,90,80,C_A)}${line(100,75,110,80,C_A)}${arc(110,80,135,90,C_A,15,0)}${head(80,72,5,C_A)}
    ${line(80,110,135,110,C_B)}${line(135,110,140,90,C_B)}${arc(140,90,120,80,C_B,12,0)}${line(120,80,110,75,C_B)}${line(110,75,105,55,C_B)}${line(105,55,120,55,C_B)}${line(120,55,115,80,C_B)}${head(118,75,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">莲花式</text>
  </svg>`,

  // 21. 仰卧女上位 — A半躺，B跨坐
  'pose-021': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    <rect x="55" y="100" width="25" height="10" fill="none" stroke="#ddd" stroke-width="1" rx="3"/>
    ${line(55,110,130,110,C_A)}${arc(55,110,80,100,C_A,20,0)}${line(80,100,130,108,C_A)}${head(62,102,5,C_A)}
    ${arc(85,55,125,55,C_B,20,1)}${line(85,55,90,38,C_B)}${line(90,38,120,38,C_B)}${line(120,38,125,55,C_B)}${line(85,55,80,72,C_B)}${line(125,55,130,72,C_B)}${head(105,33,6,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">仰卧女上位</text>
  </svg>`,

  // 22. 桥式 — A仰卧抬臀，B从上方跪姿
  'pose-022': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(60,110,80,110,C_A)}${line(80,110,75,95,C_A)}${arc(75,95,130,75,C_A,30,0)}${line(130,75,145,110,C_A)}${head(72,90,5,C_A)}
    ${line(100,75,95,55,C_B)}${line(95,55,85,45,C_B)}${line(85,45,100,42,C_B)}${arc(100,42,115,55,C_B,10,0)}${line(115,55,110,75,C_B)}${line(90,75,90,70,C_B)}${line(115,75,115,70,C_B)}${head(102,37,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">桥式</text>
  </svg>`,

  // 23. T字形侧入 — A仰卧，B侧躺垂直
  'pose-023': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(40,110,160,110,C_A)}${arc(40,110,100,100,C_A,35,0)}${line(100,100,160,110,C_A)}${head(45,106,5,C_A)}
    ${line(95,110,95,60,C_B)}${line(95,60,85,40,C_B)}${line(85,40,100,38,C_B)}${arc(100,38,110,55,C_B,10,0)}${line(110,55,110,80,C_B)}${line(100,38,95,110,C_B)}${head(92,33,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">T字形侧入</text>
  </svg>`,

  // 24. 双人仰卧 — 双方侧躺汤匙
  'pose-024': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bedLine}
    ${line(40,105,70,105,C_A)}${line(40,105,40,88,C_A)}${arc(40,88,120,90,C_A,40,1)}${line(120,90,150,105,C_A)}${head(45,85,5,C_A)}
    ${line(55,105,85,105,C_B)}${line(55,105,55,88,C_B)}${arc(55,88,135,90,C_B,40,1)}${line(135,90,165,105,C_B)}${head(60,85,5,C_B)}
    <text x="100" y="8" text-anchor="middle" font-size="6" fill="#999">双人仰卧</text>
  </svg>`,
}

export function getPoseSvg(poseId) {
  return poseSvgs[poseId] || null
}
