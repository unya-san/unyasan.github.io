class map {
  constructor(x, y) {
    this.x = x
    this.y = y
    this._map = []
    this.reset()
  }

  update_map(x, y, value) {
    for (var i = 0; i < this.x; i++) {
      if (x == i) {
        for (var j = 0; j < this.y; j++) {
          if (y == j) {
            this._map[i][j] = value
            return
          }
        }
      }
    }
    console.log(`なし${x},${y}`)
  }

  reset() {
    for (var i = 0; i < this.x; i++) {
      this._map[i] = []
      for (var j = 0; j < this.y; j++) {
        this._map[i][j] = 0
      }
    }
  }

  draw_map() {
    square2(main_draw, 0, 0, this.x * IMG_SIZE, this.y * IMG_SIZE, DEF_THICK, "orange")
    for (var i = 0; i < this.x; i++) {
      for (var j = 0; j < this.y; j++) {
        if (this._map[i][j] == 0) {
          main_draw.drawImage(tree_img, i * IMG_SIZE, j * IMG_SIZE, IMG_SIZE, IMG_SIZE)
        } else if (this._map[i][j] == 2) {
          main_draw.drawImage(rock_img, i * IMG_SIZE, j * IMG_SIZE, IMG_SIZE, IMG_SIZE)
        }
      }
    }
  }
}

class room {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.enable = 0

    this.xx1 = 0
    this.yy1 = 0
    this.xx2 = 0
    this.yy2 = 0

    this.passA = new pass(0, 0, 0, 0)
    this.passB = new pass(0, 0, 0, 0)
    this.passC = new pass(0, 0, 0, 0)
  }

  get room_size() {
    return (this.x2 - this.x1) * (this.y2 - this.y1)
  }

  get room_pos() {
    return [this.x1, this.y1, this.x2, this.y2]
  }

  set room_enable(en) {
    this.enable = en
  }

  set set_pass(pos) {
    if (this.enable) {
      this.xx1 = pos[0]
      this.yy1 = pos[1]
      this.xx2 = pos[2]
      this.yy2 = pos[3]
    }
  }

  draw_pass() {
    fill_map(this.xx1, this.yy1, this.xx2, this.yy2, 1)
  }

  room_para(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  draw_room() {
    if (this.room_size > ROOM_SIZE_MIN) {
      square2(main_draw, this.x1 * IMG_SIZE, this.y1 * IMG_SIZE, this.x2 * IMG_SIZE, this.y2 * IMG_SIZE, DEF_THICK, "green")
    }
  }
}

class pass {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  draw_pass() {
    fill_map(this.x1, this.y1, this.x2, this.y2, 1)
  }

  set set_pass(pos) {
    this.x1 = pos[0]
    this.y1 = pos[1]
    this.x2 = pos[2]
    this.y2 = pos[3]
  }
  pass() {
    return [this.x1, this.y1, this.x2, this.y2]
  }
}