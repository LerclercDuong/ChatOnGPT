const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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',
});

class GptServices{
    async generateAnswer(prompt){
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    { role: "user", content: prompt },
                ],
                model: "gpt-3.5-turbo-1106",
                response_format: { type: "json_object" },
            });
            return completion.choices[0].message.content
        } catch (error) {
            console.error('Error generating answer:', error);
            return null;
        }
    }
}

module.exports = new GptServices;