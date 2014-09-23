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
    "scorefunct": "doubleLetter",
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
    "scorefunct": "doubleWord",
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
    "scorefunct": "tripleLetter",
    "tiles": [
      {"row": 2, "col": 6}, {"row": 2, "col": 10},
      {"row": 6, "col": 2}, {"row": 6, "col": 6}, {"row": 6, "col": 10}, {"row": 6, "col": 14},
      {"row": 10, "col": 2}, {"row": 10, "col": 6}, {"row": 10, "col": 10}, {"row": 10, "col": 14},
      {"row": 14, "col": 6}, {"row": 14, "col": 10}
    ]
  }, {
    "styleclass": "triple-word",
    "scorefunct": "tripleWord",
    "tiles": [
      {"row": 1, "col": 1}, {"row": 1, "col": 8}, {"row": 1, "col": 15},
      {"row": 8, "col": 1}, {"row": 8, "col": 15},
      {"row": 15, "col": 1}, {"row": 15, "col": 8}, {"row": 15, "col": 15}
    ]
  }, {
    "styleclass": "first-word",
    "scorefunct": "doubleWord",
    "tiles": [
      {"row": 8, "col": 8}
    ]
  }
];


var letter_bag = [];
var isFirstWord = true;
var score = 0;
var dirtyScore = 0;

$(function() {
  createGameBoard();
  loadLetters();
  fillRack();
  setupDraggability();
  setupButtons();
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
      tileDiv.data("scorefunct", scorefunct);
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
  while ($("#rack").children(".tile").length < RACK_COUNT) {
    var letter = getLetterFromBag();

    var letterScore = getLetterScore(letter);

    $("<div class='tile'><span class='letter'>" + letter + "</span><span class='letter-score'>" + letterScore + "</span><input type='checkbox' value='change' class='exchangecb'></div>").appendTo("#rack");
  }
}

getLetterFromBag = function() {
  if (letter_bag.length > 0) {
    var randomIndex = Math.floor(Math.random() * letter_bag.length);
    var letter = letter_bag.splice(randomIndex, 1)[0];
    return letter;
  }
}

addLetterToBag = function(letter) {
  letter_bag.push(letter);
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
      setTimeout(checkDirtyValidity, 50);
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

      setTimeout(checkDirtyValidity, 50);

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

setupButtons = function() {
  $("#submitButton").click(submitButtonClicked);
  $("#passButton").click(passButtonClicked);
  $("#exchangeButton").click(exchangeButtonClicked);
}

submitButtonClicked = function() {
  // 1. disable everything until done
  disableSubmitButton();
  displayTempScore("");

  // 2. if this was the first word, then nothing else will be.
  if (isFirstWord) {
    isFirstWord = false;
  }
  
  // 3. make the dirty tiles permanent.
  makeDirtyTilesPermanent();

  // 4. update the score.
  updateScore();

  // 5. refill the player's rack.
  fillRack();

  // 6. reset the buttons
  disableSubmitButton();
  enablePassButton();
}

updateScore = function() {
  score += dirtyScore;
  dirtyScore = 0;
  $("#scoreholder").text(score);
}

makeDirtyTilesPermanent = function() {
  // get all dirty tiles on the board
  var dirtyTiles = $("#board .dirty");

  for (var i = 0; i < dirtyTiles.length; i++) {
    var dirtyTile = dirtyTiles[i];
    // move the letter and score spans into the parent tile
    var parentTile = $(dirtyTile).parent(".tile");
    parentTile.prepend($(dirtyTile).children("span"));

    // delete this dirty tile
    $(dirtyTile).detach();
    delete dirtyTile;
  }
}

passButtonClicked = function() {
  // disable the pass button
  disablePassButton();

  // disable sorting/dragging of the rack tiles
  $("#rack").sortable("disable");

  // enable exchange checkboxes
  $("#rack .exchangecb").show();

  // display and enable no exchange button
  showAndEnableExchangeButton();
}

exchangeButtonClicked = function() {
  // 1. find all checked rack tiles to be exchanged
  var exchangeTiles = $("#rack .exchangecb:checked").parent();

  // 2. return each one to the bag
  for (var i = 0; i < exchangeTiles.length; i++) {
    var tile = exchangeTiles[i];
    var letter = $(tile).children(".letter").text();
    addLetterToBag(letter);
    $(tile).detach();
    delete tile;
  }

  // 3. hide the tile checkboxes
  $("#rack .exchangecb").hide();

  // 4. disable and hide the exchange button
  hideAndDisableExchangeButton();

  // 5. refill the rack
  fillRack();

  // 6. enable the pass button
  enablePassButton();

  // 7. enable sorting/dragging of the rack tiles
  $("#rack").sortable("enable");
}

checkDirtyValidity = function() {
  disablePassButton();
  displayTempScore("");
  disableSubmitButton();

  // get all dirty tiles on the board
  var dirtyTiles = $("#board .dirty");

  // No dirty tiles means nothing placed on the board, enable the pass button
  if (dirtyTiles.length == 0) {
    enablePassButton();
    return;
  }

  // If we have dirty tiles make sure they're in valid positions
  // 1. all dirty must be in either the same row or column
  var tilePositions = unwrapTilePositions(dirtyTiles);

  var allColsOrRowsMatchRes = allColsOrRowsMatch(tilePositions);
  var allColsMatch = allColsOrRowsMatchRes.allColsMatch;
  var allRowsMatch = allColsOrRowsMatchRes.allRowsMatch;

  if (!allColsMatch && !allRowsMatch) {
    console.log("invalid tiles: non-unique row/col fail.")
    return;
  }

  sortTilePositions(tilePositions, allColsMatch);

  if (!allGapsValid(tilePositions, allColsMatch)) {
    console.log("invalid tiles: non-connected gaps fail.");
    return;
  }

  var getWordsRes = getWordsList(tilePositions, allColsMatch);
  var isConnected = getWordsRes.isConnected;
  var words = getWordsRes.words;

  if (words.length < 1) {
    console.log("invalid tiles: no words fail.");
    return;
  }

  // 4. unless this is the first word then we must attached to another used tile on the board
  if (!isFirstWord && !isConnected) {
    console.log("invalid tiles: no connectors fail.")
    return;
  }

  dirtyScore = calculateScore(words);
  displayTempScore(dirtyScore);
  enableSubmitButton();
}

allColsOrRowsMatch = function(tilePositions) {
  var res = {
    allColsMatch: true,
    allRowsMatch: true
  };

  var firstRow = tilePositions[0][0];
  var firstCol = tilePositions[0][1];
  for (var i = 1; i < tilePositions.length; i++) {
    var currentRow = tilePositions[i][0];
    var currentCol = tilePositions[i][1];

    if (res.allColsMatch && currentCol != firstCol) {
      res.allColsMatch = false;
    }
    if (res.allRowsMatch && currentRow != firstRow) {
      res.allRowsMatch = false;
    }
  }

  return res;
}

sortTilePositions = function(tilePositions, verticalTiles) {
  // if we matched by col then sort the tiles by row and vice versa.
  if (verticalTiles) {
    tilePositions.sort(sortByRow);
  } else {
    tilePositions.sort(sortByCol);
  }
}

allGapsValid = function(tilePositions, verticalTiles) {
  var gaps = [];
  // all tiles must be connected: there can be no empty tiles between them
  if (verticalTiles) {
    // check for gaps
    var fixedCol = tilePositions[0][1];
    gaps = findGapsInRows(tilePositions, fixedCol);
  } else {
    // check for gaps
    var fixedRow = tilePositions[0][0];
    gaps = findGapsInCols(tilePositions, fixedRow);
  }

  // for each gap check that the tile is actually empty or a connector
  // As soon as we hit an empty one invalidate and fail
  for (var i = 0; i < gaps.length; i++) {
    if (!getTileDiv(gaps[i][0], gaps[i][1]).children().length > 0) {
      return false;
    }
  }
  return true;
}

getWordsList = function(tilePositions, verticalTiles) {
  var res = {
    isConnected: false,
    words: []
  };

  // Generate our list of words:
  if (verticalTiles) {
    // find our real top edge: keep going until we hit a gap:
    var topEdgePosition = getTopEdge(tilePositions[0][0], tilePositions[0][1]);

    // now find the vertical word determined by this top edge;
    var findWordRes = findVerticalWord(topEdgePosition[0], topEdgePosition[1]);
    if (findWordRes.found) {
      res.words.push(findWordRes.word);
    }
    if (!res.isConnected && findWordRes.hasConnection) {
      res.isConnected = true;
    }

    // each dirty tile could also be connected horizontaly, so get any possible horizontal words
    for (var i = 0; i < tilePositions.length; i++) {
      var leftEdgePosition = getLeftEdge(tilePositions[i][0], tilePositions[i][1]);
      var findWordRes = findHorizontalWord(leftEdgePosition[0], leftEdgePosition[1]);
      if (findWordRes.found) {
        res.words.push(findWordRes.word);
      }
      if (!res.isConnected && findWordRes.hasConnection) {
        res.isConnected = true;
      }
    }
  } else {
    // find our real left edge: keep going until we hit a gap:
    var leftEdgePosition = getLeftEdge(tilePositions[0][0], tilePositions[0][1]);

    // now find the horizontal word determined by this left edge:
    var findWordRes = findHorizontalWord(leftEdgePosition[0], leftEdgePosition[1]);
    if (findWordRes.found) {
      res.words.push(findWordRes.word);
    }
    if (!res.isConnected && findWordRes.hasConnection) {
      res.isConnected = true;
    }

    // each dirty tile could also be connected vertically, so get any possible vertical words
    for (var i = 0; i < tilePositions.length; i++) {
      var topEdgePosition = getTopEdge(tilePositions[i][0], tilePositions[i][1]);
      var findWordRes = findVerticalWord(topEdgePosition[0], topEdgePosition[1]);
      if (findWordRes.found) {
        res.words.push(findWordRes.word);
      }
      if (!res.isConnected && findWordRes.hasConnection) {
        res.isConnected = true;
      }
    }
  }

  return res;
}

sortByRow = function(a, b) {
  return a[0] - b[0];
}

sortByCol = function(a, b) {
  return a[1] - b[1];
}

findGapsInRows = function(tilePositions, col) {
  var gaps = [];
  for (var i = 0; i < tilePositions.length-1; i++) {
    if ((tilePositions[i+1][0] - tilePositions[i][0]) > 1) {
      // gap... for each value in between [i][0] and [i+1][0] we have a gap, keep a list of them
      for (var k = tilePositions[i][0]+1; k < tilePositions[i+1][0]; k++) {
        console.log("gap: " + k + ", " + col);
        gaps.push([k, col]);
      }
    }
  }
  return gaps;
}

findGapsInCols = function(tilePositions, row) {
  var gaps =[];
  for (var i = 0; i < tilePositions.length-1; i++) {
    if ((tilePositions[i+1][1] - tilePositions[i][1]) > 1) {
      for (var k = tilePositions[i][1]+1; k < tilePositions[i+1][1]; k++) {
         console.log("gap: " + row + ", " + k);
         gaps.push([row, k]);
      }
    }
  }
  return gaps;
}

getTopEdge = function(row, col) {
  while (row > 1) {
    if (getTileDiv(row-1, col).children().length > 0) {
      row--;
    } else {
      break;
    }
  }
  return ([row, col]);
}

getLeftEdge = function(row, col) {
  while (col > 1) {
    if (getTileDiv(row, col-1).children().length > 0) {
      col--;
    } else {
      break;
    }
  }
  return ([row, col]);
}

findVerticalWord = function(topEdgeRow, col) {
  var res = {
    found: false
  };
  var word = [];
  for (var i = topEdgeRow; i <= ROW_COUNT; i++) {
    var tileDiv = getTileDiv(i, col);
    if (tileDiv.children().length > 0) {
      word.push([i, col]);
      if (tileDiv.children(".dirty").length == 0) {
        res.hasConnection = true;
      }
    } else {
      break;
    }
  }
  if (word.length > 1) {
    res.found = true;
    res.word = word;
  }

  return res;
}

findHorizontalWord = function(row, leftEdgeCol) {
  var res = {
    found: false
  }
  var word = [];
  for (var i = leftEdgeCol; i <= COL_COUNT; i++) {
    var tileDiv = getTileDiv(row, i);
    if (tileDiv.children().length > 0) {
      word.push([row, i]);
      if (tileDiv.children(".dirty").length == 0) {
        res.hasConnection = true;
      }
    } else {
      break;
    }
  }

  if (word.length > 1) {
    res.found = true;
    res.word = word;
  }

  return res;
}

unwrapTilePositions = function(tileList) {
  var unwrappedPositions = [];
  for (var i = 0; i < tileList.length; i++) {
    unwrappedPositions.push([$(tileList[i]).parent().parent().data("row"), $(tileList[i]).parent().data("col")]);
  }
  return unwrappedPositions;
}

calculateScore = function(words) {
  // get all dirty tiles on the board
  var totalScore = 0;

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var wordScore = 0;
    var wordMultiplier = 0;

    // get all the tiles in this word and calculate the word's score
    // scorefuncts only count for dirty tiles
    for (var k = 0; k < word.length; k++) {
      var letterScore = 0;
      var letterMultiplier = 0;
      var tileMultipliers = [0, 0];

      // 1. get the base tile
      var baseTile = getTileDiv(word[k][0], word[k][1]);
      var letterTile = baseTile;
      
      // 2. check if it has a dirty tile
      if (baseTile.children(".dirty").length > 0) {
        letterTile = baseTile.children(".dirty");
        var scoreFunctionName = baseTile.data("scorefunct");
        if (scoreFunctionName) {
          tileMultipliers = window[scoreFunctionName]();
        }
      }

      letterScore = parseInt(letterTile.children(".letter-score").text());
      letterMultiplier += tileMultipliers[0];
      wordMultiplier += tileMultipliers[1];

      if (letterMultiplier > 0) {
        letterScore *= letterMultiplier;
      }

      wordScore += letterScore;
    }

    if (wordMultiplier > 0) {
      wordScore *= wordMultiplier;
    }

    totalScore += wordScore;
  }
  return totalScore;
}

displayTempScore = function(score) {
  $("#tempScore").text(score);
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

showAndEnableExchangeButton = function() {
  $("#exchangeButton").removeAttr("disabled").show();
}

hideAndDisableExchangeButton = function() {
  $("#exchangeButton").attr("disabled", "disabled").hide();
}

doubleLetter = function() {
  return [2, 0];
}

tripleLetter = function() {
  return [3, 0];
}

doubleWord = function() {
  return [0, 2];
}

tripleWord = function() {
  return [0, 3];
}
