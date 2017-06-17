import React from 'react';
import ReactDOM from 'react-dom';
import EndGameMessage from './Games/EndGameMessage';
import QuestionGame from './Games/QuestionGame';
import CalculationGame from './Games/CalculationGame';
import './index.css';
import Random from 'random-js';

class Game extends React.Component {
    constructor() {
        super();
        
        this.GAME_QUESTIONS = 1;
        this.GAME_CALCULATION = 2;
        
        this.state = {questionClassName: '', calculationClassName: 'game-hidden'};
        
        this.toggleGame = this.toggleGame.bind(this);
    }
    
    toggleGame(event) {
        event.preventDefault();
        
        this.setState({
            questionClassName: (event.target.getAttribute('data-game') == this.GAME_QUESTIONS ? '' : 'game-hidden'),
            calculationClassName: (event.target.getAttribute('data-game') == this.GAME_CALCULATION ? '' : 'game-hidden')
        });
    }
    
    render() {
        return (    
            <div className="game">
                <ul className="main-menu">
                    <li><a href="questions" data-game={this.GAME_QUESTIONS} onClick={this.toggleGame}>Questions</a></li>
                    <li><a href="calculs" data-game={this.GAME_CALCULATION} onClick={this.toggleGame}>Calculs</a></li>
                </ul>
                <div className={this.state.questionClassName}>
                    <QuestionGame />
                </div>
                <div className={this.state.calculationClassName}>
                    <CalculationGame />
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
