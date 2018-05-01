angular.module('myApp', ['gameServices']).factory('gameLogic', function() {

    'use strict';

    /**
     * A mapping of various corners and their positions.
     * For each direction (vert, right, left), positions of opposite
     * corners are indexed as lower = 0 and upper = 1.
     * @type {Object}
     */
    var corners = {
    	vert: [
    		[[5,1],[5,2],[6,2],[5,3],[6,3],[7,3],[5,4],[6,4],[7,4],[8,4]],
    		[[13,17],[12,16],[13,16],[11,15],[12,15],[13,15],[10,14],[11,14],[12,14],[13,14]]
    	],
    	left: [
    		[[1,5],[2,5],[2,6],[3,5],[3,6],[3,7],[4,5],[4,6],[4,7],[4,8]],
    		[[5,10],[5,11],[5,12],[5,13],[6,11],[6,12],[6,13],[7,12],[7,13],[8,13]]
    	],

    	right: [
    		[[10,5],[11,5],[11,6],[12,5],[12,6],[12,7],[13,5],[13,6],[13,7],[13,8]],
    		[[14,10],[14,11],[14,12],[14,13],[15,11],[15,12],[15,13],[16,12],[16,13],[17,13]]
    	]
    };

    var nPlayers = 2;

   /**
    * For the given number of players, returns a mapping of the checker color
    * and the starting(house) corner it occupies in a clockwise order.
    * @param  {Number} numPlayers number of players in game.
    * @return {Array} corner map
    */
  	function getPlayerMap(numPlayers) {
  		var players = [];
   		switch(numPlayers) {
    		case 2:
    			players = [
    				{ p: 'R', c: 'vert', 	i: 0 }, // Bottom
    				{ p: 'K', c: 'vert', 	i: 1 } 	// Top
    			];
    			break;
    		case 3:
    			players = [
    				{ p: 'R', c: 'vert', 	i: 0 }, // Bottom
    				{ p: 'G', c: 'left', 	i: 1 }, // Left upper
    				{ p: 'B', c: 'right', 	i: 1 }	// Right upper
    			];
    			break;

    		case 4:
    			players = [
    				{ p: 'Y', c: 'left', 	i: 0 },	// Left lower
    				{ p: 'G', c: 'left', 	i: 1 },	// Left upper
    				{ p: 'B', c: 'right', 	i: 1 },	// Right upper
    				{ p: 'W', c: 'right', 	i: 0 } 	// Right lower
    			];
    			break;

    		case 6:
    			players = [
    				{ p: 'R', c: 'vert', 	i: 0 },
    				{ p: 'Y', c: 'left', 	i: 0 },
    				{ p: 'G', c: 'left', 	i: 1 },
    				{ p: 'K', c: 'vert', 	i: 1 },
    				{ p: 'B', c: 'right', 	i: 1 },
    				{ p: 'W', c: 'right', 	i: 0 }
    			];
    			break;

			default:
				throw new Error('Illegal number of players: ' + nPlayers);
    	}
    	return players;
  	}

    function setNumPlayers(numPlayers) {
    	nPlayers = numPlayers;
    }

	function getInitialBoard() {
/*		var R = 'a',
			G = 'a',
			B = 'a',
			Y = 'a',
			K = 'a',
			W = 'a';

		switch(nPlayers) {
			case 6:
				R = 'R';
				K = 'K'
			case 4:
				W = 'W';
				G = 'G';
				B = 'B';
				Y = 'Y';
				break;
			case 3:
				R = 'R';
				G = 'G';
				B = 'B';
				break;
			case 2:
				R = 'R';
				K = 'K';
				break;
			default:
				throw new Error('Illegal number of players: ' + nPlayers);
		}

      	return  [
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ',  Y , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ',  Y ,  Y , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ',  Y ,  Y ,  Y , ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ',  Y ,  Y ,  Y ,  Y , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ',  R ,  R ,  R ,  R , 'a', 'a', 'a', 'a', 'a',  G ,  G ,  G ,  G , ' '],
			[' ', ' ',  R ,  R ,  R , 'a', 'a', 'a', 'a', 'a', 'a',  G ,  G ,  G , ' '],
			[' ', ' ', ' ',  R ,  R , 'a', 'a', 'a', 'a', 'a', 'a', 'a',  G ,  G , ' '],
			[' ', ' ', ' ', ' ',  R , 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',  G , ' '],
			[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
			[' ', ' ', ' ', ' ', ' ',  W , 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',  K , ' '],
			[' ', ' ', ' ', ' ', ' ',  W ,  W , 'a', 'a', 'a', 'a', 'a', 'a', 'a',  K ,  K , ' '],
			[' ', ' ', ' ', ' ', ' ',  W ,  W ,  W , 'a', 'a', 'a', 'a', 'a', 'a',  K ,  K ,  K , ' '],
			[' ', ' ', ' ', ' ', ' ',  W ,  W ,  W ,  W , 'a', 'a', 'a', 'a', 'a',  K ,  K ,  K ,  K , ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',  B ,  B ,  B ,  B , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',  B ,  B ,  B , ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',  B ,  B , ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',  B , ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
      	];*/

		var board = [
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a' , 'a' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a' , 'a' , 'a' , ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a' , 'a' , 'a' , 'a' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', 'a', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'a', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'a', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'a', ' '],
				[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
	      	];

      	var map = getPlayerMap(nPlayers);
      	for( var i = 0; i < nPlayers; i++ ) {
      		var checker = map[i].p;
      		var corner = corners[map[i].c][map[i].i];
      		for( var j = 0; j < 10; j++ ) {
      			board[corner[j][0]][corner[j][1]] = checker;
      		}
      	}
      	return board;
  	}

  	function getCheckerByTurn(turnIndex) {
  		return getPlayerMap(nPlayers)[turnIndex].p;
  	}

	function getWinner(board) {
		var players = getPlayerMap(nPlayers);
		for( var i = 0; i < nPlayers; i++ ) {
			var count = 0,
				oppCorner = corners[players[i].c][1 - players[i].i];
			for( var j = 0; j < 10; j++ ) {
				if( board[oppCorner[j][0]][oppCorner[j][1]] !== players[i].p ) {
					break;
				}
				count++;
			}

			if( count === 10 ) {
				return i;
			}
		}
		return -1;
	}

  	function getValidFromPositions(board, turnIndex) {
  		var turnChecker = getCheckerByTurn(turnIndex),
  			validPositions = [];
  		for( var i = 1; i < 18; i++ ) {
  			for( var j = 1; j < board[i].length; j++ ) {
  				if(board[i][j] === turnChecker) {
  					validPositions.push({row: i, col: j});
  				}
  			}
  		}
  		return validPositions;
  	}

	function isValidPosition(row, col, board){
		if( board[row][col] === ' ' || board[row][col] === undefined ){
			return false;
		}
		return true;
	}


	function isOneStepMove(oldrow, oldcol, row, col){
		if( Math.abs(oldrow - row) + Math.abs(oldcol - col) === 1 ||
			(row === oldrow+1 && col === oldcol+1) ||
			(row === oldrow-1 && col === oldcol-1)) {
			return true;
		}
		return false;
	}


	function getValidJumps(row, col, board) {
		var jumpPositions = [];

		if( board[row] && board[row][col+1] !== ' ' &&
			board[row][col+1] !== 'a' &&
			board[row][col+2] === 'a' ) {
			jumpPositions.push( [row, col + 2] );
		}

		if( board[row+1] && board[row+1][col+1] !== ' ' &&
			board[row+1][col+1] !== 'a' &&
			board[row+2][col+2] === 'a' ) {
			jumpPositions.push( [row + 2, col + 2] );
		}

		if( board[row+1] && board[row+1][col] !== ' ' &&
			board[row+1][col] !== 'a' &&
			board[row+2][col] === 'a' ) {
			jumpPositions.push( [row + 2, col] );
		}

		if( board[row] && board[row][col-1] !== ' ' &&
			board[row][col-1] !== 'a' &&
			board[row][col-2] === 'a' ) {
			jumpPositions.push( [row, col - 2] );
		}

		if( board[row-1] && board[row-1][col-1] !== ' ' &&
			board[row-1][col-1] !== 'a' &&
			board[row-2][col-2] === 'a' ) {
			jumpPositions.push( [row - 2, col - 2] );
		}

		if( board[row-1] && 	board[row-1][col] !== ' ' &&
			board[row-1][col] !== 'a' &&
			board[row-2][col] === 'a' ) {
			jumpPositions.push( [row - 2, col] );
		}

		return jumpPositions;
	}


	function isPositionInArray(arr, pos) {
		for( var i = 0; i < arr.length; i++ ){
			if( arr[i][0] === pos[0] && arr[i][1] === pos[1] ) {
				return true;
			}
		}
		return false;
	}

	function isMultiStepMove(oldrow, oldcol, row, col, board) {
		var hops = [];
		function isValidHopMove(pos) {
			if( pos[0] === row && pos[1] === col ) {
				return true;
			}
			else if( !isValidPosition(pos[0], pos[1], board) ) {
				return false;
			}

			hops.push(pos);
			var jumps = getValidJumps(pos[0], pos[1], board),
				valid = false;

			for( var i = 0; i < jumps.length; i++ ) {
				if(!isPositionInArray(hops, jumps[i])) {
					valid |= isValidHopMove(jumps[i]);
				}
			}

			if( !valid ) {
				hops.pop();
			}
			return valid;
		}

		if( isValidHopMove([oldrow, oldcol]) ) {
			return hops;
		}
		return false;
	}


    function getPossibleMoves(board, turnIndex) {
        var possibleMoves = [],
        	validFromPositions = getValidFromPositions(board, turnIndex);

        for(var i = 0; i < validFromPositions.length; i++) {
        	var pos = validFromPositions[i];
	  		for( var j = 1; j < 18; j++ ) {
	  			for( var k = 1; k < board[j].length; k++ ) {
			        try {
			          	possibleMoves.push(createMove(pos.row, pos.col, j, k, turnIndex, board));
			        } catch (e) {
			          	// The cell in that position was full.
			        }
	  			}
	  		}
        }
        return possibleMoves;
    }

	function createMove(oldrow, oldcol, row, col, turnIndexBeforeMove, board) {

		if( board === undefined ) {
			board = getInitialBoard();
		}

	 	if( !isValidPosition(row, col, board) ) {
	  		throw new Error("One can not make a move outside of the board!");
	  	}

	  	if( board[row][col] !== 'a' ) {
	  		throw new Error("One can only make a move in an empty position!");
	  	}

	  	var hops = [];
	  	if( !isOneStepMove(oldrow, oldcol, row, col) && (hops = isMultiStepMove(oldrow, oldcol, row, col, board)) === false ) {
	  		throw new Error("One can only make a single step adjacent move or a multi-step move consisting of adjacent hops");
	  	}

	  	var boardAfterMove = angular.copy(board);
	  	boardAfterMove[row][col] = getCheckerByTurn(turnIndexBeforeMove);
	  	if(boardAfterMove[oldrow][oldcol] === boardAfterMove[row][col]){
			boardAfterMove[oldrow][oldcol] = 'a';
		}
		else {
			throw new Error("The original checker is not the expected one!");
		}

		var winner = getWinner(boardAfterMove),
			firstOperation = {};

		if( winner !== -1 ){
			var score = Array.apply(null, new Array(nPlayers)).map(Number.prototype.valueOf,0);
			score[winner] = 1;
			firstOperation = {endMatch: {endMatchScores: score}};
		} else {
			firstOperation = {setTurn: {turnIndex: (++turnIndexBeforeMove) % nPlayers }};
		}

		return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {oldrow: oldrow, oldcol: oldcol, row: row, col: col}}},
            {set: {key: 'hops', value: hops} }];
	}

	// To show this example Moves through $animate, additional
	// verifications are needed in that problems with turnIndex
	function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColSets){
		var exampleMove = [];
		var state = initialState;
		var turnIndex = initialTurnIndex;
		for(var i=0; i<arrayOfRowColSets.length; i++){
			var rowColSets = arrayOfRowColSets[i];
			var move = createMove(rowColSets.oldrow,rowColSets.oldcol,rowColSets.row, rowColSets.col,turnIndex,state.board);
			var stateAfterMove = {board : move[1].set.value, delta : move[2].set.value};
			exampleMove.push({
				stateBeforeMove: state,
	        	stateAfterMove: stateAfterMove,
	        	turnIndexBeforeMove: turnIndex,
	        	//turnIndexAfterMove: 1 - turnIndex,
	        	move: move,
	        	comment: {en: rowColSets.comment}
			});
			state = stateAfterMove;
			turnIndex = move[0].setTurn.turnIndex;
		}
		return exampleMove;
	}

	function getExampleGame(){
		return getExampleMoves(0, {}, [
			{oldrow: 6, oldcol: 4, row: 6, col: 5, comment: "First player usually might move a topmost piece one step towards its opposite corner"},
			{oldrow: 11, oldcol: 14, row: 11, col: 13, comment: "Second player gets a similar move from his own corner"},
			{oldrow: 6, oldcol: 2, row: 6, col: 6, comment: "Two consecutive hops takes place during the first player's turn. A hop consist of jumping over a single adjacent piece, only the diagonal direction is allowed"},
			{oldrow: 12, oldcol: 15, row: 12, col: 13, comment: "Second player also provides a single hop from the middle of his second line, and jumps one more step based on one of the piece in his topmost line"},
			{oldrow: 7, oldcol: 4, row: 7, col: 5, comment: "One step in its adjacent empty position towards the opposite corner， A player may not combine hopping with a single move"},
			{oldrow: 13, oldcol: 14, row: 11, col: 12, comment: "A single hop based on his own pieces"},
			{oldrow: 5, oldcol: 2, row: 7, col: 6, comment: "Two consecutive hops based on his own pieces"},
			{oldrow: 11, oldcol: 12, row: 11, col: 11, comment: "One step in its adjacent empty position in order to provide other pieces a better chance to move more steps"},
			{oldrow: 7, oldcol: 6, row: 8, col: 7, comment:"First player gives a single move on the piece's adjacent empty space"},
			{oldrow: 13, oldcol: 16, row: 11, col: 10, comment:"Second player has a three-step-hops move towards the opposite corner, The more distance your piece takes place, the better chance you win"},
			{oldrow: 5, oldcol: 1, row: 5, col: 2, comment:"First player moves the innermost piece one step to prepare for another long jump"},
			{oldrow: 11, oldcol: 10, row: 10, col: 9, comment:"Second player takes one move to form a longer bridge to prepare for a long jump as well"},
			{oldrow: 5, oldcol: 2, row: 9, col: 8, comment:"First player provides a three-step-hops, now arround the new location, there are two kind of pieces"},
			{oldrow: 12, oldcol: 14, row: 10, col: 8, comment:"Second player takes a three-step-hops again"},
			{oldrow: 9, oldcol: 8, row: 13, col: 16, comment:"First player makes use of his opponent's pieces, provides a four-step-hops and finally located in his opponent's corner, He'll win the game if all his pieces firstly place in the opposite corner"},
			{oldrow: 11, oldcol: 15, row: 11, col: 14, comment:"Second player makes one step move"},
			{oldrow: 5, oldcol: 4, row: 13, col: 14, comment:"First player makes a five-step-hops based on both his and his opponent's pieces"},
			{oldrow: 11, oldcol: 14, row: 5, col: 2, comment:"Second player makes a even better six-step-hops based on both sides' pieces"},
			{oldrow: 6, oldcol: 6, row: 7, col: 6, comment:"First player takes a one step move, wants to block the 'bridge' as well as to prepare for the next long jump"},
			{oldrow: 13, oldcol: 17, row: 11, col: 15, comment:"Second player gives a hop from the innermost corner"},
			{oldrow: 7, oldcol: 6, row: 11, col: 14, comment:"First player takes a four-step-hops and settles another his piece in his opposite corner"},
			{oldrow: 10, oldcol: 14, row: 10, col: 10, comment:"Second player takes a three-step-hops"},
			{oldrow: 6, oldcol: 5, row: 7, col: 6, comment:"First player provides a single move"},
			{oldrow: 10, oldcol: 8, row: 9, col: 8, comment:"Second player also takes a single move to block his opponent's further jump"},
			{oldrow: 13, oldcol: 16, row: 13, col: 17, comment:"First player occupied the innermost corner with one single move, in most case this piece will never move again"},
			{oldrow: 10, oldcol: 10, row: 6, col: 4, comment:"Second player makes some progress, with a four-step-hops, another piece reaches the opposite corner"},
			{oldrow: 13, oldcol: 14, row: 13, col: 16, comment:"First player gets a hop in his opposite corner"},
			{oldrow: 11, oldcol: 13, row: 11, col: 12, comment:"Second player gives a single move before jumping "},
			{oldrow: 8, oldcol: 4, row: 7, col: 4, comment:"First player gives a single move before jumping"},
			{oldrow: 9, oldcol: 8, row: 9, col: 7, comment:"Second player moves away the blocker on 'bridge'"},
			{oldrow: 7, oldcol: 6, row: 11, col: 10, comment:"First player forward a piece on the bridge, but still be blocked by another piece, one can not jump through two or more adjacent pieces"},
			{oldrow: 11, oldcol: 12, row: 12, col: 12, comment:"Second player moves his bridge blocker one step away, try to use another diagonal way to jump, but this is a mistake, his opponent now can make use of the whole 'bridge'"},
			{oldrow: 11, oldcol: 10, row: 13, col: 14, comment:"First player gives a two-step-hops, another piece has been settled in the corner"},
			{oldrow: 12, oldcol: 12, row: 8, col: 6, comment:"Second player forward his piece by three-step-hops, but still blocked by his own piece"},
			{oldrow: 7, oldcol: 4, row: 11, col: 12, comment:"First player gives a four-step-hops"},
			{oldrow: 5, oldcol: 2, row: 5, col: 1, comment:"Second player moves a piece to the innermost corner"},
			{oldrow: 11, oldcol: 12, row: 11, col: 13, comment:"First player takes a single move to form a better 'bridge'"},
			{oldrow: 13, oldcol: 15, row: 12, col: 14, comment:"Second player provides a single move"},
			{oldrow: 11, oldcol: 14, row: 12, col: 15, comment:"First player also maneuvers his piece in the opposite corner to make room for newly imcoming pieces"},
			{oldrow: 12, oldcol: 14, row: 10, col: 8, comment:"Second player gives a three-step-hops on the bridge, but still be blocked"},
			{oldrow: 7, oldcol: 3, row: 7, col: 4, comment:"First player makes a single move on his side of 'bridge'"},
			{oldrow: 6, oldcol: 4, row: 6, col: 2, comment:"Second player gives a hop to clear the end of 'bridge'"},
			{oldrow: 7, oldcol: 4, row: 11, col: 14, comment:"First player provides a long consecutive jumps from the beginning of the 'bridge' to the end"},
			{oldrow: 8, oldcol: 6, row: 6, col: 4, comment:"Second player makes a one-step-hop to clean the end of his 'bridge'"},
			{oldrow: 11, oldcol: 14, row: 12, col: 14, comment:"First player makes a hop to clean his end of 'bridge' as well"},
			{oldrow: 12, oldcol: 16, row: 10, col: 14, comment:"Second player makes a hop"},
			{oldrow: 6, oldcol: 3, row: 7, col: 4, comment:"First player gives a single move before a long jump"},
			{oldrow: 6, oldcol: 4, row: 6, col: 3, comment:"Second player provides a hop to make room for a new long jump"},
			{oldrow: 7, oldcol: 4, row: 11, col: 14, comment:"First player makes a long jump, it's cool"},
			{oldrow: 6, oldcol: 3, row: 5, col: 2, comment:"Second player makes a single move"},
			{oldrow: 12, oldcol: 14, row: 13, col: 15, comment:"First player also makes a single move"},
			{oldrow: 10, oldcol: 8, row: 6, col: 4, comment:"Second player gets a two-step-hops and reaches the opposite corner"},
			{oldrow: 8, oldcol: 7, row: 9, col: 8, comment:"First player takes a single move, he may decide to fold his 'bridge' at the end of game"},
			{oldrow: 6, oldcol: 4, row: 6, col: 3, comment:"Second player makes a single move the clean up a room"},
			{oldrow: 5, oldcol: 3, row: 6, col: 4, comment:"First player makes a single move, the final piece in his corner is now waiting on the entry of the 'bridge'"},
			{oldrow: 11, oldcol: 15, row: 9, col: 13, comment:"Second player jumps with a hop in his own corner"},
			{oldrow: 6, oldcol: 4, row: 12, col: 16, comment:"First player makes a cool six-step-hops into his opposite corner"},
			{oldrow: 9, oldcol: 13, row: 10, col: 13, comment:"Second player wants to reach his 'bridge', so he makes a single move towards it"},
			{oldrow: 11, oldcol: 14, row: 11, col: 15, comment:"First player makes a single move"},
			{oldrow: 10, oldcol: 14, row: 10, col: 12, comment:"Second player just makes a hop in his own corner"},
			{oldrow: 9, oldcol: 8, row: 11, col: 14, comment:"First player takes a three-step-hops, now only two pieces are not in his opposite corner"},
			{oldrow: 10, oldcol: 13, row: 10, col: 11, comment:"Second player makes a hop towards still his 'bridge'"},
			{oldrow: 7, oldcol: 5, row: 8, col: 6, comment:"First player gives a single move before a long jump"},
			{oldrow: 10, oldcol: 12, row: 11, col: 12, comment:"Second player provides a single move"},
			{oldrow: 8, oldcol: 6, row: 12, col: 14, comment:"First player makes a four-step-hops into its corner"},
			{oldrow: 11, oldcol: 12, row: 9, col: 6, comment:"Second player gets a three-step-hops"},
			{oldrow: 11, oldcol: 14, row: 10, col: 14, comment:"First player makes a single move before final win"},
			{oldrow: 9, oldcol: 6, row: 8, col: 5, comment:"Second player makes a single move to form a new 'bridge'"},
			{oldrow: 11, oldcol: 13, row: 11, col: 14, comment:"First player makes a final single move, now all his pieces are firstly in his opponent's corner, this gets him win the game"}
		]);
	}

	/**
	 * The platform will use isMoveOk to check validation
	 * Make sure every thing passing to platform is correct
	 * For long jump movement, create board and state step
	 * by step according to chain value before send to platform
	 */
	function isMoveOk(params){
		try{
			var move = params.move;
			var turnIndexBeforeMove = params.turnIndexBeforeMove;
	    	var stateBeforeMove = params.stateBeforeMove;
	    	var deltaValue = move[2].set.value;
	    	var oldrow = deltaValue.oldrow;
	      	var oldcol = deltaValue.oldcol;
	      	var row = deltaValue.row;
	      	var col = deltaValue.col;
	      	var boardBeforeMove = stateBeforeMove.board;

			var expectedMove = createMove(oldrow, oldcol, row, col, turnIndexBeforeMove, boardBeforeMove);
			if( !angular.equals(move, expectedMove) ){
				return false;
			}
		} catch(e) {
			return false;
		}
		return true;
	}

    return {
    	setNumPlayers: setNumPlayers,
        getInitialBoard: getInitialBoard,
        createMove: createMove,
        isMoveOk: isMoveOk,
        getPossibleMoves: getPossibleMoves,
		getExampleGame: getExampleGame,
		getCheckerByTurn: getCheckerByTurn,
		getValidFromPositions: getValidFromPositions
    };
});
