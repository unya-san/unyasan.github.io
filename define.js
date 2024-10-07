var main_canvas //キャンバス
var main_draw   //2dオブジェクト

var main_map    //全体マップ
var room_array = []

const MAP_WIDTH = 50
const MAP_HEIGHT = 50
const ROOM_SIZE_MIN = 25
const Room_SIZE_MAX = 100
const ROOM_NUM = 5
const ROOM_MIN_WIDTH = 15
const IMG_SIZE = 16
const MIN_WIDTH = 4
const MIN_HEIGHT = 4

const DEF_THICK = 5

const tree_img = new Image()
const rock_img = new Image()

let canvas_height
let canvas_width

let rand_pos = []
let pass_pos = []
let pass_pair = []