const oracledb = require('oracledb');

async function run() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING
    });

    const result = await connection.execute(
      'SELECT id, nome FROM usuarios WHERE id = :id',
      { id: 1 }, 
      { outFormat: oracledb.OUT_FORMAT_OBJECT } 
    );

    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();




