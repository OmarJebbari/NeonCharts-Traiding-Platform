import fs from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.neon' });

const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    let sql = fs.readFileSync('../../DataBase/tv_app_dump.sql', 'utf8');

    // Transform MySQL syntax to PostgreSQL
    sql = sql.replace(/CREATE DATABASE IF NOT EXISTS [^;]+;/gi, '')
        .replace(/USE [^;]+;/gi, '')
        .replace(/AUTO_INCREMENT/g, 'SERIAL')
        .replace(/BIGINT SERIAL/g, 'BIGSERIAL')
        .replace(/ENGINE=InnoDB(?:[^;]+)?;?/gi, ';')
        .replace(/category ENUM\([^)]+\)/g, 'category VARCHAR(80)')
        .replace(/period ENUM\([^)]+\)/g, 'period VARCHAR(20)')
        .replace(/plan ENUM\([^)]+\)/g, 'plan VARCHAR(20)')
        .replace(/TINYINT/g, 'SMALLINT')
        .replace(/INDEX idx_date_cat \([^)]+\),/g, '')
        .replace(/INDEX idx_country \([^)]+\),/g, '')
        .replace(/INDEX idx_title \([^)]+\)/g, '')
        .replace(/UNIQUE KEY "?[a-zA-Z0-9_]+"? \("?([a-zA-Z0-9_]+)"?\),/g, 'UNIQUE($1),')
        .replace(/UNIQUE KEY "?[a-zA-Z0-9_]+"? \("?([a-zA-Z0-9_]+)"?\)/g, 'UNIQUE($1)')
        .replace(/UNIQUE KEY [a-zA-Z0-9_]+ \(([a-zA-Z0-9_]+)\)/g, 'UNIQUE($1)')
        .replace(/UNIQUE KEY [a-zA-Z0-9_]+ \(([a-zA-Z0-9_]+)\),/g, 'UNIQUE($1),')
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
        .replace(/\\r/g, '')
        .replace(/,\s*\)/g, '\n)'); // Remove trailing commas before closing parens

    fs.writeFileSync('migrated.sql', sql);

    try {
        await pool.query(sql);
        console.log("Migration successful! Data seeded into Neon Database.");
    } catch (err) {
        console.error("Migration failed:", err);
    }
    process.exit(0);
}

run();
