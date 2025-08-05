import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

// 1. Setup LLM (OpenAI GPT)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",  // Or gemini-2.5-flash
  temperature: 0.5,           // More creative for jokes
  apiKey: process.env.GOOGLE_API_KEY, // Make sure your key is in .env
});

// 2. Reference post text (copy your reference tweet here)
const referencePost = `
the first thing i'd do is find a niche in which:

- money is flowing (e.g. saas, ecom, infoproducts, yt automation)
- problems exist that i believe are solvable by AI

ideally you'll already have some sort of niche-specific expertise, but i'm assuming a lot of you don't - in that case you've got to start digging & uncover where the money is being made

& don't take gurus word for it, they'll tell you what they want you to believe

instead - follow the money...

what are creators selling? which ads are perfoming well?

once you picked that vertical, dive deep into that world...

- learn about the industry
- sign up to free & paid communities
- listen to interviews/podcasts
- follow people in that niche on twitter, ig, etc.

you have to dive deep, you must understand this niche like it's the back of your hand...

notice how i haven't said anything about using AI yet?

there's a very important reason for that - you need niche expertise in a profitable vertical to be able to use AI to solve peoples problems

now, get your notepad out...

scavenge the internet & everything you've signed up for so far to collect the most significant list of pain points that people in these verticals are facing

rank them by how often they come up - then identify ways to solve them with AI

find a couple ways for every pain point

sit on this list for a while & deeply think about what the best one to sell is

envision the solution as a sales page & how you'd sell it

don't just consider which pain point is the biggest or easiest to fix - consider which one is the the most marketable too

now that you've picked a problem to solve - it's time to lock yourself in a dark room and find every way possible to solve that problem...

> talk to people within the communities you joined
> give them access for free
> ask them to give you honest thoughts
> build it together

once you've got a product everyone is happy with, it's time for the SELLING

`;

// 3. Prompt template
const template = `
You are a social media writer.

Here is a reference post style:
"{reference_post}"

Now, write a similar post for this topic:
"{topic}"

Rules:
- Keep tone and style same as reference.

`;

const prompt = new PromptTemplate({
  template,
  inputVariables: ["reference_post", "topic"]
});

// 4. Generate tweet
async function generatePost(topic) {
  const formattedPrompt = await prompt.format({
    reference_post: referencePost,
    topic: topic
  });

  const result = await llm.invoke(formattedPrompt);
  console.log("\nGenerated Twitter Post:\n");
  console.log(result.content);
}

// Example usage:
generatePost(" Sales v/s Marketing");
