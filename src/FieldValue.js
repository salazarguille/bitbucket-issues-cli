const _ = require('lodash');
const DEFAULT_ESTIMATED_HOURS = -1;
const noHourStates = [];
noHourStates.push('duplicate');
noHourStates.push('wontfix');
noHourStates.push('invalid');

const createGet = (display, field, customGet) => {
    return {
        display: display,
        field: field,
        get: (issue) => {
            return customGet(issue);
        }
    };
};

const createField = (display, field) => {
    return {
        display: display,
        field: field,
        get: (issue) => {
            const value = _.get(issue, field);
            const safeValue = value === null || typeof value === 'undefined' ? '' : value.toString();
            return safeValue;
        }
    };
};

const getJsonFromTitle = (title) => {
    const defaultValue = {H: DEFAULT_ESTIMATED_HOURS, P: 0};
    const startIndex = title.indexOf('[');
    const endIndex = title.indexOf(']');
    if(startIndex > -1 && endIndex > -1) {
        const jsonValue = '{' + title.substr(startIndex + 1, endIndex - 1) + '}';
        var fixedJSON = jsonValue.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
        try {
            const json = JSON.parse(fixedJSON);
            return json;
        } catch(error) {
            console.log(error);
        }
    }
    return defaultValue;
};

/*
 * @title It stores all available fields in the repo to be queried.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
function FieldValue(repoName, repoUsername) {
    if (!(this instanceof FieldValue)) {
        return new FieldValue();
    }
    this.repoName = repoName;
    this.repoUsername = repoUsername;
    this.fields = [];
    this.fields.push(createField('ID', 'id'));
    this.fields.push(createField('Title', 'title'));
    this.fields.push(createGet('Estimated', 'estimated', (issue) => {
        const state = issue.state;
        const isResolved = state === 'resolved';
        const estimated = getJsonFromTitle(issue.title).H;
        if(estimated == DEFAULT_ESTIMATED_HOURS){
            if(isResolved) {
                return DEFAULT_ESTIMATED_HOURS_RESOLVED;
            } else {
                if(noHourStates.indexOf(state) > -1) {
                    return 0;
                } else {
                    return -1;
                }
            }
        } else {
            return estimated;
        }
    }));
    this.fields.push(createGet('Progress', 'progress', (issue) => {
        return getJsonFromTitle(issue.title).P;
    }));
    this.fields.push(createField('Priority', 'priority'));
    this.fields.push(createField('State', 'state'));
    this.fields.push(createField('Type', 'kind'));
    this.fields.push(createField('Milestone', 'milestone.name'));
    this.fields.push(createField('Component', 'component.name'));
    this.fields.push(createField('Assignee Username', 'assignee.username'));
    this.fields.push(createField('Assignee Name', 'assignee.display_name'));
    this.fields.push(createField('Reporter Username','reporter.username'));
    this.fields.push(createField('Reporter Name', 'reporter.display_name'));
    this.fields.push(createGet('View', 'view', (issue) => {
        return `https://bitbucket.org/${this.repoUsername}/${this.repoName}/issues/${issue.id}`;
    }));
    this.fields.push(createField('Version', 'version.name'));
}

FieldValue.prototype.get = function get(fieldName) {
    for (const key in this.fields) {
        const field = this.fields[key];
        if(_.isEqual(field.field, fieldName)) {
            return field;
        }
    }
    return null;
};

FieldValue.prototype.all = function all() {
    return this.fields;
};

module.exports = FieldValue;