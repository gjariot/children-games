import React from 'react';
import QuestionGame from './Games/QuestionGame';
import CalculationGame from './Games/CalculationGame';
import ColourGame from './Games/ColourGame';
import ConjugationGame from './Games/ConjugationGame';

class Game extends React.Component {
    constructor() {
        super();
        
        this.state = {
            gamesClassNames: this.getGamesClassNames('0'),
            successfullAnswersCount: 0
        };
        
        this.toggleGame = this.toggleGame.bind(this);
        this.triggerUserAnswer = this.triggerUserAnswer.bind(this);
    }
    
    getGames() {
        return [
            {"label": "Questions", "component": () => <QuestionGame userAnswerCallback={this.triggerUserAnswer} />},
            {"label": "Calculs", "component": () => <CalculationGame userAnswerCallback={this.triggerUserAnswer} />},
            {"label": "Couleurs", "component": () => <ColourGame userAnswerCallback={this.triggerUserAnswer} />},
            {"label": "Conjugaison", "component": () => <ConjugationGame userAnswerCallback={this.triggerUserAnswer} />}
        ];
    }
    
    getGamesClassNames(selectedGame) {
        return Object.keys(this.getGames()).map(function(gameId) {
            return (selectedGame === gameId ? '' : 'game-hidden');
        });
    }
    
    toggleGame(event) {
        event.preventDefault();
        
        this.setState({gamesClassNames: this.getGamesClassNames(event.target.getAttribute('data-game'))});
    }
    
    triggerUserAnswer(isSuccessfull) {
        const newSuccessfullAnswersCount = (isSuccessfull === true ? this.state.successfullAnswersCount + 1 : 0);
        this.setState({successfullAnswersCount: newSuccessfullAnswersCount});
    }
    
    render() {
        const games = this.getGames();
        return (    
            <div className="game">
                <ul className="main-menu">
                    {games.map(function(game, gameId) {
                    return <li key={gameId}><a href="questions" data-game={gameId} onClick={this.toggleGame}>{game.label}</a></li>;
                    }, this)}
                </ul>
                {games.map(function(game, gameId) {
                    return (
                <div key={gameId} className={this.state.gamesClassNames[gameId]}>
                    {game.component()}
                </div>
                    );
                }, this)}
                <div className={'answers-count' + (this.state.successfullAnswersCount < 2 ? ' hidden' : '')}>
                    {this.state.successfullAnswersCount} bonnes réponses consécutives!
                </div>
            </div>
        );
    }
}

export default Game;