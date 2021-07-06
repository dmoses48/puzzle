let attempts = 0;
// circle = 1, arrow = 2, backarrow = 3, plus = 4, incircle = -1, inarraow = -2, inbackarrow = -3, inplus = -4 
// left, top, right, bottom
const availablePieces =  [
    [2, 4, -3, -4],
    [2, 3, -1, -2],
    [3, 3, -4, -2],
    [4, 3, -3, -2],
    [3, 1, -4, -1],
    [1, 1, -2, -1],
    [1, 2, -2, -1],
    [4, 1, -1, -4],
    [4, 1, -2, -2],
    [3, 1, -3, -4],
    [2, 2, -3, -1],
    [2, 4, -1, -2],
    [1, 2, -4, -1],
    [3, 1, -2, -3],
    [3, 3, -4, -1],
    [4, 1, -1, -3]
]

const attemptedBoardPieces =  Array(16).fill("").map(() => []); // holds [ { piece, rotation } ]
const board = []; // holds { piece, rotation }


const getShape = (pieceRotation, index) => {
    if (pieceRotation == undefined) return undefined
    const rotatedIndex = (index + pieceRotation.rotation) % 4
    return pieceRotation.piece[rotatedIndex]
}

const pieceMatch = (piece1, piece2) => {
    return piece1.every((value, i) => piece2[i] == value)
}

function findNextAvailable() {
    const x = board.length % 4
    const y = Math.floor(board.length / 4)
    const aboveIndex = y == 0 ? -1 : x + (y - 1) * 4
    const leftIndex = x == 0 ? -1 : x - 1 + y * 4
    const abovePieceRotation = board[aboveIndex]
    const leftPieceRotation = board[leftIndex]

    const aboveShape = getShape(abovePieceRotation, 3)
    const leftShape = getShape(leftPieceRotation, 2)
    for(let pieceIndex = 0; pieceIndex < availablePieces.length; pieceIndex++) {
        const availablePiece = availablePieces[pieceIndex]
        for(let rotation = 0; rotation < 4; rotation++ ) {
            const alreadyAttempted = attemptedBoardPieces[board.length].find(attemptedPieceRotation => {
                return attemptedPieceRotation.rotation == rotation && pieceMatch(attemptedPieceRotation.piece, availablePiece)
            })
            if (alreadyAttempted) continue;
            const topFits = aboveShape == undefined || (aboveShape + getShape({ piece: availablePiece, rotation }, 1)) === 0;
            const leftFits = leftShape == undefined || (leftShape + getShape({ piece: availablePiece, rotation }, 0)) === 0;
            if (topFits && leftFits) {
                return { piece: availablePiece, rotation }
            }
        }
    }
    return undefined
}

do {
    const x = board.length % 4
    const y = board.length / 4
    const fittingPieceRotation = findNextAvailable()
    if (fittingPieceRotation) {
        attempts++;
        availablePieces.splice(availablePieces.findIndex(p => pieceMatch(fittingPieceRotation.piece, p)), 1)
        attemptedBoardPieces[board.length].push(fittingPieceRotation)
        board.push(fittingPieceRotation)

        console.log("Board Attempt", board)
    } else {
        availablePieces.push(board.pop().piece)
        while(!findNextAvailable() && board.length > 0) {
            attemptedBoardPieces[board.length] = []
            availablePieces.push(board.pop().piece)
        } 

        if (board.length == 0 && !findNextAvailable()) {
            throw Error("There are no solutions")
        }
    }
} while (board.length < 16);

console.log("We did it! In " + attempts + " tries.", board)
