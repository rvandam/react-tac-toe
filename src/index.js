import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className = 'square ' + props.winner;
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>  
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            winner={this.props.winners[i] ? 'winner' : ''}
            onClick={() => this.props.onClick(i)}
        />
    );
  }

  render() {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const cols = [];
      for (let col = 0; col < 3; col++) {
        cols.push(this.renderSquare(row * 3 + col));
      }
      rows[row] = <div className="board-row">{cols}</div>
    }
    return rows;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });  
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winners] = calculateWinner(current.squares);
    console.log(winners);
    const draw = calculateDraw(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const className = move === this.state.stepNumber ? 'current' : 'other';
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>

      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (draw) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winners={winners}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winners = {};
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winners[a] = winners[b] = winners[c] = true;
      return [squares[a], winners];
    }
  }
  return [null, winners];
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (! squares[i]) {
      return false;
    }
  }
  return true;
}
