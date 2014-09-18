var ROW_COUNT = 15;
var COL_COUNT = 15;

var SPECIAL_TILES = [
  {
    "styleclass": "double-letter",
    // "scorefunct": "calcDL",
    "tiles": [
      {"row": 1, "col": 4}, {"row": 1, "col": 12},
      {"row": 3, "col": 7}, {"row": 3, "col": 9},
      {"row": 4, "col": 1}, {"row": 4, "col": 8}, {"row": 4, "col": 15},
      {"row": 7, "col": 3}, {"row": 7, "col": 7}, {"row": 7, "col": 9}, {"row": 7, "col": 13},
      {"row": 8, "col": 4}, {"row": 8, "col": 12},
      {"row": 9, "col": 3}, {"row": 9, "col": 7}, {"row": 9, "col": 9}, {"row": 13, "col": 13},
      {"row": 12, "col": 1}, {"row": 12, "col": 8}, {"row": 12, "col": 15},
      {"row": 13, "col": 7}, {"row": 13, "col": 9},
      {"row": 15, "col": 4}, {"row": 15, "col": 12}
    ]
  }, {
    "styleclass": "double-word",
    // "scorefunct": "calcDW",
    "tiles": [
      {"row": 2, "col": 2}, {"row": 2, "col": 14},
      {"row": 3, "col": 3}, {"row": 3, "col": 13},
      {"row": 4, "col": 4}, {"row": 4, "col": 12},
      {"row": 5, "col": 5}, {"row": 5, "col": 11},
      {"row": 11, "col": 5}, {"row": 11, "col": 11},
      {"row": 12, "col": 4}, {"row": 12, "col": 12},
      {"row": 13, "col": 3}, {"row": 13, "col": 13},
      {"row": 14, "col": 2}, {"row": 14, "col": 14}
    ]
  }, {
    "styleclass": "triple-letter",
    // "scorefunct": "calcTL",
    "tiles": [
      {"row": 2, "col": 6}, {"row": 2, "col": 10},
      {"row": 6, "col": 2}, {"row": 6, "col": 6}, {"row": 6, "col": 10}, {"row": 6, "col": 14},
      {"row": 10, "col": 2}, {"row": 10, "col": 6}, {"row": 10, "col": 10}, {"row": 10, "col": 14},
      {"row": 14, "col": 6}, {"row": 14, "col": 10}
    ]
  }, {
    "styleclass": "triple-word",
    // "scorefunct": "calcTW",
    "tiles": [
      {"row": 1, "col": 1}, {"row": 1, "col": 8}, {"row": 1, "col": 15},
      {"row": 8, "col": 1}, {"row": 8, "col": 15},
      {"row": 15, "col": 8}, {"row": 15, "col": 8}, {"row": 15, "col": 15}
    ]
  }
];

$(function() {
  createGameBoard();
});

createGameBoard = function() {
  // 1. find the info files
  // 2. setup the grid
  // 3. setup any special tiles
  // 4. setup the letters [quantity and score for each]

  var board = $("#board");
  var appendages = '';

  for (var i = 0; i < ROW_COUNT; i++) {
    appendages += "<div class='row' data-row='" + (i+1) + "'>";

    for (var k = 0; k < COL_COUNT; k++) {
      appendages += "<div class='tile' data-col='" + (k+1) + "'></div>";
    }

    appendages += "</div>";
  }

  board.append(appendages);

  // now loop over all the special tiles and insert them
  for (var i = 0; i < SPECIAL_TILES.length; i++) {
    var specialTile = SPECIAL_TILES[i];
    var styleclass = specialTile["styleclass"];
    var scorefunct = specialTile["scorefunct"];
    var tiles = specialTile["tiles"];
    for (var k = 0; k < tiles.length; k++) {
      var tile = tiles[k];
      // get the grid div corresponding to this tile and set it to the special
      var tileDiv = getTileDiv(tile["row"], tile["col"])
      tileDiv.addClass(styleclass);
      // tileDiv.prop("scorefunct", scorefunct);
    }
  }

  $("#board .tile").click(function() {
    console.log("clicked " + $(this).parent().data("row") + " : " + $(this).data("col"));
  });
};

getTileDiv = function(row, col) {
  var board = $("#board");
  return board.children(".row[data-row='" + row + "']").children(".tile[data-col='" + col + "']");
};