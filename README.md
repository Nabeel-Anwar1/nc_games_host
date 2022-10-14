# NC-Games

## Link to hosted version:

https://nabeelgameproject.herokuapp.com/api/

## Summary of project

For this project, we had to build a functioning and tested server that takes requests from the user, processes them and sends back an appropriate response. Full error handling middleware was put into use to send back errors that the user can gain information from and correct their faults.

## Instructions

### Cloning

With git you can take the repository URL and in your terminal write

```
git clone repo-URL-here
```

### Dependencies

### Seeding

To start, in your terminal write the following:

```
npm run setup-dbs
npm run seed
```
This will create the database and then add all of the data in the data files into it.
### Running tests

Using the command `npm test` will run all the tests that have been written.

## For Developer Usage

If a developer would like to use this repository, you will need to create the .env files in your folder to access the neccessary environment variables. To do this, create two new files, one called '.env.development' and the other '.env.test'. Inside the delopment file, write 'PGDATABASE=database_name_here', with database_name_here being the correct name of the database. Inside the test file, write 'PGDATABASE=database_name_here_test', with database_name_here being the correct name of the database with \_test at the end.

## Minimum versions for Node.js and Postgres

Node: v18.9.0
Postgres: v8.19.1
