import React from 'react';
import Random from 'random-js';
import {SuccessMessage, ErrorMessage, ShowErrorMessage} from '../Messages/AnswerMessages';

export default class CalculationGame extends React.Component {
    constructor(props) {
        super(props);
        
        const defaultCalculation = this.getCalculation();

        this.state = {
            calculation: defaultCalculation,
            result: defaultCalculation.reduce(function(total, currentValue){
                return total + currentValue;
            }),
            userAnswer: '',
            resultMessage: null
        };

        this.userAnswerCallback = props.userAnswerCallback;
        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.giveUp = this.giveUp.bind(this);
        this.moveToNextCalculation = this.moveToNextCalculation.bind(this);
    }
    
    getCalculationResult(members) {
        if (members.length === 0) {
            return 0;
        }
    
        return members.reduce(function(total, currentValue){
            return total + currentValue;
        });
    }
    
    getCalculation() {
        const random = new Random();
        let members = [];
        
        while((this.getCalculationResult(members) < 50 || members.length < 2) && members.length < 3) {
            members.push(random.integer(1, 20));
        }
        
        return members;
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (parseInt(this.state.userAnswer, 10) === this.state.result) {
            this.setState({resultMessage: true});
            this.userAnswerCallback(true);

            setTimeout(this.moveToNextCalculation, 1250);
        } else {
            this.setState({resultMessage: false});
            this.userAnswerCallback(false);
        }
    }
    
    giveUp(event) {
        event.preventDefault();
        
        this.setState({resultMessage: 'La bonne réponse était ' + this.state.result});
        
        setTimeout(this.moveToNextCalculation, 1500);
    }

    moveToNextCalculation() {
        const newCalculation = this.getCalculation();
        
        this.setState({
            calculation: newCalculation,
            result: newCalculation.reduce(function(total, currentValue){
                return total + currentValue;
            }),
            userAnswer: '',
            resultMessage: null
        });
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }

    render() {
        return (
            <CalculationPrompt
                members={this.state.calculation}
                result={this.state.result}
                userAnswer={this.state.userAnswer}
                checkAnswer={this.checkAnswer}
                handleChange={this.handleChange} 
                resultMessage={this.state.resultMessage}
                giveUp={this.giveUp}
            />
        );
    }
}

function CalculationPrompt(props) {
    return (
        <section>
            <form className="calculation" onSubmit={props.checkAnswer}>
                <div className="calculation-definition">
                {props.members.map(function(member, index) {
                    let value = (index !== 0 ? " + " + member : member);
                    return <span key={index} className="calculation-line">{value}</span>;
                })}
                </div>
                <input type="text" placeholder="=" className="answer" size="1" value={props.userAnswer} onChange={props.handleChange} />
                <button type="submit">Vérifier</button>
                <button type="submit" onClick={props.giveUp} className="give-up">Donner sa langue au chat</button>
            </form>
            {props.resultMessage === true ? <SuccessMessage /> : (props.resultMessage === false ? <ErrorMessage /> : <ShowErrorMessage message={props.resultMessage} />)}
        </section>
    );
}
