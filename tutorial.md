It's straight up trivial.  Also, look into ZAngband - more content, less trying to be funny.

The phrase you're looking for is "roguelike development."  This turns out to be a long standing dev community (except for the javascript part.)

----

# Getting started

Anyway, suppose you have a map that looks like

    ##+#########
    #@....######
    #...R.##...#
    #.$...##.w.#
    ###+####...#
    ###....=..w#
    ########...#
    ############

Rendering that is easy a zillion ways.  Since you're new, I think you should use a `<table>`, because that's easy to wrap your head around; an experienced person would probably instead absolutely position `<span>`s inside a fixed-size scrollable container, but let's not bother with that for now.  Baby steps.

First, you need the map data as a value in your JavaScript.  For now we'll just use that fixed map; making your own map is one of the fun parts.

Note: \n means "new line."  It's like hitting return.

    var map = '##+#########' +  // todo: remove player, creatures, objects
            '\n#@....######' +
            '\n#...R.##...#' +
            '\n#.$...##.w.#' +
            '\n###+####...#' +
            '\n###....=..w#' +
            '\n########...#' +
            '\n############';

A good design wouldn't use the letters to store the map state, and neither will we, but this gets us a place to start.  I often proceed by putting bullshit in place, then writing notes reminding me what to remove, then removing that as I go; it lets me work in a more "complete" space, where things are (fake) already in place, which I find easier.

If you do this, *don't* skip the reminder comments.

----

# Having a page to draw into

Next, let's draw that in our document.  We'll need a host document (`index.html`,) which might look something like this:

    <!doctype html>
    <html>

      <head>
        <script defer type="text/javascript" src="rogue_demo.js"></script>
        <link rel="stylesheet" type="text/css" href="rogue_demo.css"/>
        <title>Rogue demo</title>
      </head>

      <body></body>

    </html>

At this point, please put a simple `window.alert('hello');` in the relevant javascript file, and set the body background color to orange in the relevant CSS file, and load the result.  This ensures that all files are in appropriate places, that the tags have the filenames and attributes correct, et cetera.

Assuming those both go well, remove the alert and the orange, and let's please continue.

----

# The worst looking render

A simple way to get some satisfaction immediately - and don't underestimate how important that is - is to throw that map on screen, so that you know you're getting something.

Let's do that.  Please put the map variable from above in, and then what we'll do is write two functions - `MapDraw` and `onStart`.

## MapDraw

The first function, `MapDraw`, we'll start in idiot-simple territory.  We're going to create an HTML element `<pre>`, which makes fixed-width non-scrolling non-stripped text, and we're going to fill it with the map text, then return that.

    function MapDraw(map) {
      return '<pre>' + map.toString() + '</pre>';
    }

Later we'll replace this with a much better one.

## onStart

This is sort of our checkered flag to go.  Web browsers will emit an event called `window.onload` when everything's ready to begin.  What we need to do is create a function (we'll call it an "event handler", which doesn't have a technical meaning in this language, but rather reminds us of its purpose) whose goal is to hook `window.event` and do our setup tasks.  At this time that only means drawing the map, though that will be a growing list.

    function onStart() {
      document.body.innerHTML = MapDraw(map);
    }

And we also need to assign that to `window` as the function meant to handle that event, like so:

    window.onload = onStart;

## And that's a soup

Your end result should look something like this:

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

Save that and the HTML in some directory (the HTML source expects the JS to be called `rogue_demo.js`,) and open the index; you should now see a shitty, fully JS map being rendered.

[Step 1](todo whargarbl)

----

# An Aside

> Why not just keep it in a `<pre>` forever, then?

Because having individually placed cells is easier to hook events (click, hover, touch, etc) to, and for spells, that needs to include empty floor and walls, so that's everything, not just items and monsters, so wrapping everything in `<span>`s quickly becomes silly.

.

> But I heard that `<table>` was bad

Uh huh.

.

> Why not just place `<span>`s directly?

Oh, you can.  That's actually a good route.  But it involves math, bounding boxes, forced empty rendering, and some hairy portability things, and this is a noob, so I'm trying to keep it simple.  Tables are simple.

.

> Flexbox?

Shut up.

----

# It looks weird

I know.  It's the web.  Let's start fixing that.  Make a CSS file called `rogue_demo.css` and let's put a starting step towards it.

    body, html, pre { margin: 0; padding: 0; border: 0; }

That's CSS-ese for "don't put any spacing or lines around these three tags."  Save that, reload, and watch it look slightly less terrible.

We're going to start putting effort into the appearance later.  For now, it's good enough to see that it's under control.  Effort expended now would be wasted; we're about to change how that map is drawn.

----

# Less-bad map

There are a tremendous number of ways to represent a map, and some of the most interesting roguelike design can be found in fundamental map representation.  However, that's a difficult topic.  Today we'll do a straightforward map.

There are two approaches to a straightforward map.  Each has their upsides and downsides.  You see the other above: a string representation.  That's a good approach, actually, for a lot of things, particularly for hand-drawn special regions.  However, it also has a whole *lot* of problems, like that it makes procedural generation, your bread and butter, borderline impossible.

The reason it's such a great first step, though, is actually very compelling: you take a look at it and you know exactly what you're looking at.  High class roguelikes (the Angband, Crawl, Hack, ADOM, Torchlight, and Diablo families, for example) have a whole lot of fixed special areas; a few of them (FTL, X-Com, Syndicate) are made entirely or nearly entirely out of fixed special areas.  These are very powerful tools, and you want to be able to make them quickly, easily, and while having fun, yeah?

Let's start by showing the other approach; after that, I can explain how we'll handle the dichotomy.  (Pro tip: we're gonna cheat.)

## Map-as-a-grid

The closest thing we have to a grid in JavaScript is an array-of-arrays, unless you're going off into the woods and implementing some shit in classes or decorators or whatever, which, y'know, don't.

Why this approach is better is simple: you get to refer to cells like map[3][5], which means drawing a box here and a line there and a random cloud over yonder is pretty straightforward, because numbers.  If you were trying to do that on a string, you'd have to do a bunch of math to figure out where in the string it went (and by the way, javascript strings aren't iteration-fast, because of unicode technicalities, so that'll be slooooow.)

So that looks something like (don't worry, I'll de-horrible this afterwards):

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

Now, obviously you don't want to write maps like that by hand.  But, already some improvements are obvious: the newlines are gone, the math to see what's north or south is just add one or subtract one, it's straightforward to blot out regions, et cetera.

Later, we'll go back and resurrect map strings, because they matter a lot.  But for now, let's get this new one working.

## Now we render this new map as a `<table>`

Since we have to gut and redo the map draw, this is as good a time as any to switch to `<table>`, too.  It's actually easier for this map type anyway.

Let's write a few simple arrow functions to handle this for us.  An arrow function is an anonymous function that takes either a bare argument or a list of arguments, then implicitly returns the statement you issue.  If there's only one argument you can skip the `()` framing on the arglist, and if there's only one statement you can skip the `{}` framing on the body.  This leads to extremely terse lambdas.

Check it out:

    var RenderCell =    cell => '<td>' + cell.toString() + '</td>',
        RenderRow  =     row => '<tr>' + (row.map(RenderCell).join('')) + '</tr>',
        RenderMap  = mapdata => '<table><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>';

That says
  * RenderCell is an arrow function, taking cell, yielding the cell to string framed in a `<td>`
  * RenderRow is an arrow function, taking a row, which maps the row as an array with `RenderCell`, joins the result with nothing inbetween, and frames it in a `<tr>`
  * RenderMap is an arrow function, taking a mapdata, which maps the mapdata as an array with `RenderRow`, joins the result with nothing inbetween, and frames it in `<table><tbody>`.

This work is all currently done with strings.  That won't stay true forever, but it works for now.

At this point the new map renders, but is no longer in a fixed-width font; on most systems the `@` is much wider than the other characters, and so the map will appear to be slightly broken.  That's okay; this is a progress point `:)`

We also update our `onStart` to call `RenderMap` instead of `MapDraw`.

The new JS should look something like this:

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

    var RenderCell =    cell => '<td>' + cell.toString() + '</td>',
        RenderRow  =     row => '<tr>' + (row.map(RenderCell).join('')) + '</tr>',
        RenderMap  = mapdata => '<table><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>';


    function onStart() {
      document.body.innerHTML = RenderMap(map);
    }

    window.onload = onStart;

And now our map is rendered as a `<table>`, which has important benefits coming up.

Except &hellip; we've lost string maps `:(`

[Step 2](todo whargarbl)

----

# The string map conundrum

The thing is, hand drawn regions are important for making a game setting.  ***Really important***.  So, we want them, even though the above array map is super obviously better.

## The cheating part

The key thing we need to do is to make a thing that takes one and makes the other.  The benefits of the string one are to the human, and the benefits of the array one are to the machine and to your software, so, let's take the string one, and make the array one.  's actually pretty easy.

There are more efficient ways to do this which are less easy.  I'm going to use ES6; this won't work in older browsers, and setting up shims or `babel.js` is outside the scope of this discussion.  `dealwithit.jpg`

    var mapStringToGameMap = mapString => mapString.split('\n').map( row => row.split('') );

What that does:

1. Takes a `mapString`, which we intend to convert into a `GameMap`, by
1. taking the `mapString`,
1. `split`ing it on the newline, yielding an array of each row,
1. `map`ping (sorry, coincidence) over those rows with
1. the `arrow function` "`row => row.split('')"
1. which means the end result is that arrow function's result over each row
1. the arrow function just says "take the row and return the result of `split()`ing it"
1. in javascript, split() with an empty string argument on a string yields an array of each letter
1. which got done to each row (by the `map()`,) as a way to build our result
1. which is our new `GameMap`, an array of arrays of letters
1. and return that result

Later, as GameMaps become more powerful, that function will have to, too.  (Or rather, we'll make a class after all, and use this as one way to initialize them.)

But for now that will do.

## Wossit do

Let's hook it up.  Let's grab the old string version of the map; let's change the `w`s in the sample map to `p`s so you can see the difference between the two maps visually; then let's hook up string maps in our array map system.

First, the old string map, slightly altered:

    var str_map = '##+#########' +  // todo: remove player, creatures, objects
                '\n#@....######' +
                '\n#...R.##...#' +
                '\n#.$...##.p.#' +
                '\n###+####...#' +
                '\n###....=..p#' +
                '\n########...#' +
                '\n############';

Next, using it as a source is straightforward; we just wire onStart to call for different initial data:

    function onStart() {
      document.body.innerHTML = RenderMap(mapStringToGameMap(str_map));
    }

Your source should now look something like this:

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

And now we have an array map system rendering from map strings; the best of both worlds `:)`

Let's do something with that world.  But first, another de-uglying pass.

[Step 3](todo whargarbl)

----

First, in the `RenderMap` arrow function, let's give the `<table>` an `id` that we can hook rules to shamelessly.

    RenderMap = mapdata => '<table id="gamemap"><tbody>' + (mapdata.map(RenderRow).join('')) + '</tbody></table>',

Next, in the CSS, let's start by enforcing an actual square grid.  Let's also make the page background slightly gray, and the default map cell white text on black background, which is obviously wrong.  More on that soon.

    body        { background-color: #eee; }
    #gamemap    { border-collapse: collapse; }
    #gamemap td { height: 1em; width: 1em; background-color: black; color: white; }

Let's also add some rules to the map cells that prevent overflow, that strip out default extra spacing and border lines, and that center text both horizontally and vertically within the cells (the last piece won't work outside table cells.)

    #gamemap td { height: 1em; width: 1em; background-color: black; color: white; overflow: hidden;
                  margin: 0; padding: 0; border: 0; text-align: center; vertical-align: middle; }

Now things look dramatically less awful.  Let's get some active map behavior in, so that we can get properly started.

Fortunately we can start making faster steps now, too.

[Step 4](todo whargarbl)

----

# Let's interpret the map

So right now we're having the map fly blind on strings.  That's awful.  It's a nice bootstrapping notation but it won't do properly.  Let's have it be interpreted into something reasonable, instead; then we can get a better map to be rendered.

We need two pieces to safely undo that; afterwards we can do whatever dumb thing we like.  First, we need to make a cell object, instead of just some single letter string; second, we need to modify the table builder to call the ostensible method on the cell class which tells it what to contain.

Honestly I'd like to do the cell object as an ES6 class, but your browser probably doesn't support them by default yet, and I don't want to cover `babel` this morning.

## Making a map cell

First, the `cell` is (initially) simple enough: take an input, bind it to a closure variable, return an object that craps out the closure variable on request.  Cool.

    function cell(input) {
      var content = input;
      return {
        htmlRepresentation: function() { return content; }
      };
    }

[Step 6](todo whargarbl)

# Using the map cell

It's time to start actually leveraging our map.

Next we change the string map consumer to apply the individual characters as the cell argument, instead of to just return them as an array.  Simple enough: map that array with the `cell` call.

    mapStringToGameMap = mapString => mapString.split('\n').map( row => row.split('').map(chr => cell(chr)) );

Concomitantly, we need to alter the cell renderer to use the representation method, since it's no longer able to just dump in string contents.

    RenderCell = cell => '<td>' + cell.htmlRepresentation() + '</td>',

And if we look, we *now* have a semi-real game map with active cells.  For example, let's do (in a bad way) a little work to highlight the player.  First, we'll add another instance variable to the cell (**temporarily**) called isPlayer, and if it's there, we'll change the cell color.

    function cell(input) {

      var content  = input,
          isPlayer = (input === '@');

      return {
        htmlRepresentation: function() { return isPlayer? ('<span style="color:blue">' + content + '</span>') : content; }
      };

    }

This is fairly useless and terrible, but it shows that our map is actively being interpreted.

Styling inside the table cells is silly.  Let's style the table cells directly.  That means transferring the ownership of the `<td>` into the class, so let's start there.

First, the representation call changes as so (we'll change it to green so we know it's the new code working):

    htmlRepresentation: function() {
      var style = isPlayer? 'color: green' : '';
      return '<td style="' + style + '">' + content + '</td>';
    }

Next, `RenderCell` kind of doesn't need to exist anymore: all it did was wrap the `cell` class' render method in a `<td>`, and that is now provided.  So we can call the `cell` class' render method directly with an arrow function to make the access, and burn `RenderCell`.

    RenderRow = row => '<tr>' + (row.map( cell => cell.htmlRepresentation() ).join('')) + '</tr>',

This now means that the `cell` can style the table cell directly.  Let's teach it about that.

[Step 7](todo whargarbl)

----

Let's start in the CSS by creating a few rules.  One for walls, one for floors, one for players, one for doors, one for monsters (just for now,) one for items (also for now), and one for simple treasure.

Initially we'll start with walls, floors, and the player, to get the infrastructure together; then we'll do the rest.

We're going to need effectively two styles for every cell: the base and the top.  This is because the base will be the tile type (floor, lava, grass, trap, water, whatever), and there might be something (or many things) on top of it, such as a monster or treasure or whatever.

Usually, though not always, the top style will let the bottom background color through; rarely, but occasionally, it will also let the bottom foreground color through.  Each of these should be possible in our system.  It would also be nice if either could do other things, such as invoking font styling or whatever.

One way to achieve this is through CSS precedence.  Make a slightly more specific rule for top rules (we will use `<tr>` in the top rules but not in the bottom rules to get this result.)  Let the cascade handle the rest.

#gamemap    td.wall   { background-color: dimgray;     color: silver; }
#gamemap    td.floor  { background-color: saddlebrown; color: moccasin; }

#gamemap tr td.player { color: cyan; }

This allows the player to stand on floor and get a brown background, but to override the floor's yellowish foreground with cyan.

Now we extend this to the other rules we want initially:

#gamemap    td.wall     { background-color: dimgray;     color: gray; }
#gamemap    td.floor    { background-color: saddlebrown; color: moccasin; }
#gamemap    td.grass    { background-color: green;       color: lawngreen; }
#gamemap    td.water    { background-color: dodgerblue;  color: darkturquoise; }
#gamemap    td.lava     { background-color: crimson;     color: tomato; }

#gamemap tr td.player   { color: cyan; }
#gamemap tr td.person   { color: white; }
#gamemap tr td.monster  { color: red; }
#gamemap tr td.item     { color: green; }
#gamemap tr td.treasure { color: gold; }
#gamemap tr td.door     { color: silver; font-weight: bold; }

[Step 8](todo whargarbl)