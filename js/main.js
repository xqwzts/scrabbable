var ROW_COUNT = 15;
var COL_COUNT = 15;
var RACK_COUNT = 7;

var LETTERS = [
  { "letter": "", "count": 2, "score": 0 },
  { "letter": "E", "count": 12, "score": 1 },
  { "letter": "A","count": 9,"score": 1 },
  { "letter": "I", "count": 9, "score": 1 },
  { "letter": "O", "count": 8, "score": 1 },
  { "letter": "N", "count": 6, "score": 1 },
  { "letter": "R", "count": 6, "score": 1 },
  { "letter": "T", "count": 6, "score": 1 },
  { "letter": "L", "count": 4, "score": 1 },
  { "letter": "S", "count": 4, "score": 1 },
  { "letter": "U", "count": 4, "score": 1 },
  { "letter": "D", "count": 4, "score": 2 },
  { "letter": "G", "count": 3, "score": 2 },
  { "letter": "B", "count": 2, "score": 3 },
  { "letter": "C", "count": 2, "score": 3 },
  { "letter": "M", "count": 2, "score": 3 },
  { "letter": "P", "count": 2, "score": 3 },
  { "letter": "F", "count": 2, "score": 4 },
  { "letter": "H", "count": 2, "score": 4 },
  { "letter": "V", "count": 2, "score": 4 },
  { "letter": "W", "count": 2, "score": 4 },
  { "letter": "Y", "count": 2, "score": 4 },
  { "letter": "K", "count": 1, "score": 5 },
  { "letter": "J", "count": 1, "score": 8 },
  { "letter": "X", "count": 1, "score": 8 },
  { "letter": "Q", "count": 1, "score": 10 },
  { "letter": "Z", "count": 1, "score": 10 }
]

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
      {"row": 15, "col": 1}, {"row": 15, "col": 8}, {"row": 15, "col": 15}
    ]
  }
];


var letter_bag = [];
var player_rack = [];

$(function() {
  createGameBoard();
  loadLetters();
  fillRack();
  setupDraggability();
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

loadLetters = function() {
  // populate the letter_bag array based on the frequency of letters in LETTERS
  for (var i = 0; i < LETTERS.length; i++) {
    var letterObj = LETTERS[i];
    var letter = letterObj["letter"];
    var count = letterObj["count"];
    for (k = 0; k < count; k++) {
      letter_bag.push(letter);
    }
  }
}

fillRack = function() {
  while (player_rack.length < RACK_COUNT) {
    var letter = getLetterFromBag();
    player_rack.push(letter);

    var letterScore = getLetterScore(letter);

    $("#rack").append("<div class='tile'><span class='letter'>" + letter + "</span><span class='letter-score'>" + letterScore + "</span></div>");
  }
}

getLetterFromBag = function() {
  if (letter_bag.length > 0) {
    var randomIndex = Math.floor(Math.random() * letter_bag.length);
    var letter = letter_bag.splice(randomIndex, 1)[0];
    return letter;
  }
}

getLetterScore = function(letter) {
  for (var i = 0; i < LETTERS.length; i++) {
    if (LETTERS[i]["letter"] == letter) {
      return LETTERS[i]["score"];
    }
  }
}

setupDraggability = function() {

  $("#rack").sortable({
    connectWith: "#board .row .tile",
    receive: function() {
      setTimeout(checkSubmitability, 50);
    }
  });

  $("#board .row .tile").droppable({
    accept: ".tile",
    tolerance: "intersect",
    drop: function(e, u) {
      var targetTile = this;
      var draggedTile = u.draggable;

      // make sure it was dropped in a row tile:
      if (!($(targetTile).hasClass("tile") && $(targetTile).parent().hasClass("row") && ($(targetTile).children().length == 0))) {
        return;
      }

      $(draggedTile).detach();

      var clone = draggedTile.clone()
      $(targetTile).append(clone);
      $(targetTile).droppable("disable");

      clone.removeAttr("style");
      clone.addClass("tile dirty");

      delete draggedTile;

      setTimeout(checkSubmitability, 50);

      clone.draggable({
        connectToSortable: "#rack",
        helper: "clone",
        snap: "#board .tile",
        snapMode: "outer",
        start: function(ev, ui) {
          if ($(this).parent().hasClass("tile")) {
            $(this).parent().droppable("enable");
          }
        },
        stop: function() {
          if ($(this).parent().hasClass("tile")) {
            $(this).parent().droppable("disable");
          }
        },
        revert: function(targ) {
          if (targ == false) {
            return true;
          }

          var revert = true;

          if (targ.hasClass("tile")) {
            revert = false;
          }

          if (targ.attr("id") == "rack") {
            $(this).detach();
            revert = false;
          }

          return revert;
        }
      });
    }
  });
}

checkSubmitability = function() {
  // get all dirty tiles on the board
  var dirtyTiles = $("#board").find(".dirty");

  // No dirty tiles means nothing placed on the board, enable the pass button
  if (dirtyTiles.length == 0) {
    enablePassButton();
    return;
  }

  disablePassButton();

  var validDirtyTiles = true;

  // If we have dirty tiles make sure they're in valid positions
  // 1. unless this is the first word then they must be attached to another used tile on the board


  // 2. all dirty must be in either the same row or column
  if (validDirtyTiles) {
    var firstCol = $(dirtyTiles[0]).parent().data("col");
    var firstRow = $(dirtyTiles[0]).parent().parent().data("row");
    console.log(firstRow + ":" + firstCol);
    var allColsMatch = true;
    var allRowsMatch = true;
    for (var i = 1; i < dirtyTiles.length; i++) {
      if (allColsMatch) {
        var currentCol = $(dirtyTiles[i]).parent().data("col");
        if (currentCol != firstCol) {
          allColsMatch = false;
        }
      }
      if (allRowsMatch) {
        var currentRow = $(dirtyTiles[i]).parent().parent().data("row");
        if (currentRow != firstRow) {
          allRowsMatch = false;
        }
      }
    }
    if (!allColsMatch && !allRowsMatch) {
      validDirtyTiles = false;
    }
  }

  // 3. all tiles must be connected: there can be no empty tiles between them
  for (var i = 0; i < dirtyTiles.length; i++) {
    if (!noTileIsAnIsland(dirtyTiles[i])) {
      validDirtyTiles = false;
      break;
    }
  }

  if (validDirtyTiles) {
    enableSubmitButton(); 
  } else {
    disableSubmitButton();
  }
}

noTileIsAnIsland = function(tile) {
  // check all 4 adjancent tiles and return true if any one of them has another tile, dirty or not, so long as it isn't empty
  var tileCol = $(tile).parent().data("col");
  var tileRow = $(tile).parent().parent().data("row");

  if (tileRow > 1) {
    // 1. check above
    if (getTileDiv(tileRow-1, tileCol).children().length > 0) {
      return true;
    }
  }

  if (tileRow < 15) {
    // 2. check below
    if (getTileDiv(tileRow+1, tileCol).children().length > 0) {
      return true;
    }
  }

  if (tileCol > 1) {
    // 3. check left
    if (getTileDiv(tileRow, tileCol-1).children().length > 0) {
      return true;
    }
  }

  if (tileCol < 15) {
    // 4. check right
    if (getTileDiv(tileRow, tileCol+1).children().length > 0) {
      return true;
    }
  }

  return false;

}

enableSubmitButton = function() {
  $("#submitButton").removeAttr("disabled");
}

disableSubmitButton = function() {
  $("#submitButton").attr("disabled", "disabled");
}

enablePassButton = function() {
  $("#passButton").removeAttr("disabled");
}

disablePassButton = function() {
  $("#passButton").attr("disabled", "disabled");
}
