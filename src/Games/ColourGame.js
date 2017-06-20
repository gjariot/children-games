import React from 'react';
import EndGameMessage from './EndGameMessage';
import colourAssociations from '../res/colourAssociations.json';
import Random from 'random-js';

class ColourGame extends React.Component {
    constructor() {
        super();

        this.colourAssociations = colourAssociations;
        this.coloursToFind = new Random().shuffle(Object.keys(colourAssociations));
        this.currentColourAssociationIndex = 0;
        
        const colourToFind = this.coloursToFind[this.currentColourAssociationIndex];

        this.state = {
            coloursMix: this.colourAssociations[colourToFind],
            answer: colourToFind,
            possibleAnswers: this.getRandomColours(colourToFind),
            resultClass: 'hidden',
            resultMessage: '',
            questionsEnded: false
        };

        this.checkAnswer = this.checkAnswer.bind(this);
        this.moveToNextQuestion = this.moveToNextQuestion.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.giveUp = this.giveUp.bind(this);
    }
    
    getRandomColours(answerColour) {
        const random = Random();
        let availableColours = this.coloursToFind.slice(0);
        availableColours.splice(availableColours.indexOf(answerColour), 1);
        
        availableColours = random.shuffle(availableColours).slice(0, 2);
        availableColours.push(answerColour);

        return random.shuffle(availableColours);
    }
    
    giveUp(event) {
        event.preventDefault();
        
        this.setState({
            resultClass: 'answer-result error',
            resultMessage: 'La bonne réponse était "' + this.state.answer + '"'
        });
        
        setTimeout(this.moveToNextQuestion, 1500);
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (event.target.value === this.state.answer) {
            this.setState({
                resultClass: 'answer-result success',
                resultMessage: 'Bravo !'
            });

            setTimeout(this.moveToNextQuestion, 1250);
        } else {
            this.setState({
                resultClass: 'answer-result error',
                resultMessage: "Oh non, ce n'est pas la bonne réponse!"
            });
        }
    }

    moveToNextQuestion() {
        this.currentColourAssociationIndex += 1;
        
        if (this.coloursToFind.length <= this.currentColourAssociationIndex) {
            this.setState({questionsEnded: true});
            return;
        }
        
        this.moveToQuestion(this.currentColourAssociationIndex);
    }
    
    moveToQuestion(index) {
        const colourToFind = this.coloursToFind[index];
        
        this.setState({
            coloursMix: this.colourAssociations[colourToFind],
            answer: colourToFind,
            possibleAnswers: this.getRandomColours(colourToFind),
            resultClass: 'answer-result hidden',
            resultMessage: '',
            questionsEnded: false
        });
    }
    
    handleRestart() {
        this.colourAssociations = new Random().shuffle(this.colourAssociations);
        this.currentColourAssociationIndex = 0;
        
        this.moveToQuestion(this.currentColourAssociationIndex);
    }

    render() {
        return (
            <div className="questionGame">
                {this.state.questionsEnded === true && <EndGameMessage handleRestart={this.handleRestart} />}
                {this.state.questionsEnded === false &&
                    <QuestionPrompt
                        coloursMix={this.state.coloursMix}
                        answer={this.state.answer}
                        proposedAnswers={this.state.possibleAnswers}
                        checkAnswer={this.checkAnswer}
                        resultClass={this.state.resultClass}
                        resultMessage={this.state.resultMessage}
                        giveUp={this.giveUp}
                    />
                }
            </div>
        );
    }
}

function QuestionPrompt(props) {
    return (
        <section>
            <form className="question colour">
                Qu'obtient-on en mélangeant 
                {props.coloursMix.map(function(colour, index) {
                    const colourStyle = {color: colour, backgroundColor: colour};
                    return <span key={index} className="colourSource" style={colourStyle} />;
                }).reduce((prev, curr) => [prev, ' + ', curr])}
                ?
                <div className="possible-colours">
                    {props.proposedAnswers.map(function(colour, index) {
                        const colourStyle = {color: colour, backgroundColor: colour};
                        return <input key={index} type="submit" className="colourPossibleAnswer" onClick={props.checkAnswer} style={colourStyle} value={colour} />;
                    }).reduce((prev, curr) => [prev, ' ou ', curr])}
                </div>
                <button type="submit" className="give-up" onClick={props.giveUp}>Donner sa langue au chat</button>
            </form>
            <p className={props.resultClass}>{props.resultMessage}</p>
        </section>
    );
}

export default ColourGame;