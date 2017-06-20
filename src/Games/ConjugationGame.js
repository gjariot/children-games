import React from 'react';
import rules from '../res/conjugation.json';
import Random from 'random-js';
import {SuccessMessage, ErrorMessage, ShowErrorMessage} from '../Messages/AnswerMessages';

export default class ConjugationGame extends React.Component {
    constructor() {
        super();

        this.rules = rules;
        
        const question = this.getRandomQuestion();

        this.state = {
            subject: question.subject,
            verb: question.verb,
            complement: question.complement,
            answer: question.answer,
            userAnswer: '',
            resultMessage: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.moveToNextQuestion = this.moveToNextQuestion.bind(this);
        this.giveUp = this.giveUp.bind(this);
    }
    
    getRandomQuestion() {
        var random = new Random();
        const group = random.shuffle(Object.keys(this.rules.groups))[0];
        const verb = random.shuffle(this.rules.groups[group].verbs)[0];
        const subjectType = random.shuffle(Object.keys(this.rules.subjects))[0];
        const subjects = (verb.subjects && verb.subjects[subjectType]) || this.rules.subjects[subjectType];
        const subject = random.shuffle(subjects.slice(0))[0];
        const answer = (verb.ending && verb.ending[subjectType]) || verb.root + this.rules.groups[group].ending[subjectType];
        const complement = random.shuffle(verb.complements)[0];
        
        return {
            "subject": subject,
            "verb": verb.name,
            "complement": complement,
            "answer" : answer
        };
    }
    
    giveUp(event) {
        event.preventDefault();
        
        this.setState({resultMessage: 'La bonne réponse était "' + this.state.answer + '"'});
        
        setTimeout(this.moveToNextQuestion, 1500);
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (this.state.userAnswer.toLowerCase() === this.state.answer.toLowerCase()) {
            this.setState({resultMessage: true});

            setTimeout(this.moveToNextQuestion, 1250);
        } else {
            this.setState({resultMessage: false});
        }
    }

    moveToNextQuestion() {
        const question = this.getRandomQuestion();

        this.setState({
            subject: question.subject,
            verb: question.verb,
            complement: question.complement,
            answer: question.answer,
            resultMessage: null,
            userAnswer: ''
        });
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }

    render() {
        return (
            <QuestionPrompt
                subject={this.state.subject}
                verb={this.state.verb}
                complement={this.state.complement}
                answer={this.state.answer}
                userAnswer={this.state.userAnswer}
                checkAnswer={this.checkAnswer}
                handleChange={this.handleChange} 
                resultMessage={this.state.resultMessage}
                giveUp={this.giveUp}
            />
        );
    }
}

function QuestionPrompt(props) {
    return (
        <section>
            <form className="question" onSubmit={props.checkAnswer}>
                {props.subject}
                <input type="text" placeholder={props.verb} className="answer" size="5" value={props.userAnswer} onChange={props.handleChange} />
                {props.complement}
                <button type="submit">Vérifier</button>
                <button type="submit" className="give-up" onClick={props.giveUp}>Donner sa langue au chat</button>
            </form>
            {props.resultMessage === true ? <SuccessMessage /> : (props.resultMessage === false ? <ErrorMessage /> : <ShowErrorMessage message={props.resultMessage} />)}
        </section>
    );
}