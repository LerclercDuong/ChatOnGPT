const OpenAI = require('openai');
require("dotenv").config()


class GptServices{
    async generateAnswer(prompt){
        try {
            const openai = new OpenAI({
                apiKey: process.env.GPT_KEY,
            });
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    { role: "user", content: prompt },
                ],
                model: "gpt-4-1106-preview",
                response_format: { type: "json_object" },
            });
            console.log(completion)
            return completion.choices[0].message.content
        } catch (error) {
            console.error('Error generating answer:', error);
            return null;
        }
    }
}

module.exports = new GptServices;