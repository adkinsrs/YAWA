<script setup lang="ts">
import { computed, ref } from 'vue'
import LetterContainer from "./LetterContainer.vue"

const props = defineProps<{ wordLen:number, secretWord:string, allWords:Array<string> }>()
const emit = defineEmits<{ (e: "winGame"):void }>()

const secretWordArray = props.secretWord.split("")

let guessedWordArray = new Array(props.wordLen).fill("")
let guessedWord:string
let remaining:string = ""
const disabled = ref(false)
const borderColor = ref("transparent")

let inWord = new Array(props.wordLen).fill(false)
let correctPosition = new Array(props.wordLen).fill(false)
let letterColors = ref(Array(props.wordLen).fill(''))

function isWordValid() {
    props.allWords.push("steve")    //TODO: Remove
    // if word is not in master list of guessable words, return false
    if (props.allWords.includes(guessedWord)) { return true }
    return false
}

function adjustLetterColors() {
    // Create array to determine final color of each guessed letter
    for (let i = 0; i < props.wordLen; i++) {
        if (inWord[i]) { letterColors.value[i] = "Y"}
        if (correctPosition[i]) { letterColors.value[i] = "G"}
        if (!(inWord[i] || correctPosition[i])) {letterColors.value[i] = "N"}

    }
}

function guessWord() {
    guessedWord = buildGuessedWord();
    if (guessedWord.length !== props.wordLen) {return}
    if (!(isWordValid())) {
        borderColor.value = "red"
        return
    }    // Also flash some red "not valid word" text
    borderColor.value = "transparent"
    disabled.value = true
    if (isGuessCorrect(guessedWord, props.secretWord)) {
        // Highlight all greens
        letterColors.value = letterColors.value.fill("G")
        // TODO: Return we won! (emit)
        return;
    }
    // Did not win... update letter info
    determineCorrectPosition();
    eliminateCorrectLetters();
    determineIfInWord();
    adjustLetterColors();
    // TODO: Emit round increase (which will disable current row and enable next row)
}

function buildGuessedWord() {
    // Build guessed word
    return guessedWordArray.join("")
}

function isGuessCorrect(guess:string, answer:string) {
  if (guess.toUpperCase() === answer.toUpperCase()) {
    return true
  }
  return false
}

// Eliminate correct letters from secret word so we can correctly count guessed letters in word, where letter frequency is not 1-to-1
function eliminateCorrectLetters() {
    for (let i = 0; i < props.wordLen; i++) {
        if (!(correctPosition[i])) {
            remaining += secretWordArray[i]
        }
    }
}

// Make note if guessed letter is in correct position within the answer
function determineCorrectPosition() {
    const guessArr = guessedWord.toUpperCase().split('')
    for (let i = 0; i < props.wordLen; i++) {
        correctPosition[i] = guessArr[i] === secretWordArray[i]
    }
}

// Make note if guessed letter is in word but not in the right position
function determineIfInWord() {
    const guessArr = guessedWord.toUpperCase().split('')
    const remainingArr = remaining.split('')
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
    remaining = remainingArr.join('')
}

</script>

<template>
    <div class="row-container" :style="{ borderColor: borderColor }">
        <LetterContainer @push-letter="(l) => guessedWordArray[n-1] = l" v-for="n in wordLen" :key="n" :letterColor="letterColors[n-1]" :disabled="disabled" />
        <button @click="guessWord()"><font-awesome-icon class="clear-right" icon="arrow-left" /></button>
    </div>
    <br>
</template>

<style scoped>
.row-container {
    border-style: solid;
    border-width: 3px;
    display:inline-block;
    margin: 5px;
}

button {
    background-color:lightblue;
    color: black;
    cursor: pointer;
    border:  3px solid gray;
    border-radius: 10px;
    font-size:48px;
    margin: 5px;
    text-align:center;
}
</style>