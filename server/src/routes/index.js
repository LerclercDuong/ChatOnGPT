const authRouter = require('./auth');
const messengerRouter = require('./messenger');
const userRouter = require('./user')
const chatbotRouter = require('./chatbot');
const paymentRouter = require('./payment');
const CheckAuth = require('../middlewares/auth')

function router(app){
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/messenger', messengerRouter);
    app.use('/api/v1/user', userRouter );
    app.use('/api/v1/chat-bot', chatbotRouter);
    app.use('/payment', paymentRouter);
}

module.exports = router;