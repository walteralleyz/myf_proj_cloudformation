const connection = require('./connection');

exports.execute = async (event, context, callback) => {
    let connManager = connection.conn();
    let dbConn = connManager.makeConnection();
    
    await connManager.createDatabase(dbConn)
        .catch(err => console.log(err));
        
    await connManager.createTable(dbConn)
        .catch(err => console.log(err));
        
    await connManager.insertInto(dbConn, {
        name: event.Records[0].s3.object.key,
        conteudo: Date.now().toString()
    }).catch(err => console.log(err));
    
    await connManager.getAll(dbConn)
        .then(res => {
            console.log(res);
            dbConn.end();
        })
        .catch(err => console.log(err));
}