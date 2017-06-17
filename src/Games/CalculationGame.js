import React from 'react';
import Random from 'random-js';

class CalculationGame extends React.Component {
    constructor(props) {
        super(props);
        
        const defaultCalculation = this.getCalculation();

        this.state = {
            calculation: defaultCalculation,
            result: defaultCalculation.reduce(function(total, currentValue){
                return total + currentValue;
            }),
            userAnswer: '',
            resultClass: 'hidden',
            resultMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
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
            this.setState({
                resultClass: 'answer-result success',
                resultMessage: 'Bravo !'
            });

            setTimeout(this.moveToNextCalculation, 1250);
        } else {
            this.setState({
                resultClass: 'answer-result error',
                resultMessage: "Oh non, ce n'est pas la bonne réponse!"
            });
        }
    }

    moveToNextCalculation() {
        const newCalculation = this.getCalculation();
        
        this.setState({
            calculation: newCalculation,
            result: newCalculation.reduce(function(total, currentValue){
                return total + currentValue;
            }),
            userAnswer: '',
            resultClass: 'hidden',
            resultMessage: ''
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
                resultClass={this.state.resultClass}
                resultMessage={this.state.resultMessage}
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
                    return <span className="calculation-line">{value}</span>;
                })}
                </div>
                <input type="text" placeholder="=" className="answer" size="1" value={props.userAnswer} onChange={props.handleChange} />
                <button type="submit">Vérifier</button>
            </form>
            <p className={props.resultClass}>{props.resultMessage}</p>
        </section>
    );
}

export default CalculationGame;