const auth = require('./auth');
const mess = require('./messenger');
const chatbot = require('./chatbot');
const payment = require('./payment');
const authToken = require('../middlewares/auth')

function router(app){
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/messenger', authToken, mess);
    app.use('/api/v1/chat-bot', chatbot);
    app.use('/payment', payment);
}

module.exports = router;