import React from 'react';
import EndGameMessage from '../Messages/EndGameMessage';
import colourAssociations from '../res/colourAssociations.json';
import Random from 'random-js';
import {SuccessMessage, ErrorMessage, ShowErrorMessage} from '../Messages/AnswerMessages';

export default class ColourGame extends React.Component {
    constructor(props) {
        super(props);

        this.colourAssociations = colourAssociations;
        this.coloursToFind = new Random().shuffle(Object.keys(colourAssociations));
        this.currentColourAssociationIndex = 0;
        
        const colourToFind = this.coloursToFind[this.currentColourAssociationIndex];

        this.state = {
            coloursMix: this.colourAssociations[colourToFind],
            answer: colourToFind,
            possibleAnswers: this.getRandomColours(colourToFind),
            resultMessage: null,
            questionsEnded: false
        };

        this.userAnswerCallback = props.userAnswerCallback;
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
        
        const colourStyle = {backgroundColor: this.state.answer};
        this.setState({
            resultMessage: (
                <p className="colour-wrong-answer">
                    La bonne réponse était
                    <span className="colour-source" style={colourStyle}>{this.state.answer}</span>
                </p>
            )
        });
        
        setTimeout(this.moveToNextQuestion, 1500);
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (event.target.value === this.state.answer) {
            this.setState({resultMessage: true});
            this.userAnswerCallback(true);

            setTimeout(this.moveToNextQuestion, 1250);
        } else {
            this.setState({resultMessage: false});
            this.userAnswerCallback(false);
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
            resultMessage: null,
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
                    const colourStyle = {backgroundColor: colour};
                    return <span key={index} className="colour-source" style={colourStyle}>{colour}</span>;
                }).reduce((prev, curr) => [prev, ' + ', curr])}
                ?
                <div className="possible-colours">
                    {props.proposedAnswers.map(function(colour, index) {
                        const colourStyle = {backgroundColor: colour};
                        return <input key={index} type="submit" className="colour-possible-answer" onClick={props.checkAnswer} style={colourStyle} value={colour} />;
                    }).reduce((prev, curr) => [prev, ' ou ', curr])}
                </div>
                <button type="submit" className="give-up" onClick={props.giveUp}>Donner sa langue au chat</button>
            </form>
            {props.resultMessage === true ? <SuccessMessage /> : (props.resultMessage === false ? <ErrorMessage /> : <ShowErrorMessage message={props.resultMessage} />)}
        </section>
    );
}