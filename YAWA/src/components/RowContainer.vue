<script setup lang="ts">
import { computed, ref } from 'vue'
import LetterContainer from "./LetterContainer.vue"

const props = defineProps<{ wordLen:number, secretWord:string, allWords:Array<string> }>()

const secretWordArray = props.secretWord.split("")

let guessedWord: string
let guessedWordArray = new Array(5).fill("")
let remaining = ref("")

let inWord = new Array(props.wordLen).fill(false)
let correctPosition = new Array(props.wordLen).fill(false)
let letterColors = new Array(props.wordLen).fill('')

const buildGuessedWord = computed(() => {
    // Build guessed word
    return guessedWordArray.join("")
});

const adjustLetterColors = computed(() => {
    // Create array to determine final color of each guessed letter
    for (let i = 0; i < props.wordLen; i++) {
        if (inWord[i]) { letterColors[i] = "Y"}
        if (correctPosition[i]) { letterColors[i] = "G"}
    }
});

const isWordValid = computed(() => {
    // if word is not in master list of guessable words, return false
    if (props.allWords.includes(guessedWord)) { return true }
    return false
});

function guessWord() {
    buildGuessedWord;
    if (guessedWord.length !== props.wordLen) {return}
    if (isWordValid) {return}    // Also flash some red "not valid word" text
    if (isGuessCorrect(guessedWord, props.secretWord)) {
        // Highlight all greens
        letterColors = letterColors.fill("G")
        // TODO: Return we won! (emit)
        return;
    }
    // Did not win... update letter info
    determineCorrectPosition;
    eliminateCorrectLetters;
    determineIfInWord;
    adjustLetterColors;
    // TODO: Emit round increase (which will disable current row and enable next row)
}

function isGuessCorrect(guess:string, answer:string) {
  if (guess.toUpperCase() === answer.toUpperCase()) {
    return true
  }
  return false
}

// Eliminate correct letters from secret word so we can correctly count guessed letters in word, where letter frequency is not 1-to-1
const eliminateCorrectLetters = computed(() => {
    for (let i = 0; i < props.wordLen; i++) {
        if (correctPosition[i]) {
            remaining.value += secretWordArray[i]
        }
    }
});

// Make note if guessed letter is in correct position within the answer
const determineCorrectPosition = computed(() => {
    const guessArr = guessedWord.toUpperCase().split('')
    for (let i = 0; i < props.wordLen; i++) {
        correctPosition[i] = guessArr[i] === secretWordArray[i]
    }
});

// Make note if guessed letter is in word but not in the right position
const determineIfInWord = computed(() => {
    const guessArr = guessedWord.toUpperCase().split('')
    const remainingArr = remaining.value.split('')
    for (let i = 0; i < props.wordLen; i++) {
        // IF letter is in word but not in correct position...
        if (guessArr[i] !== secretWordArray[i] && remainingArr.includes(guessArr[i])) {
            inWord[i] = true
            // Remove occurrence of letter from remaining letters,
            // so guessed letter is not double-counted in the word
            const index = remainingArr.indexOf(guessArr[i]);
            remainingArr.splice(index, 1)
        }
    }
    remaining.value = remainingArr.join('')
});

</script>

<template>
    <div class="row-container">
        <LetterContainer @push-letter="(l) => guessedWordArray[n] = l" v-for="n in wordLen" :key="n" :letterColor="letterColors[n]" />
        <button @click="guessWord()"><font-awesome-icon class="clear-right" icon="arrow-left" /></button>
    </div>
</template>

<style scoped>
.row-container {
    margin: 5px;
}

button {
    color: black;
    border:  3px solid gray;
    border-radius: 10px;
    font-size:48px;
    height: 50px;
    width: 50px;
    margin: 5px;
    text-transform: uppercase;
    text-align:center;
}
</style>