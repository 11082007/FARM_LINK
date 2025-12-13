const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1024,
    },
  });

  async function askAndRespond() {
    rl.question("You: ", async (msg) => {
      if (msg.toLowerCase() === "exit") {
        rl.close();
      } else {
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = await response.text();
        console.log("AI: " + text);
        askAndRespond();
      }
    });
  }

  askAndRespond();
}
run();
