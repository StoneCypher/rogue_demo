
'use strict';

var str_map = '##+#########' +  // todo: remove player, creatures, objects
            '\n#@....######' +
            '\n#...R.##...#' +
            '\n#.$...##.p.#' +
            '\n###+####...#' +
            '\n###....+..p#' +
            '\n########...#' +
            '\n############';

function cell(input) {

  var content  = input,
      isPlayer = (input === '@'),

      tileKind   = 'error',
      tileSymbol = content,
      topKind,
      topSymbol;

  switch (input) {
    case '.' : tileKind = 'floor'; tileSymbol = '.'; break;
    case '#' : tileKind = 'wall';  tileSymbol = '#'; break;
    case '@' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'player';   topSymbol = '@'; break;
    case 'p' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'person';   topSymbol = 'p'; break;
    case 'R' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'monster';  topSymbol = 'R'; break;
    case '$' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'treasure'; topSymbol = '$'; break;
    case '+' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'door';     topSymbol = '+'; break;
    default  : true; // throw 'unknown map data parse'
  }

  return {

    htmlRepresentation: function() {
      return '<td class="' + (topKind? (topKind + ' ') : '') + tileKind + '">' + (topSymbol? topSymbol : content) + '</td>';
    }

  };

}

var RenderRow          =       row => '<tr>' + (row.map(cell => cell.htmlRepresentation()).join('')) + '</tr>',
    RenderMap          =   mapdata => '<table id="gamemap"><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>',
    mapStringToGameMap = mapString => mapString.split('\n').map( row => row.split('').map(chr => cell(chr)) );

function onStart() {
  document.body.innerHTML = RenderMap(mapStringToGameMap(str_map));
}

window.onload = onStart;
