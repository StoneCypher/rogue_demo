var map = '##+#########' +  // todo: remove player, creatures, objects
        '\n#@....######' +
        '\n#...R.##...#' +
        '\n#.$...##.w.#' +
        '\n###+####...#' +
        '\n###....=..w#' +
        '\n########...#' +
        '\n############';

function MapDraw(map) {
  return '<pre>' + map.toString() + '</pre>';
}

function onStart() {
  document.body.innerHTML = MapDraw(map);
}

window.onload = onStart;
