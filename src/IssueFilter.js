const _ = require('lodash');

/*
 * @title It filters the issues associated to this instance.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
function IssueFilter(_issues) {
    if (!(this instanceof IssueFilter)) {
        return new IssueFilter();
    }
    this.issues = _issues;
}

IssueFilter.prototype.filter = function filter(filters) {
    const result = [];
    this.issues.forEach(issue => {
        let passFilters = true;
        for (const key in filters) {
            const filter = filters[key];
            passFilters = passFilters && filter.filter(issue);
            if(!passFilters) {
                break;
            }
        }
        if(passFilters) {
            result.push(issue);
        }
    });
    return result;
};

module.exports = IssueFilter;