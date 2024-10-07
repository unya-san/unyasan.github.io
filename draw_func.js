function square(fig, x1, y1, x2, y2) {
  fig.fillRect(x1, y1, x2 - x1, y2 - y1);
}

function line(fig, x1, y1, x2, y2, thick, color) {
  fig.beginPath();            // 新しいパスを作成
  fig.lineWidth = thick;      // 線の太さ
  fig.strokeStyle = color;    // 線の色
  fig.moveTo(x1, y1);          // 線の開始座標
  fig.lineTo(x2, y2);          // 線の終了座標
  fig.stroke();               // 輪郭を描画
}

function square2(fig, x1, y1, x2, y2, thick, color) {
  line(fig, x1, y1, x1, y2, thick, color)
  line(fig, x1, y1, x2, y1, thick, color)
  line(fig, x2, y2, x2, y1, thick, color)
  line(fig, x2, y2, x1, y2, thick, color)
}