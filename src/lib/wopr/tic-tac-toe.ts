/**
 * Tic-Tac-Toe Game Engine for WOPR
 * Player is X, WOPR is O
 */

export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface TicTacToeState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'TIE' | null;
  isGameOver: boolean;
}

export function createNewGame(): TicTacToeState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X', // Player goes first
    winner: null,
    isGameOver: false,
  };
}

export function displayBoard(board: Board): string {
  const display = (index: number) => board[index] || ' ';

  return [
    '',
    '     A   B   C',
    `  1  ${display(0)} | ${display(1)} | ${display(2)}`,
    '    -----------',
    `  2  ${display(3)} | ${display(4)} | ${display(5)}`,
    '    -----------',
    `  3  ${display(6)} | ${display(7)} | ${display(8)}`,
    '',
  ].join('\r\n');
}

export function parseMove(move: string): number | null {
  const normalized = move.toUpperCase().trim();
  const moveMap: Record<string, number> = {
    'A1': 0, 'B1': 1, 'C1': 2,
    'A2': 3, 'B2': 4, 'C2': 5,
    'A3': 6, 'B3': 7, 'C3': 8,
  };

  return moveMap[normalized] ?? null;
}

export function makeMove(state: TicTacToeState, position: number): TicTacToeState {
  if (state.isGameOver || state.board[position] !== null) {
    return state;
  }

  const newBoard = [...state.board];
  newBoard[position] = state.currentPlayer;

  const winner = checkWinner(newBoard);
  const isGameOver = winner !== null || newBoard.every(cell => cell !== null);

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner: winner || (isGameOver ? 'TIE' : null),
    isGameOver,
  };
}

export function checkWinner(board: Board): Player | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];

  for (const pattern of winPatterns) {
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];
    if (a !== undefined && b !== undefined && c !== undefined &&
        board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export function getWOPRMove(board: Board): number {
  // WOPR AI - tries to win, block, or take center/corner

  // 1. Check if WOPR can win
  const winMove = findWinningMove(board, 'O');
  if (winMove !== null) return winMove;

  // 2. Check if need to block player
  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== null) return blockMove;

  // 3. Take center if available
  if (board[4] === null) return 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    const corner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    if (corner !== undefined) return corner;
  }

  // 5. Take any available space
  const available = board.map((cell, i) => cell === null ? i : null).filter(i => i !== null) as number[];
  const chosen = available[Math.floor(Math.random() * available.length)];
  if (chosen !== undefined) return chosen;

  // Fallback (should never happen)
  return 0;
}

function findWinningMove(board: Board, player: Player): number | null {
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinner(testBoard) === player) {
        return i;
      }
    }
  }
  return null;
}
