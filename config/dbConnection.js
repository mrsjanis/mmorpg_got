/* importar o mongodb */
var mongoDB = require('mongodb');

var connMongoDB = function(){
    var db = new mongoDB.Db(
        'got', // string com o nome do banco de dados
        new mongoDB.Server( // objeto de conexão com o servidor
            'localhost', // string com endereço do servidor
            '27017', // porta de conexão
            {}, // objeto com configuração do servidor            
        ),
        {} // objeto de configurações opcionais    
    );

    return db;
}

module.exports = function(){
    return connMongoDB;
}