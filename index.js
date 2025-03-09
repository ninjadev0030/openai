require('dotenv').config();

const axios = require('axios');
const { Readable } = require('stream');

const API_KEY = process.env.OPENAI_API_KEY;
const URL = "https://api.openai.com/v1/chat/completions";

const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
};

const payload = {
    "model": "gpt-4-turbo",
    "messages": [
        {
            "role": "system",
            "content": "content from previous file."
        },
        {
            "role": "user",
            "content": "Here are 30 original exam questions for the <EXAMNAME>. Generate 30 alternate versions, ensuring 80% are entirely new and 20% are restructured versions of the original. Maintain equal or greater complexity, integrate practical scenarios, and provide detailed explanations."
        }
    ],
    "max_tokens": 36000,
    "temperature": 0.4,
    "top_p": 0.9,
    "stream": true
};

async function streamResponse() {
    try {
        const response = await axios.post(URL, payload, {
            headers: headers,
            responseType: 'stream'
        });

        const stream = new Readable();
        stream._read = () => {}; // _read is required but you can noop it
        stream.push(response.data);
        stream.push(null);

        stream.on('data', chunk => {
            console.log(chunk.toString('utf-8'));
        });

        stream.on('end', () => {
            console.log('Stream ended');
        });

    } catch (error) {
        console.error('Error making request:', error);
    }
}

streamResponse();
