const field = document.getElementById('gaming-field');
const playerMoves = [];
const HORIZONTAL = "HORIZONTAL";
const DIAGONAL = "DIAGONAL";
const VERTICAL = "VERTICAL";
const checkingQueue = [];
let previousMove;

function play(id) {
    let squareClicked = document.getElementById(id);
    console.log(field);
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
        let direction;
        if (previousMove) {
            direction = determineDirection(previousMove, coordinates)
        }
        console.log(direction);
        checkIfPlayerCompletedLine(coordinates, direction, 1);
        previousMove = coordinates;
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
    //this is the first turn
    if (!previousMove) {
        return false;
    }
    checkingQueue.push(coordinates);
    let neighboringSquares = getNeighbors(coordinates, directionToContinue);
    for (let i = 0; i < neighboringSquares.length; i++) {
        let square = neighboringSquares[i];
        if (contains(checkingQueue, square) !== -1) {
            continue;
        }
        if (isSquareXMarked(square)) {
            checkingQueue.push(square);
            if (!areCoordinatesSame(coordinates, square)) {
                lineLength++;
                console.log("Found some marked neighbors at " + coordinates.yCoordinate + "/" + coordinates.xCoordinate + ". Line length is now " + lineLength);
            }
            if (lineLength === 3) {
                alert("YOU WON")
            }
            if (isDiagonal(coordinates, square)) {
                if (doesNextSquareExists(coordinates, square, DIAGONAL)) {
                    checkIfPlayerCompletedLine(square, DIAGONAL, lineLength);
                }
            } else if (isHorizontal(coordinates, square)) {
                if (doesNextSquareExists(coordinates, square, HORIZONTAL)) {
                    checkIfPlayerCompletedLine(square, HORIZONTAL, lineLength);
                }
            } else {
                if(doesNextSquareExists(coordinates, square, VERTICAL)){
                    checkIfPlayerCompletedLine(square, VERTICAL, lineLength)
                }
            }
        }
        checkingQueue.splice(0, checkingQueue.length);
        console.log("Cleared checking queue. Length is now " + checkingQueue.length);
        return;
    }
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

function isSquareXMarked(coordinate) {
    for (let i = 0; i < playerMoves.length; i++) {
        if (areCoordinatesSame(playerMoves[i], coordinate)) {
            return coordinate;
        }
    }
    return false;
}

function determineDirection(previousCoordinates, currentCoordinates) {
    if (previousCoordinates.yCoordinate !== currentCoordinates.yCoordinate && previousCoordinates.xCoordinate !== currentCoordinates.xCoordinate) {
        return DIAGONAL;
    } else if (previousCoordinates.yCoordinate !== currentCoordinates.yCoordinate) {
        return VERTICAL;
    } else {
        return HORIZONTAL;
    }
}

function doesNextSquareExists(previousCoordinates, currentCoordinates, direction) {
    if (isMiddleSquare(currentCoordinates)) {
        return true;
    }
    let neighbors = getNeighbors(currentCoordinates, direction);
    if (previousCoordinates) {
        let previousIndex = contains(neighbors, previousCoordinates);
        console.log("---" + previousIndex);
        if (previousIndex !== -1) {
            neighbors.splice(previousIndex, 1);
        }
    }
    console.log("****" + neighbors);
    return !(neighbors.length === 0);
}

function isMiddleSquare(coordinates) {
    return coordinates.yCoordinate === 1 && coordinates.xCoordinate === 1;
}

function contains(array, object) {
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (areCoordinatesSame(item, object)) {
            return i;
        }
    }
    return -1;
}