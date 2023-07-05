import { Client } from "whatsapp-web.js";
import { Configuration, OpenAIApi } from "openai";
import qrcode from "qrcode-terminal";
import "dotenv/config.js";

const client = new Client();

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	console.log(`Client is ready!`);
});

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runCompletion(message) {
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: message,
		max_tokens: 200,
	});
	return completion.data.choices[0].text;
}

client.on("message", async (message) => {
	if (message.body == "Assalamualaikum") {
		message.reply("Waalaikumsalam");
	}
	if (message.body.startsWith("!ai")) {
		console.log(message.body);
		const response = await runCompletion(message.body);
		message.reply(response);
	}
});

client.initialize();