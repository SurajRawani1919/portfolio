import { writeFileSync } from "fs";
import { EdgeTTS } from "edge-tts-universal";

const text =
  "Hi, I'm Suraj Kumar Rawani, an AI and Machine Learning Engineer. I build Generative AI applications, RAG pipelines, and LLM evaluation systems. Welcome to my portfolio.";

const voice = "en-IN-PrabhatNeural"; // Indian English male

const tts = new EdgeTTS(text, voice, {
  rate: "+2%",
  pitch: "+0Hz",
  volume: "+0%",
});

const result = await tts.synthesize();
const audio = Buffer.from(await result.audio.arrayBuffer());
writeFileSync("public/media/intro-voice.mp3", audio);
console.log("Wrote intro-voice.mp3", audio.length, "bytes");
