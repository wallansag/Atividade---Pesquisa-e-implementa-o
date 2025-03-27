const oracledb = require('oracledb');

async function getConnection() {
  
}

async function findProductById(id) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      'SELECT id, nome, preco FROM produtos WHERE id = :id',
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

async function createProduct(productData) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO produtos (nome, preco) VALUES (:nome, :preco) RETURNING id INTO :newId',
      {
        nome: productData.nome,
        preco: productData.preco,
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
  findProductById,
  createProduct,
 
};