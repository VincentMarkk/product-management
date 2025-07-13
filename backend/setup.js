const sql = require('mssql');

const config = {
  user: 'user',
  password: 'password',
  server: 'productManagement',
  database: 'productManagement',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function setup() {
  try {
    await sql.connect(config);

    await sql.query(`
      IF OBJECT_ID('products') IS NOT NULL DROP TABLE products;
      IF OBJECT_ID('categories') IS NOT NULL DROP TABLE categories;

      CREATE TABLE categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100)
      );

      INSERT INTO categories (name) VALUES ('Makanan'), ('Minuman'), ('Lainnya');

      CREATE TABLE products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100),
        price DECIMAL(10,2),
        category_id INT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      INSERT INTO products (name, price, category_id) VALUES
      ('Beras', 12000, 1),
      ('Es teh', 8000, 2),
      ('Shock breaker', 5000, 3);
    `);

    // console.log('Bikin table dan data');
  } catch (err) {
    console.error('Setup failed:', err);
  } finally {
    sql.close();
  }
}

setup();