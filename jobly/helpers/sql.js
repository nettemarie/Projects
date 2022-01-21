const { query } = require("express");
const { DatabaseError } = require("pg-protocol");
const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// Function accepts two objects.
// dataToUpdate includes the object with the data to send to the DatabaseError.
// jsToSql includes the column names that will be updated.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // Pull keys from data then check if data was submitted
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  // returns an object containing:
  // a setCols array, which holds the column names to update
  // and a values array containg the corresponding data to send to each column

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// Function accepts an object which includes the keys and values to filter companies by SQL query.
// Returns a string that will be added to the sql query WHERE clause

function sqlForCompaniesFilter(filter) {
  const { name, minEmployees, maxEmployees } = filter;

  let sqlFilter = "";
  // if a filter exists, build WHERE clause
  if (name || minEmployees || maxEmployees) {
    //throw error if minEmployees > maxEmployees
    if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
      throw new BadRequestError(
        `minEmployees cannot be greater than maxEmployees`
      );
    }

    //Create SQL statement for each filter
    let nameSql = name ? `name ILIKE '%${name}%'` : "";
    let minSql = minEmployees
      ? `${nameSql ? "AND " : ""}num_employees >=${minEmployees}`
      : "";
    let maxSql = maxEmployees
      ? `${nameSql || minSql ? "AND " : ""}num_employees <= ${maxEmployees}`
      : "";

    //Concatenate filter statementts into one WHERE clause string
    sqlFilter = `WHERE ${nameSql} ${minSql} ${maxSql}`;
  }
  return sqlFilter;
}

// Function accepts an object which includes the keys and values to filter companies by SQL query.
// Returns a string that will be added to the sql query WHERE clause

function sqlForJobsFilter(filter) {
  const { title, minSalary, hasEquity } = filter;

  let sqlFilter = "";
  //if a filter exists, vuild WHERE clause
  if (title || minSalary || hasEquity) {
    //Create SQL statement for each filter
    let titleSql = title ? `title ILIKE '%${title}%` : "";
    let minSalarySql = minSalary
      ? `${titleSql ? "AND " : ""}salary >= ${minSalary}`
      : "";
    let hasEquitySql = hasEquity
      ? `${titleSql || minSalarySql ? "AND " : ""}equity > 0`
      : "";

    //Concatenate filter statements into one WHERE clause string
    sqlFilter = `WHERE ${titleSql} ${minSalarySql} ${hasEquitySql}`;
  }
  return sqlFilter;
}

module.exports = {
  sqlForPartialUpdate,
  sqlForCompaniesFilter,
  sqlForJobsFilter,
};
