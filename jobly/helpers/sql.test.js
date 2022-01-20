const { sqlForPartialUpdate } = require("./sql.js")

describe("TestUpdate", function () {
    const data = sqlForPartialUpdate({ firstName: 'Aliya', age: 32 });

    expect(data).toEqual({first_name='Aliya', age=32})
}
)