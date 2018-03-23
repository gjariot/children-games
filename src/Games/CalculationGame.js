import React from 'react';
import Random from 'random-js';
import {SuccessMessage, ErrorMessage, ShowErrorMessage} from '../Messages/AnswerMessages';
import AdditionGameConfiguration from './AdditionGameConfiguration';
import MultiplicationGameConfiguration from './MultiplicationGameConfiguration';
import SubstractionGameConfiguration from './SubstractionGameConfiguration';

export default class CalculationGame extends React.Component {   
    constructor(props) {
        super(props);
        
        const defaultAllowedOperationTypes = new Set([
            AdditionGameConfiguration.getOperationType(),
            SubstractionGameConfiguration.getOperationType(),
            MultiplicationGameConfiguration.getOperationType()
        ]);
        const defaultCalculation = this.getCalculation(defaultAllowedOperationTypes);

        this.state = {
            calculation: defaultCalculation,
            userAnswer: '',
            resultMessage: null,
            allowedOperationTypes: defaultAllowedOperationTypes
        };

        this.userAnswerCallback = props.userAnswerCallback;
        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.giveUp = this.giveUp.bind(this);
        this.moveToNextCalculation = this.moveToNextCalculation.bind(this);
        this.handleOperationTypeChange = this.handleOperationTypeChange.bind(this);
    }
    
    getCalculation(allowedOperationTypes) {
        const random = new Random();
        const operationType = random.pick([...allowedOperationTypes]);
        let game;

        switch (operationType) {
            case MultiplicationGameConfiguration.getOperationType():
                game = new MultiplicationGameConfiguration();
                break;
                
            case SubstractionGameConfiguration.getOperationType():
                game = new SubstractionGameConfiguration();
                break;
            
            case AdditionGameConfiguration.getOperationType():
            default:
                game = new AdditionGameConfiguration();
                break;
        }
        
        game.generate();
        return game;
    }

    checkAnswer(event) {
        event.preventDefault();
        
        if (parseInt(this.state.userAnswer, 10) === this.state.calculation.getResult()) {
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
        
        this.setState({resultMessage: 'La bonne réponse était ' + this.state.calculation.getResult()});
        this.userAnswerCallback(false);
        
        setTimeout(this.moveToNextCalculation, 1500);
    }

    moveToNextCalculation() {
        const newCalculation = this.getCalculation(this.state.allowedOperationTypes);
        
        this.setState({
            calculation: newCalculation,
            userAnswer: '',
            resultMessage: null
        });
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }
    
    handleOperationTypeChange(event) {
        let allowedOperationTypes = this.state.allowedOperationTypes;
        const operationType = parseInt(event.target.value);
        
        if (allowedOperationTypes.has(operationType) === false) {
            allowedOperationTypes.add(operationType);
        } else {
            allowedOperationTypes.delete(operationType);
        }
        console.log(allowedOperationTypes);
        this.setState({allowedOperationTypes: allowedOperationTypes});
    }

    render() {
        return (
            <CalculationPrompt
                calculation={this.state.calculation}
                userAnswer={this.state.userAnswer}
                checkAnswer={this.checkAnswer}
                handleChange={this.handleChange} 
                resultMessage={this.state.resultMessage}
                handleOperationTypeChange={this.handleOperationTypeChange}
                giveUp={this.giveUp}
                allowedOperationTypes={this.state.allowedOperationTypes}
            />
        );
    }
}

function CalculationPrompt(props) {
    return (
        <section>
            <form className="calculation" onSubmit={props.checkAnswer}>
                <ul className="operation-types">
                    <li><label htmlFor="operation-type-additions">Additions</label> <input id="operation-type-additions" type="checkbox" className="operation-type-selector" name="operationType" value={AdditionGameConfiguration.getOperationType()} checked={props.allowedOperationTypes.has(AdditionGameConfiguration.getOperationType())} onChange={props.handleOperationTypeChange}/></li>
                    <li><label htmlFor="operation-type-substractions">Soustractions</label> <input id="operation-type-substractions" type="checkbox" className="operation-type-selector" name="operationType" value={SubstractionGameConfiguration.getOperationType()} checked={props.allowedOperationTypes.has(SubstractionGameConfiguration.getOperationType())} onChange={props.handleOperationTypeChange}/></li>
                    <li><label htmlFor="operation-type-multiplications">Multiplications</label> <input id="operation-type-multiplications" type="checkbox" className="operation-type-selector" name="operationType" value={MultiplicationGameConfiguration.getOperationType()} checked={props.allowedOperationTypes.has(MultiplicationGameConfiguration.getOperationType())} onChange={props.handleOperationTypeChange}/></li>
                </ul>
                <div className="calculation-instance">
                    <div className="calculation-definition">
                    {props.calculation.getMembers().map(function(member, index) {
                        let value = (index !== 0 ? " " + props.calculation.getOperator() + " " + member : member);
                        return <span key={index} className="calculation-line">{value}</span>;
                    })}
                    </div>
                    <input type="text" placeholder="=" className="answer" size="1" value={props.userAnswer} onChange={props.handleChange} />
                    <button type="submit">Vérifier</button>
                    <button type="submit" onClick={props.giveUp} className="give-up">Donner sa langue au chat</button>
                </div>
            </form>
            {props.resultMessage === true ? <SuccessMessage /> : (props.resultMessage === false ? <ErrorMessage /> : <ShowErrorMessage message={props.resultMessage} />)}
        </section>
    );
}
