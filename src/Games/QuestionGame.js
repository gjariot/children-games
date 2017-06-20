import React from 'react';
import EndGameMessage from '../Messages/EndGameMessage';
import questions from '../res/questions.json';
import Random from 'random-js';

class QuestionGame extends React.Component {
    constructor() {
        super();

        this.questions = new Random().shuffle(questions);
        this.currentQuestionIndex = 0;

        this.state = {
            question: this.questions[this.currentQuestionIndex][0],
            answer: this.questions[this.currentQuestionIndex][1],
            userAnswer: '',
            resultClass: 'hidden',
            resultMessage: '',
            questionsEnded: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.moveToNextQuestion = this.moveToNextQuestion.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.giveUp = this.giveUp.bind(this);
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
        
        if (this.state.userAnswer.toLowerCase().includes(this.state.answer.toLowerCase())) {
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
        this.currentQuestionIndex += 1;
        
        if (this.questions.length <= this.currentQuestionIndex) {
            this.setState({questionsEnded: true});
            return;
        }
        
        this.moveToQuestion(this.currentQuestionIndex);
    }
    
    moveToQuestion(index) {
        this.setState({
            question: this.questions[this.currentQuestionIndex][0],
            answer: this.questions[this.currentQuestionIndex][1],
            resultClass: 'answer-result hidden',
            resultMessage: '',
            userAnswer: '',
            questionsEnded: false
        });
    }
    
    handleRestart() {
        this.questions = new Random().shuffle(this.questions);
        this.currentQuestionIndex = 0;
        
        this.moveToQuestion(this.currentQuestionIndex);
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }

    render() {
        return (
            <div className="questionGame">
                {this.state.questionsEnded === true && <EndGameMessage handleRestart={this.handleRestart} />}
                {this.state.questionsEnded === false &&
                    <QuestionPrompt
                        question={this.state.question}
                        answer={this.state.answer}
                        userAnswer={this.state.userAnswer}
                        checkAnswer={this.checkAnswer}
                        handleChange={this.handleChange} 
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
            <form className="question" onSubmit={props.checkAnswer}>
                {props.question}
                <input type="text" className="answer" size="15" value={props.userAnswer} onChange={props.handleChange} />
                <button type="submit">Vérifier</button>
                <button type="submit" className="give-up" onClick={props.giveUp}>Donner sa langue au chat</button>
            </form>
            <p className={props.resultClass}>{props.resultMessage}</p>
        </section>
    );
}

export default QuestionGame;