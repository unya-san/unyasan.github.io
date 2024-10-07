function init() {
  main_canvas = document.getElementById('main')
  main_draw = main_canvas.getContext('2d')
  main_map = new map(MAP_WIDTH, MAP_HEIGHT)

  const { width: w, height: h } = main_canvas;
  canvas_width = w
  canvas_height = h

  init_image()
}

function randome(max, min) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

//Roomクラス初期化
function reset_room() {
  room_array = null
  room_array = new Array(0)
  main_map.reset()
}

//マップを分割
function slice_map() {
  reset_room()
  var flag = false
  var temp_room = new room(0, 0, MAP_WIDTH, MAP_HEIGHT)
  room_array.push(temp_room)

  var room1
  var room2

  //1辺が最小サイズになるまでランダムな値で分割を続ける
  while (!flag) {
    flag = true
    for (var i = 0; i < room_array.length; i++) {
      if (room_array[i].x2 - room_array[i].x1 > ROOM_MIN_WIDTH && room_array[i].y2 - room_array[i].y1 > ROOM_MIN_WIDTH) {
        flag = false    //最小サイズより大きかったらループやり直し
        if (room_array[i].x2 - room_array[i].x1 > room_array[i].y2 - room_array[i].y1) {
          var rand = randome(room_array[i].x2 - 5, room_array[i].x1 + 5)
          room1 = new room(room_array[i].x1, room_array[i].y1, rand, room_array[i].y2)
          room2 = new room(rand, room_array[i].y1, room_array[i].x2, room_array[i].y2)
        } else {
          var rand = randome(room_array[i].y2 - 5, room_array[i].y1 + 5)
          room1 = new room(room_array[i].x1, room_array[i].y1, room_array[i].x2, rand)
          room2 = new room(room_array[i].x1, rand, room_array[i].x2, room_array[i].y2)
        }
        room_array.splice(i, 1, room1, room2)
        break   //分割をしたら頭のRoomクラスからやり直す
      }
    }
  }
  //console.log(room_array)
  //console.log("2 : " + room_array[2])
}

//Roomクラスの内部に部屋を作る
function make_room() {
  console.log("2 : " + room_array[2])
  flag = false
  var room_num = 0
  while (!flag) {
    for (i = 0; i < room_array.length; i++) {
      var pos = room_array[i].room_pos
      var rand_pos = [randome(pos[2] - 2, pos[0]), randome(pos[3] - 2, pos[1])]
      var r = randome(0, 100)
      if (room_array[i].enable == 0) {
        //20%の確率で部屋ができる
        if (r < 20) {
          room_array[i].room_enable = 1
          room_num++
          //console.log(room_num + "番目の部屋")
          main_map.update_map(rand_pos[0], rand_pos[1], 1)
          set_room(room_array[i], rand_pos[0], rand_pos[1])
        } else {
          room_array[i].room_enable = 0
        }
      }
      if (room_num >= ROOM_NUM) {
        flag = true
        break
      }
    }
    //flag = true
  }
}

//Room内に収まるようにランダムな部屋を作成する
function set_room(R, rx, ry) {
  var x_max = R.x2 - R.x1 - 1
  var y_max = R.y2 - R.y1 - 1
  rw = randome(x_max, MIN_WIDTH)
  rh = randome(y_max, MIN_HEIGHT)
  //console.log("[rw:" + rw + "][rh:" + rh + "][rx:" + rx + "][ry:" + ry + "][x2:" + R.x2 + "][y2:" + R.y2 + "]")
  var x1, x2, y1, y2, diff

  //作った部屋がRoomに収まるならそのまま、収まらないなら収まるようにずらす
  if (rx + rw >= R.x2) {
    diff = rx + rw - R.x2
    x1 = rx - diff
    x2 = x1 + rw - 1
  } else {
    x1 = rx
    x2 = rx + rw
  }
  if (ry + rh >= R.y2) {
    diff = ry + rh - R.y2
    y1 = ry - diff
    y2 = y1 + rh - 1
  } else {
    y1 = ry
    y2 = ry + rh
  }
  R.set_pass = [x1, y1, x2, y2]
  R.draw_pass()
  //console.log("[x1:" + x1 + "][x2:" + x2 + "][y1:" + y1 + "][y2:" + y2 + "]")
}

//Room間をつなぐ道を作る
function make_pass() {
  rand_pos = []
  pass_pair = []
  room_array.forEach(element => {
    if (element.enable == 0) {
      var rand_x = randome(element.x2 - 1, element.x1)
      var rand_y = randome(element.y2 - 1, element.y1)
      //(ランダム座標[2], 部屋無し, 部屋のサイズ[4])
      rand_pos.push([rand_x, rand_y, 0, element.x1, element.y1, element.x2, element.y2, element])
    } else {
      for (var i = 0; i < randome(3, 1); i++) {
        var rand_x = randome(element.xx2 - 1, element.xx1)
        var rand_y = randome(element.yy2 - 1, element.yy1)
        //(ランダム座標[2], 部屋あり, 部屋のサイズ[4])
        rand_pos.push([rand_x, rand_y, 1, element.x1, element.y1, element.x2, element.y2, element])
      }
    }
  });

  for (var i = 0; i < rand_pos.length; i++) {
    var min1, min2, min3
    min1 = min2 = min3 = 1000
    var a, b, c
    a = b = c = 0
    //自分の点から近い2点を求める
    for (var j = 0; j < rand_pos.length; j++) {
      if (rand_pos[i][7] == rand_pos[j][7]) {
        //console.log("自分と同じ部屋")
      } else {
        var dis = 10000
        if (i != j) {
          dis = culc_distance(rand_pos[i][0], rand_pos[i][1], rand_pos[j][0], rand_pos[j][1])
        }
        //console.log(`[${rand_pos[a][3]}, ${rand_pos[a][4]}] != [${rand_pos[j][3]}, ${rand_pos[j][4]}] randpos${rand_pos[j][0]},${rand_pos[j][1]}`)
        if (dis < min1) {
          min3 = min2
          min2 = min1
          min1 = dis
          c = b
          b = a
          a = j
        } else if (dis < min2) {
          min3 = min2
          min2 = dis
          c = b
          b = j
        } else if (dis < min3) {
          min3 = dis
          c = j
        }
      }
    }
    console.log(`岩${i} pos:${[rand_pos[i][0], rand_pos[i][1]]} a:${a} b:${b} c:${c}`)
    //console.log(`pos:[${rand_pos[i][0]},${rand_pos[i][1]}]\n近い1:[${rand_pos[a][0]},${rand_pos[a][1]}]\n近い2:[${rand_pos[b][0]},${rand_pos[b][1]}]`)
    //道が引かれているかチェック
    if (check_pass_pair(i, a) == true) {
      link_pass(rand_pos[i], rand_pos[a])
    }
    if (check_pass_pair(i, b) == true) {
      link_pass(rand_pos[i], rand_pos[c])
    }
  }
  pass_pos.forEach(element => {
    element.draw_pass()
  });
}

function fill_map(a1, b1, a2, b2, c) {
  if (a1 == a2) {
    for (var b = b1; b < b2; b++) {
      main_map.update_map(a1, b, c)
    }
  } else if (b1 == b2) {
    for (var a = a1; a < a2; a++) {
      main_map.update_map(a, b1, c)
    }
  } else {
    for (var a = a1; a < a2; a++) {
      for (var b = b1; b < b2; b++) {
        main_map.update_map(a, b, c)
      }
    }
  }
}

function culc_distance(x1, y1, x2, y2) {
  var dis = 0
  dis = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  return dis
}

function check_pass_pair(pass1, pass2) {
  var f = true
  try {
    pass_pair.forEach(element => {
      if ((element[0] == pass2 && element[1] == pass1) || (element[0] == pass1 && element[1] == pass2)) {
        //console.log('同じペアあり')
        f = false
      }
    });
  } catch (e) {
    f = true
  }
  if (f == false) {
    return f
  } else {
    pass_pair.push([pass1, pass2])
    return true
  }
}

function link_pass(pass1, pass2) {
  var A = { x: pass1[0], y: pass1[1] }
  var B = { x: pass2[0], y: pass2[1] }
  var rad = Math.atan2(B.y - A.y, B.x - A.x)
  var deg = rad * (180 / Math.PI)
  //console.log(`角度${deg}`)
  //console.log(`pass1:${pass1}\npass2:${pass2}`)
  if ((deg >= 0 && deg < 45)) {
    link_pass_yoko(pass1, pass2, 1)
  } else if (deg < -135 && deg >= -180) {
    link_pass_yoko(pass2, pass1, 1)
  } else if ((deg >= 135 && deg <= 180)) {
    link_pass_yoko(pass1, pass2, 2)
  } else if (deg < 0 && deg >= -45) {
    link_pass_yoko(pass2, pass1, 2)
  } else if ((deg >= 45 && deg < 90)) {
    link_pass_tate(pass1, pass2, 1)
  } else if (deg < -90 && deg >= -135) {
    link_pass_tate(pass2, pass1, 1)
  } else if ((deg >= 90 && deg <= 135)) {
    link_pass_tate(pass1, pass2, 2)
  } else if (deg < -45 && deg >= -90) {
    link_pass_tate(pass2, pass1, 2)
  } else {
    console.log('おかしい')
  }
  main_map.update_map(pass1[0], pass1[1], 2)
  main_map.update_map(pass2[0], pass2[1], 2)

}

function link_pass_yoko(pass1, pass2, d) {
  var limX = (pass1[5] < pass2[5]) ? pass1[5] : Math.floor((pass1[0] + pass2[0]) / 2)
  for (var i = pass1[0]; i <= limX; i++) {
    main_map.update_map(i, pass1[1], 1)
  }
  if (d == 1) {
    for (var i = pass1[1]; i <= pass2[1]; i++) {
      main_map.update_map(limX, i, 1)
    }
  } else {
    for (var i = pass2[1]; i <= pass1[1]; i++) {
      main_map.update_map(limX, i, 1)
    }
  }
  for (var i = limX; i <= pass2[0]; i++) {
    main_map.update_map(i, pass2[1], 1)
  }
}
function link_pass_tate(pass1, pass2, d) {
  var limY = (pass1[6] < pass2[6]) ? pass1[6] : Math.floor((pass1[1] + pass2[1]) / 2)
  for (var i = pass1[1]; i <= limY; i++) {
    main_map.update_map(pass1[0], i, 1)
  }
  if (d == 1) {
    for (var i = pass1[0]; i <= pass2[0]; i++) {
      main_map.update_map(i, limY, 1)
    }
  } else {
    for (var i = pass2[0]; i <= pass1[0]; i++) {
      main_map.update_map(i, limY, 1)
    }
  }
  for (var i = limY; i <= pass2[1]; i++) {
    main_map.update_map(pass2[0], i, 1)
  }
}

function init_image() {
  tree_img.src = ("image/tree.png")
  rock_img.src = ("image/rock.png")
}