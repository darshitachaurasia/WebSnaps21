import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

const loader = YoutubeLoader.createFromUrl("https://youtu.be/fdYbf-22TWE?si=zfVhiwbqSpMIMVL9", {
  language: "en",
  addVideoInfo: true,
});

const docs = await loader.load();

console.log(docs);