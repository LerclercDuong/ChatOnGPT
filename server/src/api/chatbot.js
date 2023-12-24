const axios = require('axios');
const Services = require('../services/index.js');

const { gptServices } = Services;
class Chatbot{

    // handle message after receive from facebook through webhook
    async handleMessage(req, res, next){
        const prompt = "how to use chatgpt";

        await gptServices.generateAnswer(prompt)

    }

    async reply(){

    }
}

module.exports = new Chatbot;