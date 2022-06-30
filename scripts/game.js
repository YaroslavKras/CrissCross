const field = document.getElementById('gaming-field');
const playerMoves = [];
const aiMoves = [];
const HORIZONTAL = "HORIZONTAL";
const DIAGONAL = "DIAGONAL";
const ANY = "ANY";

function play(id) {
    let squareClicked = document.getElementById(id);
    console.log(field);
    if (squareClicked.textContent) {
        console.log(squareClicked.textContent);
        console.log('Square already taken');
        return
    } else {
        let position = squareClicked.classList.toString().split(" ");
        let coordinates = {
            yCoordinate: getCoordinates(position[0]),
            xCoordinate: getCoordinates(position[1])
        };
        squareClicked.classList.add('move-text');
        playerMoves.push(coordinates);
        squareClicked.textContent = "x";
        let neighbors = getNeighbors(coordinates, ANY);
        checkIfPlayerCompletedLine(coordinates, ANY, 1);
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

function checkIfPlayerCompletedLine(coordinates, directionToContinue, lineLength) {
    console.log("Calculating Result: Previous Coordinates = " + coordinates.yCoordinate + "/" + coordinates.xCoordinate + "; Looking for square in " + directionToContinue + " direction; Line length is " + lineLength);
    let neighboringSquares = getNeighbors(coordinates, directionToContinue);
    for (let i = 0; i < neighboringSquares.length; i++) {
        let square = neighboringSquares[i];
        if (isSquareXMarked(square)) {
            lineLength++;
            if (lineLength === 3) {
                alert("YOU WON")
            }
            if (isDiagonal(coordinates, square)) {
                checkIfPlayerCompletedLine(square, DIAGONAL, 2);
            } else {
                checkIfPlayerCompletedLine(square, HORIZONTAL, 2);
            }
        }
        return;
    }
}

function isDiagonal(coordinateA, coordinateB) {
    return (coordinateA.yCoordinate !== coordinateB.yCoordinate) && (coordinateA.xCoordinate !== coordinateB.xCoordinate);
}

function isHorizontalOrVertical(coordinateA, coordinateB) {
    return ((coordinateA.yCoordinate === coordinateB.yCoordinate) && (coordinateA.xCoordinate !== coordinateB.xCoordinate)) || ((coordinateA.yCoordinate !== coordinateB.yCoordinate) && (coordinateA.xCoordinate === coordinateB.xCoordinate));
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
                    if (isHorizontalOrVertical(neighborSquare, coordinates)) {
                        result.push(neighborSquare);
                    }
                } else if (direction === DIAGONAL) {
                    if (isDiagonal(neighborSquare, coordinates)){
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

function isSquareXMarked(coordinate) {
    for (let i = 0; i < playerMoves.length; i++) {
        if(areCoordinatesSame(playerMoves[i], coordinate)){
            return coordinate;
        }
    }
    return false;
}

function isSquareOMarked(coordinate) {

}

function containsCoordinates(array, valueToFind) {
    return (array[0] === valueToFind[0]) && (array[1] === valueToFind[1]);
}

function hasDiagonalOptions(coordinates) {
    //if square is in corner of top or bottom row
    if ((coordinates[0] === 0 || coordinates[0] === 2) && ((coordinates[1] === 0 || coordinates[1] === 2) || (coordinates[1] === 0 || coordinates[1] === 2))) {
        return true;
    }
    //if square is in the middle of middle row
    else if (coordinates[0] === 1 && coordinates[1] === 1) {
        return true;
    }
    return false;
}

function aiMove() {
    let aiChoiceSquare = document.getElementById('mid');
    let position = aiChoiceSquare.classList.toString().split(" ");
    let coordinates = [getCoordinates(position[0]), getCoordinates(position[1])];
    aiChoiceSquare.classList.add('move-text');
    aiMoves.push(coordinates);
    aiChoiceSquare.textContent = "O";
    return getNeighbors(coordinates);
}