import React from 'react';
import ReactDOM from 'react-dom';
import QuestionGame from './Games/QuestionGame';
import CalculationGame from './Games/CalculationGame';
import ColourGame from './Games/ColourGame';
import ConjugationGame from './Games/ConjugationGame';
import './index.css';

class Game extends React.Component {
    constructor() {
        super();
        
        this.GAME_QUESTIONS = '1';
        this.GAME_CALCULATION = '2';
        this.GAME_COLOUR = '3';
        this.GAME_CONJUGATION = '4';
        
        this.state = {
            questionClassName: '',
            calculationClassName: 'game-hidden',
            colourClassName: 'game-hidden',
            conjugationClassName: 'game-hidden'
        };
        
        this.toggleGame = this.toggleGame.bind(this);
    }
    
    toggleGame(event) {
        event.preventDefault();
        
        this.setState({
            questionClassName: (event.target.getAttribute('data-game') === this.GAME_QUESTIONS ? '' : 'game-hidden'),
            calculationClassName: (event.target.getAttribute('data-game') === this.GAME_CALCULATION ? '' : 'game-hidden'),
            colourClassName: (event.target.getAttribute('data-game') === this.GAME_COLOUR ? '' : 'game-hidden'),
            conjugationClassName: (event.target.getAttribute('data-game') === this.GAME_CONJUGATION ? '' : 'game-hidden')
        });
    }
    
    render() {
        return (    
            <div className="game">
                <ul className="main-menu">
                    <li><a href="questions" data-game={this.GAME_QUESTIONS} onClick={this.toggleGame}>Questions</a></li>
                    <li><a href="calculs" data-game={this.GAME_CALCULATION} onClick={this.toggleGame}>Calculs</a></li>
                    <li><a href="calculs" data-game={this.GAME_COLOUR} onClick={this.toggleGame}>Couleurs</a></li>
                    <li><a href="calculs" data-game={this.GAME_CONJUGATION} onClick={this.toggleGame}>Conjugaison</a></li>
                </ul>
                <div className={this.state.questionClassName}>
                    <QuestionGame />
                </div>
                <div className={this.state.calculationClassName}>
                    <CalculationGame />
                </div>
                <div className={this.state.colourClassName}>
                    <ColourGame />
                </div>
                <div className={this.state.conjugationClassName}>
                    <ConjugationGame />
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
