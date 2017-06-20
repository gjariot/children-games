import React from 'react';
import rules from '../res/conjugation.json';
import Random from 'random-js';

class ConjugationGame extends React.Component {
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
            resultClass: 'hidden',
            resultMessage: ''
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
        
        this.setState({
            resultClass: 'answer-result error',
            resultMessage: 'La bonne réponse était "' + this.state.answer + '"'
        });
        
        setTimeout(this.moveToNextQuestion, 1500);
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (this.state.userAnswer.toLowerCase() === this.state.answer.toLowerCase()) {
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
        const question = this.getRandomQuestion();

        this.setState({
            subject: question.subject,
            verb: question.verb,
            complement: question.complement,
            answer: question.answer,
            resultClass: 'answer-result hidden',
            resultMessage: '',
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
                resultClass={this.state.resultClass}
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
            <p className={props.resultClass}>{props.resultMessage}</p>
        </section>
    );
}

export default ConjugationGame;