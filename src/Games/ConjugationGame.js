import React from 'react';
import rules from '../res/conjugation.json';
import Random from 'random-js';
import {SuccessMessage, ErrorMessage, ShowErrorMessage} from '../Messages/AnswerMessages';

export default class ConjugationGame extends React.Component {
    constructor(props) {
        super(props);

        this.rules = rules;
        
        const question = this.getRandomQuestion();

        this.state = {
            subject: question.subject,
            verb: question.verb,
            complement: question.complement,
            answer: question.answer,
            possibleAnswers: question.possibleAnswers,
            resultMessage: null
        };

        this.userAnswerCallback = props.userAnswerCallback;
        this.checkAnswer = this.checkAnswer.bind(this);
        this.moveToNextQuestion = this.moveToNextQuestion.bind(this);
        this.giveUp = this.giveUp.bind(this);
    }
    
    getRandomQuestion() {
        const random = new Random();
        const group = random.shuffle(Object.keys(this.rules.groups))[0];
        const verb = random.shuffle(this.rules.groups[group].verbs)[0];
        const subjectType = random.shuffle(Object.keys(this.rules.subjects))[0];
        const subjects = (verb.subjects && verb.subjects[subjectType]) || this.rules.subjects[subjectType];
        const subject = random.shuffle(subjects.slice(0))[0];
        const answer = this.getConjugationBySubject(verb, this.rules.groups[group], subjectType);
        const complement = random.shuffle(verb.complements)[0];
        
        let possibleAnswers = [
            this.getConjugationBySubject(verb, this.rules.groups[group], '1s'),
            this.getConjugationBySubject(verb, this.rules.groups[group], '2s'),
            this.getConjugationBySubject(verb, this.rules.groups[group], '3s'),
            this.getConjugationBySubject(verb, this.rules.groups[group], '1p'),
            this.getConjugationBySubject(verb, this.rules.groups[group], '2p'),
            this.getConjugationBySubject(verb, this.rules.groups[group], '3p'),
            
        ];
        
        possibleAnswers = random.shuffle(possibleAnswers.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        }));
        
        return {
            "subject": subject,
            "verb": verb.name,
            "complement": complement,
            "answer" : answer,
            "possibleAnswers": possibleAnswers
        };
    }
    
    getConjugationBySubject(verb, group, subject) {
        return (verb.ending && verb.ending[subject]) || verb.root + group.ending[subject]
    }
    
    giveUp(event) {
        event.preventDefault();
        
        this.setState({resultMessage: 'La bonne réponse était "' + this.state.answer + '"'});
        
        setTimeout(this.moveToNextQuestion, 1500);
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (event.target.answer.value === this.state.answer) {
            this.setState({resultMessage: true});
            this.userAnswerCallback(true);

            setTimeout(this.moveToNextQuestion, 1250);
        } else {
            this.setState({resultMessage: false});
            this.userAnswerCallback(false);
        }
    }

    moveToNextQuestion() {
        const question = this.getRandomQuestion();

        this.setState({
            subject: question.subject,
            verb: question.verb,
            complement: question.complement,
            answer: question.answer,
            possibleAnswers: question.possibleAnswers,
            resultMessage: null,
        });
    }

    render() {
        return (
            <QuestionPrompt
                subject={this.state.subject}
                verb={this.state.verb}
                possibleAnswers={this.state.possibleAnswers}
                complement={this.state.complement}
                answer={this.state.answer}
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
                <p>
                    {props.subject}
                    {/* <input type="text" placeholder={props.verb} className="answer" size="5" value={props.userAnswer} onChange={props.handleChange} /> */}
                    <ul className="possible-answers-list">
                    {props.possibleAnswers.map(function(answer, index) {
                        return (
                        <li key={index} className="possible-answer-item">
                            <input type="radio" name="answer" value={answer} />
                            {answer}
                        </li>
                        );
                    })}
                    </ul>
                    {props.complement}
                </p>
                <button type="submit">Vérifier</button>
                <button type="submit" className="give-up" onClick={props.giveUp}>Donner sa langue au chat</button>
            </form>
            {props.resultMessage === true ? <SuccessMessage /> : (props.resultMessage === false ? <ErrorMessage /> : <ShowErrorMessage message={props.resultMessage} />)}
        </section>
    );
}