<h1 align="center">
<br>
BitBucket Issues Cli (NodeJS)
<br>
</h1>

## Description

This tool allows to query BitBucket issues by command line and export them in a text file. Also, it supports filtering issues by different fields, and custom ones.

## Get Started

* Checkout the repository

```
git clone https://github.com/salazarguille/bitbucket-issues-cli.git
```
* Execute in the root folder
```
npm install
```

## How do I get set up?

#### Configuring BitBucket Access

In order to invoke queries using the BitBucket API, you need to create a ```.env``` file in your working directory.
Once you created that file, you will need to set the values for the below keys:
```
BITBUCKET_USERNAME="username"
BITBUCKET_PASSWORD="password"
BITBUCKET_REPO_NAME="repoName"
BITBUCKET_REPO_USERNAME="repoUsername"
```

#### How can I run the app by command line?

In order to run the app, first you will need to see the filters and fields available to run the app.

In case you want to get all your issues, you can run the command below:

```
npm run all
```
or
```
node ./index.js issues_list.txt
```

#### BitBucket Issue Fields

BitBucket allows us to query our issues, and filter by their values. This is the fields list:

 - **Issue ID**
    - Field: *id*
 - **Issue Title**
    - Field: *title*
 - **Priority**
    - Field: *priority*
 - **State**
    - Field: *state*
 - **Type**
    - Field: *kind*
 - **Milestone**
    - Field: *milestone.name*
 - **Component**
    - Field: *component.name*
 - **Assignee Username**
    - Field: *assignee.username*
 - **Assignee Name**
    - Field: *assignee.display_name*
 - **Reporter Username**
    - Field: *reporter.username*
 - **Reporter Name**
    - Field: *reporter.display_name*
 - **Version**
    - Field: *version.name*

Also, this module allows us to query issues by 3 custom fields, estimated hours, current progress, and the URL to browse the issue.

As we know, BitBucket doesn't allow to set an estimated hours, or a current progress to our issues. So, we defined a pattern in the issue title:

```
[H: 99, P: 15] My Issue
```

where ```H``` is the estimated Hours, and P is the current progress. In that example, the estimated hours is 99, and current progress is 15%.

 - **Estimated**
    - Field: *estimated*
 - **Progress**
    - Field: *progress*
 - **View**
    - Field: *view*
    
#### Condition Formats

##### Contains operator
* Operator: `%%`
* Description: It tests whether a field contains a value or not.
* Sample
    ```assignee.username%%value```
* Sample Invocation
    ```node ./index.js assignee.username%%value issues.txt```

##### Equals operator
* Operator: `==`
* Description: It tests whether a field is equals to a specific (hardcoded) value.
* Sample
    ```assignee.username==value```
* Sample Invocation
    ```node ./index.js assignee.username==value issues.txt```

##### Higher Than operator
* Operator: `>=`
* Description: It tests whether a field is higher than a specific (hardcoded) value.
* Sample
    ```estimated>=value```
* Sample Invocation
    ```node ./index.js estimated>=value issues.txt```

##### Not Equals operator
* Operator: `!=`
* Description: It tests whether a field is not equals to a specific (hardcoded) value.
* Sample
    ```assignee.username!=value```
* Sample Invocation
    ```node ./index.js assignee.username!=value issues.txt```

##### Lower Than operator
* Operator: `<=`
* Description: It tests whether a field is lower than to a specific (hardcoded) value.
* Sample
    ```estimated<=value```
* Sample Invocation
    ```node ./index.js estimated<=value issues.txt```

##### Contains Item operator
* Operator: `=>`
* Description: It tests whether a field value is in a list of (hardcoded) values.
* Sample
    ```state=>new;open```
* Sample Invocation
    ```node ./index.js state=>new;open issues.txt```

### Can I filter my issues by multiple fields?

Yes, we can filter by multiple fields (included in above list). In order to do that, we can pass multiple conditions by command line with the comma separator (```,```).

#### Filtering by Multiple Fields Samples

 - *Filtering all the issues which have an estimated hours equals to ```0``` and the state is ```Open``` or ```New```.*
```node ./index.js "estimated==0,state=>new;open" issues_list.txt```

- *Filtering all the issues which have an estimated hours higher than ```0``` and the state is equal to ```New```.*
```node ./index.js "estimated>=0,state==new" issues_list.txt```

## Do you want to improve this tool?

Feel free to create a feature branch and a pull request with your changes. I will review it, and merge to master if it looks fine.

## Do you want to contact me?

You can send me an email to ```guillesalazar@gmail.com```.