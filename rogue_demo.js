var str_map = '##+#########' +  // todo: remove player, creatures, objects
            '\n#@....######' +
            '\n#...R.##...#' +
            '\n#.$...##.p.#' +
            '\n###+####...#' +
            '\n###....=..p#' +
            '\n########...#' +
            '\n############';

var map = [ [ '#', '#', '+', '#', '#', '#', '#', '#', '#', '#', '#', '#' ], // todo: remove player, creatures, objects
            [ '#', '@', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#' ],
            [ '#', '.', '.', '.', 'R', '.', '#', '#', '.', '.', '.', '#' ],
            [ '#', '.', '$', '.', '.', '.', '#', '#', '.', 'w', '.', '#' ],
            [ '#', '#', '#', '+', '#', '#', '#', '#', '.', '.', '.', '#' ],
            [ '#', '#', '#', '.', '.', '.', '.', '=', '.', '.', 'w', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
            [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
          ];

var RenderCell =              cell => '<td>' + cell.toString() + '</td>',
    RenderRow  =               row => '<tr>' + (row.map(RenderCell).join('')) + '</tr>',
    RenderMap  =           mapdata => '<table><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>',
    mapStringToGameMap = mapString => mapString.split('\n').map( row => row.split('') );

function onStart() {
  document.body.innerHTML = RenderMap(mapStringToGameMap(str_map));
}

window.onload = onStart;
