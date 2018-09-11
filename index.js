/*
 * @title This is the entry point to the BitBucket Query API.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
/*
    node index.js conditions file
    node index.js file
*/
require('dotenv').config();
const _ = require('lodash');

const username = process.env.BITBUCKET_USERNAME;
const password = process.env.BITBUCKET_PASSWORD;
if(_.isNil(username) || _.isNil(password)) {
    throw new Error(`Username and password are required to connect to Bitbucket. Check BITBUCKET_USERNAME and BITBUCKET_PASSWORD environment variables.`);
}

const repoUsername = process.env.BITBUCKET_REPO_USERNAME;
const repoName = process.env.BITBUCKET_REPO_NAME;
if(_.isNil(repoUsername) || _.isNil(repoName)) {
    throw new Error(`Repository name and username are required to get the issues. Check BITBUCKET_REPO_USERNAME and BITBUCKET_REPO_NAME environment variables.`);
}

const validParams = [3, 4];
let conditions = '';
let outputFile = 'issues_list.txt';

if(validParams.indexOf(process.argv.length) == -1) {
    throw new Error('Invalid params: "node index.js conditions file" or "node index.js file"');
}

const Filters = require('./src/Filters');
const FieldValue = require('./src/FieldValue');
const FileWriter = require('./src/FileWriter');
const Api = require('./src/BitbucketApi');

if(process.argv.length == 3) {
    outputFile = process.argv[2];
}
if(process.argv.length == 4) {
    conditions = process.argv[2];
    outputFile = process.argv[3];
}
const fieldValue = new FieldValue(repoName, repoUsername);
const filters = new Filters(fieldValue);
const fileWriter = new FileWriter(outputFile);

const api = new Api(username, password);

const callIssues = async () => {
    const issues = await api.issues(repoName, repoUsername);
    const filtersInstances = filters.createFilters(conditions, ',');
    const filteredIssues = filters.apply(issues, filtersInstances);
    fileWriter.write(filteredIssues, fieldValue.all());
};

callIssues();