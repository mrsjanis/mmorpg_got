var ObjectID = require('mongodb').ObjectID;

function JogoDAO(connection){
    this._connection = connection(); // _ indica que a variavel faz parte do contexto da função
}

JogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open( function(err,mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.insert({
                usuario, usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            });
            mongoclient.close;
        });
    }); 
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    this._connection.open( function(err,mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.find({usuario : usuario}).toArray(function(err, result){  
                res.render("jogo", {img_casa: casa, jogo: result[0], msg: msg});  
                mongoclient.close;                               
            });            
        });
    }); 
}

JogoDAO.prototype.acao = function(acao){
    this._connection.open( function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            var tempoAcao = 0;

            switch(parseInt(acao.acao)){
                case 1: tempoAcao = (1 * 60 * 60000); break;
                case 2: tempoAcao = (2 * 60 * 60000); break;
                case 3: tempoAcao = (5 * 60 * 60000); break;
                case 4: tempoAcao = (5 * 60 * 60000); break;
            }

            var date = new Date();
            acao.termino = (date.getTime() + tempoAcao);

            collection.insert(acao);        
        });

        mongoclient.collection("jogo", function(err, collection){
            var moedas = 0;
           
            switch(parseInt(acao.acao)){
                case 1: moedas = -2 * acao.quantidade; break;
                case 2: moedas = -3 * acao.quantidade; break;
                case 3: moedas = -1 * acao.quantidade; break;
                case 4: moedas = -1 * acao.quantidade; break;
            }
            
            collection.update(
                {usuario : acao.usuario},
                {$inc: {moeda: moedas}}); // variavel faz um incremento da chave com o parametro
        });
        
        mongoclient.close;
    }); 
}

JogoDAO.prototype.getAcoes = function(res, usuario){
    this._connection.open( function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            var date = new Date();
            var dataAtual = date.getTime()

            collection.find({usuario : usuario, termino: {$gt:dataAtual}}).toArray(function(err, result){  
                res.render("pergaminhos", {acoes: result});  
                mongoclient.close;                               
            });            
        });
    }); 
}

JogoDAO.prototype.revogarAcao = function(res,_id){
    this._connection.open( function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            collection.remove(
                {_id :  ObjectID(_id)},
                function(err, result){
                    res.redirect('/jogo?msg=D');
                    mongoclient.close; 
                }
            );               
        });
    }); 
}


module.exports = function(){
    return JogoDAO;
}