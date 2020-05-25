var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');
var app = express();

// =========================================
// Crear un nuevo usuario
// =========================================
app.post('/',(req, res) => {
    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if( !usuarioDB ) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - Email',
                errors: err
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - Password',
                errors: err
            });
        }

        // Crear un token !!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB },SEED,{expiresIn:14400});
        res.status(201).json({
            ok:true,
            Usuario:usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });

});

module.exports = app;