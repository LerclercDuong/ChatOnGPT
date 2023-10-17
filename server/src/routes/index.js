const auth = require('./auth');
const mess = require('./messenger');
function router(app){
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/messenger', mess);
    // app.use('/admin', );
}

module.exports = router;