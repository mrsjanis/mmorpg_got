function UsuariosDAO(connection){
    this._connection = connection(); // _ indica que a variavel faz parte do contexto da função
}

UsuariosDAO.prototype.inserirUsuario = function(dadosUsuario){
    /* função de callback, ordem dos parametros
        - erro
        - objeto de conexão com o banco
    */
    this._connection.open( function(err,mongoclient){
        /* parametros:
            - nome da collection
            - função de callback (erro, objeto pra manipular as informações na collection)
         */
        mongoclient.collection("usuarios", function(err, collection){
            collection.insert(dadosUsuario);
            mongoclient.close;
        });
    }); 
}

UsuariosDAO.prototype.autenticar = function(dadosUsuario, req, res){
    /* função de callback, ordem dos parametros
        - erro
        - objeto de conexão com o banco
    */
    this._connection.open( function(err,mongoclient){
        /* parametros:
            - nome da collection
            - função de callback (erro, objeto pra manipular as informações na collection)
            */
        mongoclient.collection("usuarios", function(err, collection){
            collection.find(dadosUsuario).toArray(function(err, result){
                if(result[0] != undefined){ // se tiver algum registro
                    req.session.autorizado = true; // variavel de sessão autorizando o login
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                } 

                if (req.session.autorizado) {
                    res.redirect("jogo");
                } else {
                    res.render("index", {validacao: {}});
                }
            });
            /*  - pode fazer assim também, porém como o Json possui {chave: valor} igual aos campos
                    que estão sendo pesquisados, pode passar diretamente o Json
                    collection.find({usuario: {$eq: dadosUsuario.usuario}, senha: {$eq: dadosUsuario.senha}});

                - A função "find" retorna um cursor, que precisa ser convertido pra dados por isso a função
                    toArray. O toArray espera uma função de callback pra saber o que fazer depois de transformar
                    o cursor em Array (parametro de erro, array)
            */
            
            mongoclient.close;
        });
    });
}

module.exports = function(){
    return UsuariosDAO;
}