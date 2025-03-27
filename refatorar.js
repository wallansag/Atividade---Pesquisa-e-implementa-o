const oracledb = require('oracledb');

async function getConnection() {
  try {
    return await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING
    });
  } catch (err) {
    console.error('Erro ao conectar ao Oracle:', err);
    throw err;
  }
}

async function findUserById(id) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      'SELECT id, nome, email FROM usuarios WHERE id = :id',
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function createUser(userData) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO usuarios (nome, email) VALUES (:nome, :email) RETURNING id INTO :newId',
      {
        nome: userData.nome,
        email: userData.email,
        newId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true } 
    );
    return result.outBinds.newId[0];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



module.exports = {
  findUserById,
  createUser,
 
};