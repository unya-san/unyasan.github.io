window.onload = function () {
  init()
  setInterval(gameLoop, 10)
}

function gameLoop() {
  main_draw.clearRect(0, 0, canvas_width, canvas_height)
  main_map.draw_map()
  room_array.forEach(element => {
    element.draw_room()
  });
}

