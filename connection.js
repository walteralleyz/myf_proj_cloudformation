const mysql = require('mysql');
require('dotenv').config();

class Connection {
    makeConnection() {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
        });
    }
    
    createDatabase(connection) {
        return new Promise((resolve, reject) => {
            connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, rows, fields) => {
                if(err) {
                    return reject(err);
                }
                
                resolve(rows);
            });
        });
    }
    
    createTable(connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                `CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.${process.env.DB_TABLE} (
                    id SERIAL PRIMARY KEY,
                    arq_nome VARCHAR(100) NOT NULL,
                    arq_conteudo VARCHAR(500)
                )`,
                (err, rows, fields) => {
                    if(err) {
                        return reject(err);
                    }

                    resolve(rows);
                }
            );
        });
    }

    insertInto(connection, file) {
        return new Promise((resolve, reject) => {
            connection.query(
            `INSERT INTO ${process.env.DB_NAME}.${process.env.DB_TABLE} (arq_nome, arq_conteudo) 
            VALUES ('${file.name}', '${file.conteudo}')`, 
            (err, rows, fields) => {
                if(err) {
                    return reject(err);
                }

                resolve(rows);
            });
        });
    }
    
    getAll(connection) {
        return new Promise((resolve, reject) => {
           connection.query(`SELECT * FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`, (err, rows, fields) => {
              if(err) {
                  return reject(err);
              }
              
              resolve(rows);
           });
        });
    }
    
    removeAll(connection) {
        return new Promise((resolve, reject) => {
           connection.query(`DELETE FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`, (err, rows, fields) => {
              if(err) {
                  return reject(err);
              }
              
              resolve(rows);
           });
        });
    }
}

exports.conn = () => new Connection();