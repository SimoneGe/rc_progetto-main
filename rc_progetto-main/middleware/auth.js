module.exports = {
    ensureAuthentication: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/manager')
        } else {
            return next()
        }
    }
}

/**
 * Questo modulo deve essere importato da ogni router 
 * const { ensureAuthentication, ensureGuest} = require("<path/to/this/file>"")
 * la funzione ensure authentication deve essere passata come secondo parametro in ogni setting di endopoint sul router
 * router.get('endpoint', ensureAuthentication, functio (req, res) {
 * //logica delle chimata (tipo quella di Amad + OPW)
 * })
 */