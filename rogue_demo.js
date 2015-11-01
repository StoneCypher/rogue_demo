
'use strict';

var str_map = '##+#########' +  // todo: remove player, creatures, objects
            '\n#@....######' +
            '\n#...R.##...#' +
            '\n#.$...##.p.#' +
            '\n###+####...#' +
            '\n###....=..p#' +
            '\n########...#' +
            '\n############';

function cell(input) {

  var content  = input,
      isPlayer = (input === '@');

  return {
    htmlRepresentation: function() { return isPlayer? ('<span style="color:blue">' + content + '</span>') : content; }
  };

}

var RenderCell         =      cell => '<td>' + cell.htmlRepresentation() + '</td>',
    RenderRow          =       row => '<tr>' + (row.map(RenderCell).join('')) + '</tr>',
    RenderMap          =   mapdata => '<table id="gamemap"><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>',
    mapStringToGameMap = mapString => mapString.split('\n').map( row => row.split('').map(chr => cell(chr)) );

function onStart() {
  document.body.innerHTML = RenderMap(mapStringToGameMap(str_map));
}

window.onload = onStart;
