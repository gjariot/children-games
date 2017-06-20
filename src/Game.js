import React from 'react';
import QuestionGame from './Games/QuestionGame';
import CalculationGame from './Games/CalculationGame';
import ColourGame from './Games/ColourGame';
import ConjugationGame from './Games/ConjugationGame';

class Game extends React.Component {
    constructor() {
        super();
        
        this.state = {gamesClassNames: this.getGamesClassNames('0')};
        
        this.toggleGame = this.toggleGame.bind(this);
    }
    
    getGames() {
        return [
            {"label": "Questions", "component": () => <QuestionGame />},
            {"label": "Calculs", "component": () => <CalculationGame />},
            {"label": "Couleurs", "component": () => <ColourGame />},
            {"label": "Conjugaison", "component": () => <ConjugationGame />}
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
            </div>
        );
    }
}

export default Game;