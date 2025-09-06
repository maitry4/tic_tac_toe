// tic_tac_toe.c
#include <stdbool.h>

#define BOARD_SIZE 9
#define EMPTY ' '
#define PLAYER_X 'X'
#define PLAYER_O 'O'

// Initialize board - fill all cells with EMPTY
void init_board(char* board) {
    for (int i = 0; i < BOARD_SIZE; i++) {
        board[i] = EMPTY;
    }
}

// Check if move at pos (0-8) is valid (empty cell)
bool is_valid_move(char* board, int pos) {
    if (pos < 0 || pos >= BOARD_SIZE) {
        return false;
    }
    return board[pos] == EMPTY;
}

// Make move if valid; return true if successful
bool make_move(char* board, int pos, char player) {
    if (player != PLAYER_X && player != PLAYER_O) {
        return false;
    }
    if (!is_valid_move(board, pos)) {
        return false;
    }
    board[pos] = player;
    return true;
}

// Check winner: returns PLAYER_X, PLAYER_O if won, else EMPTY
char check_winner(char* board) {
    int win_patterns[8][3] = {
        {0,1,2}, {3,4,5}, {6,7,8}, // rows
        {0,3,6}, {1,4,7}, {2,5,8}, // columns
        {0,4,8}, {2,4,6}           // diagonals
    };
    for (int i = 0; i < 8; i++) {
        int a = win_patterns[i][0];
        int b = win_patterns[i][1];
        int c = win_patterns[i][2];
        if (board[a] != EMPTY 
            && board[a] == board[b] 
            && board[b] == board[c]) {
            return board[a];
        }
    }
    return EMPTY;
}

// Check if the board is full (tie)
bool is_board_full(char* board) {
    for (int i = 0; i < BOARD_SIZE; i++) {
        if (board[i] == EMPTY) {
            return false;
        }
    }
    return true;
}
