const auth = require('./auth');
const mess = require('./messenger');
function router(app){
    app.use('/auth', auth);
    app.use('/messenger', mess);
}

module.exports = router;