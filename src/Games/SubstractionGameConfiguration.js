import CalculationGameConfiguration from './CalculationGameConfiguration';
import Random from 'random-js';

export default class SubstractionnGameConfiguration extends CalculationGameConfiguration {
    static getOperationType() {
        return 2;
    }
    
    constructor() {
        super('-');
    }
    
    getCalculationResult(members) {
        if (members.length === 0) {
            return -1;
        }

        return members.reduce((total, currentValue) => total - currentValue);
    }
    
    getCalculation() {
        const random = new Random();
        let members;
        const membersCount = random.integer(2, 3);
        
        do {
            members = [];
            while(members.length < membersCount) {
                members.push(random.integer(1, 30));
            }
        } while (this.getCalculationResult(members) < 0);
        
        return members;
    }
}