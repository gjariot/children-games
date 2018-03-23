export default class CalculationGameConfiguration {
    members;
    result;
    operator;
    
    constructor(operator) {
        this.operator = operator;
    }
    
    getMembers() {
        return this.members;
    }
    
    getResult() {
        return this.result;
    }
    
    getOperator() {
        return this.operator;
    }
    
    generate() {
        this.members = this.getCalculation();
        this.result = this.getCalculationResult(this.members);
    }
}