const playerMoves = [];
const aiMoves = [];
const HORIZONTAL = "HORIZONTAL";
const DIAGONAL = "DIAGONAL";
const VERTICAL = "VERTICAL";
const PLAYER = "PLAYER";
const AI = "AI";
let turnOwner = PLAYER;
let previousMove;

function play(id) {
    if (!(turnOwner === PLAYER)) {
        console.log("NOT YOUR TURN");
        return;
    }
    let squareClicked = document.getElementById(id);
    turnOwner = PLAYER;
    if (squareClicked.textContent) {
        console.log(squareClicked.textContent);
        console.log('Square already taken');
    } else {
        let position = squareClicked.classList.toString().split(" ");
        let coordinates = {
            yCoordinate: getCoordinates(position[0]),
            xCoordinate: getCoordinates(position[1])
        };
        squareClicked.classList.add('move-text');
        playerMoves.push(coordinates);
        squareClicked.textContent = "x";
        previousMove = coordinates;
        console.log(checkWinCondition());
        turnOwner = AI;
        makeAImove();
    }

}

function makeAImove() {
    let midSquare = document.getElementById("mid-mid");
    let position = midSquare.classList.toString().split(" ");
    let squareCoord = {
        yCoordinate: getCoordinates(position[0]),
        xCoordinate: getCoordinates(position[1])
    }
    if (!isSquareMarked(squareCoord)) {
        midSquare.textContent = "O";
        aiMoves.push(squareCoord);
        turnOwner = PLAYER;
    } else if (playerMoves.length === 1) {
        //Mark a corner if center is marked on a first turn, otherwise defeat is almost guaranteed
        let horizontal = ['upper', 'lower'];
        let vertical = ['left', 'right'];
        let horizontalId = Math.floor(Math.random() * 2);
        let verticalId = Math.floor(Math.random() * 2);
        let id = getIdForY(horizontal[horizontalId]) + "-" + getIdForX(vertical[verticalId]);
        let element = document.getElementById(id);
        element.textContent = "O";
        turnOwner = PLAYER;
    } else {
        while (turnOwner === AI) {
            let yCoord = Math.floor(Math.random() * (3));
            let xCoord = Math.floor(Math.random() * (3));
            let square = {
                yCoordinate: yCoord,
                xCoordinate: xCoord
            }
            if (!isSquareMarked(square)) {
                let id = getIdForY(square.yCoordinate) + "-" + getIdForX(square.xCoordinate);
                let element = document.getElementById(id);
                element.textContent = "O";
                turnOwner = PLAYER;
            } else if ((aiMoves.length + playerMoves.length) === 9) {
                turnOwner = PLAYER;
                break;
            }
        }
    }
}

function determineBlockMove() {
    let blockMoveCoordinates = [];
    for (const move of playerMoves) {
        let horizontalLine = getLineOfLength(move, 2, HORIZONTAL);
        let verticalLine = getLineOfLength(move, 2, VERTICAL);
        let diagonalLine = getLineOfLength(move, 2, DIAGONAL);
        if(horizontalLine !== null){
            //get missing coordinate and add it to result array
        }
        if (verticalLine !== null){

        }
        if (diagonalLine !== null){

        }
    }
}

function getCoordinates(position) {
    switch (position) {
        case 'upper':
        case 'left':
            return 0;
        case 'mid':
            return 1;
        case 'lower':
        case 'right':
            return 2;
        default:
            return "";
    }
}

function getIdForY(coordinates) {
    switch (coordinates) {
        case 0:
            return 'upper';
        case 1:
            return 'mid';
        case 2:
            return 'lower';
        default:
            return "";
    }
}

function getIdForX(coordinates) {
    switch (coordinates) {
        case 0:
            return 'left';
        case 1:
            return 'mid';
        case 2:
            return 'right';
        default:
            return "";
    }
}

function checkWinCondition(turnOwner) {
    if (turnOwner === PLAYER) {
        return playerMoves.some(haveCompletedLines);

    } else {
        return aiMoves.some(haveCompletedLines);
    }
}

function getLineOfLength(coordinates, length, direction) {
    let line = getNeighbors(coordinates, direction);
    let verticalLine = getNeighbors(coordinates, VERTICAL);
    let diagonalLine = getNeighbors(coordinates, DIAGONAL);
    //Add this square to the line, so it is included
    line.push(coordinates);
    line.filter(isSquareXMarked);
    if(line.length > length){
        return line;
    }
    return null;
}

function haveCompletedLines(coordinates) {
    let horizontalLine = getNeighbors(coordinates, HORIZONTAL);
    let verticalLine = getNeighbors(coordinates, VERTICAL);
    let diagonalLine = getNeighbors(coordinates, DIAGONAL);
    //Add this square to the line, so it is included in checkWinCondition too
    horizontalLine.push(coordinates);
    verticalLine.push(coordinates);
    diagonalLine.push(coordinates);
    let isHLineCompleted = horizontalLine.filter(isSquareXMarked).length > 2;
    let isVLineCompleted = verticalLine.filter(isSquareXMarked).length > 2;
    let isDLineCompleted = diagonalLine.filter(isSquareXMarked).length > 2;
    return isHLineCompleted || isVLineCompleted || isDLineCompleted;
}


function isDiagonal(coordinateA, coordinateB) {
    return (coordinateA.yCoordinate !== coordinateB.yCoordinate) && (coordinateA.xCoordinate !== coordinateB.xCoordinate);
}

function isHorizontal(coordinateA, coordinateB) {
    return coordinateA.yCoordinate === coordinateB.yCoordinate && coordinateA.xCoordinate !== coordinateB.xCoordinate;
}

function isVertical(coordinateA, coordinateB) {
    return coordinateA.yCoordinate !== coordinateB.yCoordinate && coordinateA.xCoordinate === coordinateB.xCoordinate;
}

function getNeighbors(coordinates, direction) {
    let result = [];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let neighborSquare = {
                yCoordinate: coordinates.yCoordinate + i,
                xCoordinate: coordinates.xCoordinate + j
            };
            if (neighborSquare.yCoordinate >= 0 && neighborSquare.xCoordinate >= 0 &&
                !(neighborSquare.yCoordinate === coordinates.yCoordinate && neighborSquare.xCoordinate === coordinates.xCoordinate) &&
                (neighborSquare.yCoordinate < 3 && neighborSquare.xCoordinate < 3)) {
                if (direction === HORIZONTAL) {
                    if (isHorizontal(neighborSquare, coordinates)) {
                        result.push(neighborSquare);
                    }
                } else if (direction === VERTICAL) {
                    if (isVertical(neighborSquare, coordinates)) {
                        result.push(neighborSquare)
                    }
                } else if (direction === DIAGONAL) {
                    if (isDiagonal(neighborSquare, coordinates)) {
                        result.push(neighborSquare);
                    }
                } else {
                    result.push(neighborSquare);
                }

            }
        }
    }
    return result;
}


function areCoordinatesSame(firstCoordinates, secondCoordinates) {
    return JSON.stringify(firstCoordinates) === JSON.stringify(secondCoordinates);
}

function isSquareMarked(coordinate) {
    return isSquareOMarked(coordinate) || isSquareXMarked(coordinate);
}

function isSquareXMarked(coordinate) {
    for (let i = 0; i < playerMoves.length; i++) {
        if (areCoordinatesSame(playerMoves[i], coordinate)) {
            return coordinate;
        }
    }
    return false;
}

function isSquareOMarked(coordinate) {
    for (let i = 0; i < aiMoves.length; i++) {
        if (areCoordinatesSame(aiMoves[i], coordinate)) {
            return coordinate;
        }
    }
    return false;
}