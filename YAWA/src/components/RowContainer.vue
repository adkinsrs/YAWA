<script setup lang="ts">
import { computed, ref } from 'vue'
import LetterContainer from "./LetterContainer.vue"

const props = defineProps<{ wordLen:number, secretWord:string }>()

let guessedWord: string
let guessedWordArray = new Array(5).fill("")
let remaining = ref("")

let inWord = new Array(5).fill(false)
let correctPosition = new Array(5).fill(false)

const buildGuessedWord = computed(() => {
    // Build guessed word
    return guessedWordArray.join("")
});

function guessWord() {
    buildGuessedWord
    if (guessedWord.length !== props.wordLen) {return}
    if (isWordValid()) {return}    // Also flash some red "not valid word" text
    if (isGuessCorrect(guessedWord, props.secretWord)) {
        // Highlight all greens
        // Return we won!
        return;
    }
    // Did not win... update letter info
    determineCorrectPosition();
    eliminateCorrectLetters();
    determineIfInWord();

}

function isGuessCorrect(guess:string, answer:string) {
  if (guess.toUpperCase() === answer.toUpperCase()) {
    return true
  }
  return false
}

function isWordValid() {
    // if word is not in master list of guessable words, return false
    return true
}

function updateCorrectPosition() {
    return correctPosition.map(l => l.isInCorrectPosition())
}


// Eliminate correct letters from secret word so we can correctly count guessed letters in word, where letter frequency is not 1-to-1
function eliminateCorrectLetters() {
    const secretArr = props.secretWord.toUpperCase().split('')
    for (let i = 0; i < props.wordLen; i++) {
        if (correctPosition[i]) {
            remaining.value += secretArr[i]
        }
    }
}

// Make note if guessed letter is in correct position within the answer
function determineCorrectPosition(){
    const guessArr = guessedWord.toUpperCase().split('')
    const secretArr = props.secretWord.toUpperCase().split('')
    for (let i = 0; i < props.wordLen; i++) {
        correctPosition[i] = guessArr[i] === secretArr[i]
    }
}

// Make note if guessed letter is in word but not in the right position
function determineIfInWord(){
    const guessArr = guessedWord.toUpperCase().split('')
    const secretArr = props.secretWord.toUpperCase().split('')
    const remainingArr = remaining.value.split('')
    for (let i = 0; i < props.wordLen; i++) {
        // IF letter is in word but not in correct position...
        if (guessArr[i] !== secretArr[i] && remainingArr.includes(guessArr[i])) {
            inWord[i] = true
            // Remove occurrence of letter from remaining letters,
            // so guessed letter is not double-counted in the word
            const index = remainingArr.indexOf(guessArr[i]);
            remainingArr.splice(index, 1)
        }
    }
    remaining.value = remainingArr.join('')
}

</script>

<template>
    <div class="row-container">
        <LetterContainer @push-letter="(l) => guessedWordArray[n] = l" v-for="n in wordLen" :key="n"  />
        <button @click="guessWord()"><font-awesome-icon class="clear-right" icon="arrow-left" /></button>
    </div>
</template>

<style scoped>
.row-container {
    margin: 5px;
}
</style>