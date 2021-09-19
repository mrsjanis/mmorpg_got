module.exports.jogo = function(application,req,res){    
    if(req.session.autorizado !== true){
        res.send('Necessário fazer login');
        return;
    }

    var msg = '';
    if(req.query.msg !== ''){
        msg = req.query.msg;
    }
    
    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, msg);        
}

module.exports.sair = function(application,req,res){  
    req.session.destroy(function(err){
        res.render('index', {validacao: {}})
    }); 
}

module.exports.suditos = function(application,req,res){  
    if(req.session.autorizado !== true){
        res.send('Necessário fazer login');
        return;
    }

    res.render("aldeoes")
}

module.exports.pergaminhos = function(application,req,res){  
    if(req.session.autorizado !== true){
        res.send('Necessário fazer login');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.getAcoes(res,req.session.usuario);
}

module.exports.ordenar_acao_sudito = function(application,req,res){  
    if(req.session.autorizado !== true){
        res.send('Necessário fazer login');
        return;
    }

    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();
    if (erros){
        res.redirect('jogo?msg=E');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=S');
}

module.exports.revogar_acao = function(application,req,res){  
    var urlQuery = req.query;
    
    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.revogarAcao(res,urlQuery.id_acao);
}



