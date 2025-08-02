import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.5
});

const response = await llm.invoke([{role:"user",content:"Hi,how are you"}])
console.log(response)

//await llm.invoke([{ role: "user", content: "Hi im bob" }]);