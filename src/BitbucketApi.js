const BitBucket = require('bitbucket');

/*
 * @title It encapsulates the logic to interact with Bitbucket Rest API.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
function BitBucketApi(_username, _password) {
    if (!(this instanceof BitBucketApi)) {
        return new BitBucketApi(_authenticate);
    }
    this.bitbucket = new BitBucket();
    try {
        this.bitbucket.authenticate({
            type: 'basic',
            username: _username,
            password: _password
        });
    } catch(error) {
        console.log(error);
        throw new Error(error);
    }
}

const addResult = (issues, result) => {
    if(result != null || result.length > 0) {
        console.log(`Adding ${result.length} new items. Current items ${issues.length}.`);
        result.forEach(issue => issues.push(issue));
    }
};

BitBucketApi.prototype.requestNextPageIfNeeded = async function (issues, currentData) {
    const hasNextPage = await this.bitbucket.hasNextPage(currentData);
    if(hasNextPage) {
        const nextData = await this.bitbucket.getNextPage(currentData);
        const result = nextData.data.values;
        await addResult(issues, result);
        await this.requestNextPageIfNeeded(issues, nextData.data);
    }
};

BitBucketApi.prototype.issues = async function issues(repo_slug, username) {
    const q = '';
    const sort = '';
    const issues = [];
    
    try {
        const {data, headers} = await this.bitbucket.issue_tracker.list({ q, repo_slug, sort, username });
        const result = data.values;

        addResult(issues, result);

        if(result != null || result.length > 0) {
            await this.requestNextPageIfNeeded(issues, data);
        }
    } catch (error) {
        if(error.toString().indexOf('HTTPError') > -1) {
            throw new Error('Check username / passwords.');
        }
        throw new error(error);
    }
    return issues;
};

module.exports = BitBucketApi;