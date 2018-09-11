const _ = require('lodash');
const IssueFilter = require('./IssueFilter');

/*
 * @title It defines the available operators for the filter conditions.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
function Filters(_fields) {
    if (!(this instanceof Filters)) {
        return new Filters();
    }
    this.fields = _fields;
    this.operators = [];
    this.operators.push("%%");//contains
    this.operators.push("==");//equals
    this.operators.push(">=");//higher than
    this.operators.push("!=");//not equals.
    this.operators.push("<=");//lower than
    this.operators.push("=>");//contains item in array.

    this.filters = new Map();
    this.filters.set('==', (v1, v2) => {
        if(_.isNil(v1) || _.isNil(v2)) {
            return _.isEqual(v1, v2);
        }
        return _.isEqual(v1.toString().toLowerCase(), v2.toString().toLowerCase());
    });
    this.filters.set('>=', (v1, v2) => {
        return _.gte(v1, v2);
    });
    this.filters.set('!=', (v1, v2) => {
        const filter = this.filters.get("==");
        return !filter(v1, v2);
    });
    this.filters.set('<=', (v1, v2) => {
        return !_.lte(v1, v2);
    });
    this.filters.set('=>', (v1, v2) => {
        //v1 is array (or ; separated).
        const values = typeof v1 === 'string' ? v1.split(";") : v1;
        let result = false;
        for (const key in values) {
            const element = values[key];
            const equalFunction = this.filters.get('==');
            result = equalFunction(element, v2);
            if(result) {
                break;
            }
        }
        return result;
    });
    this.filters.set('%%', (v1, v2) => {
        if(_.isNil(v1) || _.isNil(v2)) {
            return false;
        }
        return v2.toString().toLowerCase().indexOf(v1.toString().toLowerCase()) > -1;
    });
}

Filters.prototype.getOperator = function getOperator(condition) {
    for (const key in this.operators) {
        const operator = this.operators[key];
        if(condition.indexOf(operator) > -1) {
            return operator;
        }
    };
    return null;
}

Filters.prototype.createFilter = function createFilter(condition) {
    //condition -> field==value
    const operator = this.getOperator(condition);
    if(operator == null) {
        throw new Error(`Operator in condition is invalid: ${condition}.`);
    }
    const keyValue = condition.split(operator);
    if(keyValue.length == 2) {
        const thisFields = this.fields;
        const filter = {
            key: keyValue[0],
            value: keyValue[1],
            operator: operator,
            filter: (item) => {
                const operatorFunction = this.filters.get(operator);
                const value = filter.value;
                const field = thisFields.get(filter.key);

                const itemValue = field.get(item);

                const result = operatorFunction(value, itemValue);

                console.log(`Filtering condition ( ${filter.key} = ${itemValue} ) ${filter.operator} ${filter.value} => ${result}.`)
                return result;
            }
        };
        return filter;
    } else {
        console.log(`WARNING: Missing key value ${keyValue}.`);
    }
};

Filters.prototype.createFilters = function createFilters(condition, separatedBy) {
    const filters = [];
    if(_.isNil(condition ) || _.isEmpty(condition)) {
        return filters;
    }
    const conditions = _.split(condition, separatedBy);
    console.log(conditions);
    for (const key in conditions) {
        const condition = conditions[key];
        const filter = this.createFilter(condition);
        filters.push(filter);
    }
    return filters;
}

Filters.prototype.apply = function apply(issues, filters) {
    const issueFilter = new IssueFilter(issues);
    const issuesfiltered = issueFilter.filter(filters);
    return issuesfiltered;
};

module.exports = Filters;