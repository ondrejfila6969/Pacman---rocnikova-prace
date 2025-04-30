import { pacman } from "../../pacman/pacman.js";

const musicArray = [
  "../../res/audio/song1.mp3",
  "../../res/audio/song2.mp3",
  "../../res/audio/song3.mp3",
  "../../res/audio/song4.mp3",
  "../../res/audio/song5.mp3",
];
const audio = new Audio();

const playMusic = async () => {
  audio.pause();
  audio.src = musicArray[pacman.currentLevel - 1];
  audio.loop = true;
  audio.volume = 0.5;
  await new Promise((resolve) => {
    audio.addEventListener('loadeddata', resolve, { once: true });
  });
  audio.play();
};

export { musicArray, audio, playMusic };
