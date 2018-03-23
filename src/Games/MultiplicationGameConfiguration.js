import CalculationGameConfiguration from './CalculationGameConfiguration';
import Random from 'random-js';

export default class MultiplicationGameConfiguration extends CalculationGameConfiguration {
    static getOperationType() {
        return 3;
    }
    
    constructor() {
        super('x');
    }
    
    getCalculationResult(members) {
        if (members.length === 0) {
            return 0;
        }
    
        return members.reduce((total, currentValue) => total * currentValue, 1);
    }
    
    getCalculation() {
        const random = new Random();
        let members = [];
        
        members.push(random.integer(0, 10));
        members.push(random.integer(0, 10));
        
        return members;
    }
    
    generate() {
        this.members = this.getCalculation();
        this.result = this.getCalculationResult(this.members);
        this.operator = 'x';
    }
}