import CalculationGameConfiguration from './CalculationGameConfiguration';
import Random from 'random-js';

export default class CalculationAdditionGameConfiguration extends CalculationGameConfiguration {
    static getOperationType() {
        return 1;
    }
    
    constructor() {
        super('+');
    }
    
    getCalculationResult(members) {
        if (members.length === 0) {
            return 0;
        }
    
        return members.reduce((total, currentValue) => total + currentValue, 0);
    }
    
    getCalculation() {
        const random = new Random();
        let members = [];
        
        while((this.getCalculationResult(members) < 50 || members.length < 2) && members.length < 3) {
            members.push(random.integer(1, 20));
        }
        
        return members;
    }
}