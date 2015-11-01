
'use strict';

var Mousetrap = require('mousetrap');

function makePlayer(opts) {

  return {
    x: opts.x || 0,
    y: opts.y || 0
  };

}

var player  = null,
    map     = null,
    str_map = '##+#########' +  // todo: remove player, creatures, objects
            '\n#@....######' +
            '\n#...R.##...#' +
            '\n#.$...##.p.#' +
            '\n###+####...#' +
            '\n###....+..p#' +
            '\n########...#' +
            '\n############';

function cell(input, i,j) {

  var content    = input,

      tileKind   = 'error',
      tileSymbol = content,
      topKind,
      topSymbol;

  switch (input) {

    case '.' : tileKind = 'floor';  tileSymbol = '.'; break;
    case '#' : tileKind = 'wall';   tileSymbol = '#'; break;
    case '~' : tileKind = 'water';  tileSymbol = '#'; break;
    case '≈' : tileKind = 'lava';   tileSymbol = '≈'; break;
    case '%' : tileKind = 'vein';   tileSymbol = '%'; break;
    case ':' : tileKind = 'rubble'; tileSymbol = ':'; break;

    case 'c' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'cat';      topSymbol = 'c'; break;
    case 'd' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'dog';      topSymbol = 'd'; break;
    case 'D' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'Dragon';   topSymbol = 'D'; break;
    case 'p' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'person';   topSymbol = 'p'; break;
    case 'R' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'reptile';  topSymbol = 'R'; break;
    case 't' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'troll';    topSymbol = 't'; break;
    case 'w' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'worm';     topSymbol = 'w'; break;

    case '$' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'treasure'; topSymbol = '$'; break;
    case '+' : tileKind = 'floor'; tileSymbol = '.'; topKind = 'door';     topSymbol = '+'; break;

    case '@' :
      if (player) { break; }
      player     = makePlayer({ x: i, y: j });
      tileKind   = 'floor';
      tileSymbol = '.';
      break;

    default  : throw 'unknown map data parse';

  }

  return {

    htmlRepresentation: function() {

      var isPlayer   = (player !== null) && (i === player.x) && (j === player.y),
          uTopKind   = isPlayer? 'player' : topKind,
          uTopSymbol = isPlayer? '@'      : topSymbol,
          tclass     = (uTopKind? (uTopKind + ' ') : '') + tileKind,
          tconts     = (uTopSymbol? uTopSymbol : tileSymbol);

      return '<td class="' + tclass + '">' + tconts + '</td>';

    }

  };

}

var RenderRow          =       row => '<tr>' + (row.map(cell => cell.htmlRepresentation()).join('')) + '</tr>',
    RenderMap          =   mapdata => '<table id="gamemap"><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>',
    mapStringToGameMap = mapString => mapString.split('\n').map( (row,j) => row.split('').map( (chr,i) => cell(chr,i,j)) );

function Render() {
  document.body.innerHTML = RenderMap(map);
}

function onStart() {
  map = mapStringToGameMap(str_map);
  Render();
}

Mousetrap.bind('up',    function() { player.y -= 1; Render(); });
Mousetrap.bind('right', function() { player.x += 1; Render(); });
Mousetrap.bind('down',  function() { player.y += 1; Render(); });
Mousetrap.bind('left',  function() { player.x -= 1; Render(); });

window.onload = onStart;
