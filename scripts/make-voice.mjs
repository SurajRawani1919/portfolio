import { writeFileSync } from "fs";
import { EdgeTTS } from "edge-tts-universal";

// Clear, professional intro — acronyms expanded so TTS speaks cleanly.
const text =
  "Hello. I am Suraj Kumar Rawani, an A.I. and Machine Learning Engineer. " +
  "I build Generative A.I. applications, retrieval-augmented generation pipelines, " +
  "and large language model evaluation systems. " +
  "Welcome to my portfolio — I am glad you are here.";

// Clear Indian-English male voice, spoken a bit slower for clarity.
const voice = "en-IN-PrabhatNeural";

const tts = new EdgeTTS(text, voice, {
  rate: "-8%",
  pitch: "-2Hz",
  volume: "+0%",
});

const result = await tts.synthesize();
const audio = Buffer.from(await result.audio.arrayBuffer());
writeFileSync("public/media/intro-voice.mp3", audio);
console.log("Wrote intro-voice.mp3", audio.length, "bytes");
console.log("Script:", text);
