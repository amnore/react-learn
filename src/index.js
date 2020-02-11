import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button
            style={{ color: props.highLight ? "red" : "black" }}
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, highLight) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.handleClick(i)}
                highLight={highLight}
            />
        );
    }

    render() {
        return (
            <div>
                {[0, 1, 2].map(row => (
                    <div class="broad-row">
                        {[0, 1, 2].map(column =>
                            this.renderSquare(
                                row * 3 + column,
                                this.props.WinnerLine &&
                                    this.props.WinnerLine.findIndex(
                                        i => i === row * 3 + column
                                    ) !== -1
                                    ? true
                                    : false
                            )
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            stepNumber: 0,
            xIsNext: true,
            historyIncremental: true
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] !== null) return;
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{ squares: squares }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }
    historySortButtonHandleCLick() {
        this.setState({ historyIncremental: !this.state.historyIncremental });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move
                ? "Go to move #" +
                  move +
                  ", point: (" +
                  calculateDelta(
                      history[move - 1].squares,
                      history[move].squares
                  ) +
                  ")"
                : "Go to game start";
            return (
                <li key={move}>
                    <button
                        style={{
                            fontWeight:
                                move === this.state.stepNumber
                                    ? "bold"
                                    : "unset"
                        }}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        let status = winner
            ? "Winner: " + winner
            : squareIsFull(
                  this.state.history[this.state.history.length - 1].squares
              )
            ? "Tie"
            : "Next player: " + (this.state.xIsNext ? "X" : "O");
        return (
            <div className="game">
                <div className="game-broad">
                    <Board
                        squares={current.squares}
                        handleClick={i => this.handleClick(i)}
                        WinnerLine={calculateWinnerLine(
                            this.state.history[this.state.history.length - 1]
                                .squares
                        )}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.historySortButtonHandleCLick()}>
                        {"History Display: " +
                            (this.state.historyIncremental
                                ? "Incremental"
                                : "Decremental")}
                    </button>
                    <ol>
                        {this.state.historyIncremental
                            ? moves
                            : moves.reverse()}
                    </ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; ++i) {
        let [a, b, c] = lines[i];
        if (
            squares[a] !== null &&
            squares[a] === squares[b] &&
            squares[b] === squares[c]
        )
            return squares[a];
    }
    return null;
}
function calculateWinnerLine(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; ++i) {
        let [a, b, c] = lines[i];
        if (
            squares[a] !== null &&
            squares[a] === squares[b] &&
            squares[b] === squares[c]
        )
            return lines[i];
    }
    return null;
}

function calculateDelta(oldSquare, newSquare) {
    for (let i = 0; i < oldSquare.length; ++i)
        if (oldSquare[i] !== newSquare[i])
            return [(i % 3) + 1, Math.floor(i / 3) + 1];
    return null;
}

function squareIsFull(square) {
    for (let i = 0; i < square.length; ++i)
        if (square[i] === null) return false;
    return true;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
