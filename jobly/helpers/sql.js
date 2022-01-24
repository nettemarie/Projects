const { BadRequestError } = require("../expressError");

// Function accepts two objects.
// dataToUpdate includes the object with the data to send to the DatabaseError.
// jsToSql includes the column names that will be updated.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // get keys from data to update object
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  /* get an array of strings where each string is the corresponding db column name for each key
   * set equal to the index-based parameter number for the sql command
   * ex: {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2'] */
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

function getSqlWhereCompanyFilters(filter) {
  const { name, minEmployees, maxEmployees } = filter;

  let sqlFilter = "";
  // If any filter exists, build WHERE Clause
  if (name || minEmployees || maxEmployees) {
    // throw error if minEmployes > maxEmployees
    if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
      throw new BadRequestError(
        `minEmployess cannot be greater than maxEmployees`
      );
    }
    // Create SQL statement for each filter as it would appear in WHERE Clause (if exists)
    let nameSql = name ? `name ILIKE '%${name}%'` : "";
    let minSql = minEmployees
      ? `${nameSql ? "AND " : ""}num_employees >= ${minEmployees}`
      : "";
    let maxSql = maxEmployees
      ? `${nameSql || minSql ? "AND " : ""}num_employees <= ${maxEmployees}`
      : "";

    // Concatenate filter statements into one WHERE clause string
    sqlFilter = `
        WHERE
          ${nameSql} ${minSql} ${maxSql}
      `;
  }
  return sqlFilter;
}

// Function accepts an object which includes the keys and values to filter companies by SQL query.
// Returns a string that will be added to the sql query WHERE clause

function getSqlWhereJobFilters(filter) {
  const { title, minSalary, hasEquity } = filter;

  let sqlFilter = "";
  // If any filter exists, build WHERE Clause
  if (title || minSalary || hasEquity) {
    // Create SQL statement for each filter as it would appear in WHERE Clause (if exists)
    let titleSql = title ? `title ILIKE '%${title}%'` : "";
    let minSalarySql = minSalary
      ? `${titleSql ? "AND " : ""}salary >= ${minSalary}`
      : "";
    let hasEquitySql = hasEquity
      ? `${titleSql || minSalarySql ? "AND " : ""}equity > 0`
      : "";

    // Concatenate filter statements into one WHERE clause string
    sqlFilter = `
        WHERE
          ${titleSql} ${minSalarySql} ${hasEquitySql}
      `;
  }
  return sqlFilter;
}

module.exports = {
  sqlForPartialUpdate,
  getSqlWhereCompanyFilters,
  getSqlWhereJobFilters,
};
