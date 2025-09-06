// tic-tac-toe-game.js

console.log("WASM Module initialized");
document.addEventListener("DOMContentLoaded", () => {
    // Wait until the WASM module has loaded and runtime initialized
    Module.onRuntimeInitialized = () => {

        const cells = [...document.querySelectorAll(".ttt-cell")];
        const msgEl = document.getElementById("game-message");

        let currentPlayer = 'X'; // PLAYER_X
        const BOARD_SIZE = 9;

        // Allocate WASM memory for board (9 bytes)
        const boardPtr = Module._malloc(BOARD_SIZE);
        Module._init_board(boardPtr);

        updateMessage();

        cells.forEach((cell, idx) => {
            cell.addEventListener("click", () => {
                makeMove(idx);
            });
        });

        function makeMove(cellIndex) {
            // Check if cell is already occupied
            if (Module.ccall("is_valid_move", "number", ["number", "number"], [boardPtr, cellIndex]) === 0) {
                alert("Cell already occupied. Please select an empty cell.");
                return;
            }

            // Make the move
            const success = Module.ccall(
                "make_move",
                "number",
                ["number", "number", "number"],
                [boardPtr, cellIndex, currentPlayer.charCodeAt(0)]
            );

            if (success === 0) {
                alert("Invalid move, try again.");
                return;
            }

            // Update UI
            updateCellUI(cellIndex, currentPlayer);

            // Check for winner
            const winnerCharCode = Module.ccall(
                "check_winner",
                "number",
                ["number"],
                [boardPtr]
            );

            const winner = String.fromCharCode(winnerCharCode);

            if (winner === 'X' || winner === 'O') {
                endGame(`Player ${winner} wins!`);
                return;
            }

            // Check for tie
            const full = Module.ccall(
                "is_board_full",
                "number",
                ["number"],
                [boardPtr]
            );

            if (full !== 0) {
                endGame("It's a tie!");
                return;
            }

            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateMessage();
        }

        function updateCellUI(idx, player) {
            const cell = cells[idx];
            cell.textContent = player;
            cell.classList.add(player === 'X' ? "x" : "o");
            cell.disabled = true; // Disable button after move
        }

        function clearSelection() {
            selectedCellIndex = null;
            cells.forEach(c => c.classList.remove("selected"));
        }

        function updateMessage() {
            msgEl.textContent = `Player ${currentPlayer}, make your move.`;
            // btnLockP1.disabled = currentPlayer !== 'X';
            // btnLockP2.disabled = currentPlayer !== 'O';
        }

        function endGame(message) {
            // Redirect to result.html with the message encoded in URL
            const encodedMsg = encodeURIComponent(message);
            window.location.href = `result.html?message=${encodedMsg}`;
        }


        // Clean up WASM memory on page unload
        window.addEventListener("unload", () => {
            Module._free(boardPtr);
        });

    }; // end onRuntimeInitialized
});
