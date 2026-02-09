const mysql = require('mysql2');
require('dotenv').config();

async function initializeDatabase() {
  console.log('🔧 Ap inisyalize database...');
  
  try {
    // Parse DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    const databaseName = url.pathname.substring(1);
    
    console.log(`📁 Database: ${databaseName}`);
    console.log(`🔗 Host: ${url.hostname}:${url.port}`);
    
    // 1. PREMYE: Kreye database si li pa egziste
    const adminConnection = mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: url.port,
      ssl: { rejectUnauthorized: false }
    });
    
    await adminConnection.promise().connect();
    await adminConnection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log('✅ Database verifye/kreye');
    adminConnection.end();
    
    // 2. DEZYÈM: Konekte ak database a epi kreye tab yo
    const dbConnection = mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: databaseName,
      port: url.port,
      ssl: { rejectUnauthorized: false }
    });
    
    await dbConnection.promise().connect();
    console.log('✅ Konekte ak database');
    
    // Lis tout SQL komande
    const sqlCommands = [
      // Tab users
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`,
      
      // Tab transactions
      `CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description VARCHAR(255),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (user_id),
        INDEX (date)
      ) ENGINE=InnoDB`
    ];
    
    // Ekzekite chak komande
    for (let i = 0; i < sqlCommands.length; i++) {
      try {
        await dbConnection.promise().query(sqlCommands[i]);
        console.log(`✅ Tab ${i+1} kreye/verifye`);
      } catch (error) {
        console.error(`❌ Erè nan tab ${i+1}:`, error.message);
        // Si se yon index erè, kontinye
        if (error.code === 'ER_DUP_KEYNAME' || error.message.includes('Duplicate key')) {
          console.log('📌 Index deja egziste, kontinye...');
        } else {
          throw error;
        }
      }
    }
    
    // Verifye kreasyon an
    const [tables] = await dbConnection.promise().query('SHOW TABLES');
    console.log(`📊 Tab kreye: ${tables.length} tab`);
    
    for (const table of tables) {
      const tableName = table[`Tables_in_${databaseName}`];
      const [columns] = await dbConnection.promise().query(`DESCRIBE \`${tableName}\``);
      console.log(`   ${tableName}: ${columns.length} kolòn`);
    }
    
    dbConnection.end();
    console.log('🎉 Database inisyalizasyon fini avèk siksè!');
    
  } catch (error) {
    console.error('❌ ERÈ KRITIK nan inisyalizasyon:');
    console.error('   Mesaj:', error.message);
    console.error('   Kòd:', error.code);
    console.error('   SQL:', error.sql || 'Pa gen');
    
    // Sispann pwosesis la, men pa kraze
    console.log('\n⚠️  Atansyon: Database initialization echwe.');
    console.log('ℹ️  Ou ka kontinye, men aplikasyon an ka pa fonksyone byen.');
    console.log('ℹ️  Tanpri verifye:');
    console.log('   1. DATABASE_URL nan .env');
    console.log('   2. WiFi/internet konèksyon');
    console.log('   3. Database permissions');
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;