<script setup lang="ts">
import { ref } from "vue"
import LetterContainer from "./LetterContainer.vue"

const props =
  defineProps<{
    wordLen: number
    secretWord: string
    allWords: Array<string>
    rowIndex: number
    isCurrentRound: boolean
  }>()
const emit = defineEmits<{
  (e: "winGame", value: boolean): void
  (e: "increaseRound", value: number): void
}>()

const guessedWordArray = new Array(props.wordLen).fill("")
let guessedWord: string
let remaining: string = ""
const letterDisabled = ref(false)
const borderColor = ref("transparent")

let inWord = new Array(props.wordLen).fill(false)
let correctPosition = new Array(props.wordLen).fill(false)
let letterColors = ref(Array(props.wordLen).fill(""))

const isWordValid = () => {
  // if word is not in master list of guessable words, return false
  if (props.allWords.includes(guessedWord)) {
    return true
  }
  return false
}

const adjustLetterColors = () =>{
  // Create array to determine final color of each guessed letter
  for (let i = 0; i < props.wordLen; i++) {
    if (inWord[i]) {
      letterColors.value[i] = "Y"
    }
    if (correctPosition[i]) {
      letterColors.value[i] = "G"
    }
    if (!(inWord[i] || correctPosition[i])) {
      letterColors.value[i] = "N"
    }
  }
}

const guessWord = () => {
  guessedWord = buildGuessedWord()
  if (guessedWord.length !== props.wordLen) {
    return
  }
  if (!isWordValid()) {
    borderColor.value = "red"
    return
  } // Also flash some red "not valid word" text
  borderColor.value = "transparent"
  letterDisabled.value = true
  if (isGuessCorrect(guessedWord, props.secretWord)) {
    // Highlight all greens
    letterColors.value = letterColors.value.fill("G")
    // TODO: Return we won! (emit)
    emit("winGame", true)
    return
  }
  // Did not win... update letter info
  emit("winGame", false)
  emit("increaseRound", 1)

  determineCorrectPosition()
  eliminateCorrectLetters()
  determineIfInWord()
  adjustLetterColors()
  // TODO: Emit round increase (which will disable current row and enable next row)
}

const  buildGuessedWord = () => {
  // Build guessed word
  return guessedWordArray.join("").toLowerCase()
}

const isGuessCorrect = (guess: string, answer: string) => {
  if (guess.toUpperCase() === answer.toUpperCase()) {
    return true
  }
  return false
}

// Eliminate correct letters from secret word so we can correctly count guessed letters in word, where letter frequency is not 1-to-1
const eliminateCorrectLetters = () => {
  const secretWordArray = props.secretWord.split("") // For some reason I cannot make this a reactive top-level variable
  for (let i = 0; i < props.wordLen; i++) {
    if (!correctPosition[i]) {
      remaining += secretWordArray[i]
    }
  }
}

// Make note if guessed letter is in correct position within the answer
const determineCorrectPosition = () => {
  const guessArr = guessedWord.toUpperCase().split("")
  const secretWordArray = props.secretWord.split("") // For some reason I cannot make this a reactive top-level variable
  for (let i = 0; i < props.wordLen; i++) {
    correctPosition[i] = guessArr[i] === secretWordArray[i]
  }
}

// Make note if guessed letter is in word but not in the right position
const determineIfInWord = () => {
  const guessArr = guessedWord.toUpperCase().split("")
  const remainingArr = remaining.split("")
  const secretWordArray = props.secretWord.split("") // For some reason I cannot make this a reactive top-level variable
  for (let i = 0; i < props.wordLen; i++) {
    // IF letter is in word but not in correct position...
    if (
      guessArr[i] !== secretWordArray[i] &&
      remainingArr.includes(guessArr[i])
    ) {
      inWord[i] = true
      // Remove occurrence of letter from remaining letters,
      // so guessed letter is not double-counted in the word
      const index = remainingArr.indexOf(guessArr[i])
      remainingArr.splice(index, 1)
    }
  }
  remaining = remainingArr.join("")
}

const setFocusOnNextLetter = (i: number) =>{
  // If we're at the end of the row, do nothing
  if (i === props.wordLen) {
    return
  }
  // If we're not at the end of the row, get focus on next letter-container by tabbing
  // NOTE: Tried to do this using template refs but had difficulty.
  const nextRow = document.getElementsByClassName("row-container")[props.rowIndex] as HTMLElement
  const nextLetterContainer = nextRow.getElementsByClassName("letter-container")[i] as HTMLElement
  nextLetterContainer.focus()
}

const setFocusOnPrevLetter = (i: number) => {
  // If we're at the beginning of the row, do nothing
  if (i === 1) {
    return
  }
  // If we're not at the beginning of the row, get focus on previous letter-container by tabbing
  const prevRow = document.getElementsByClassName("row-container")[props.rowIndex] as HTMLElement
  const prevLetterContainer = prevRow.getElementsByClassName("letter-container")[i - 2] as HTMLElement
  prevLetterContainer.focus()
}

</script>

<template>
  <div
    class="row-container"
    :style="{ borderColor: borderColor }"
    @keyup.enter="guessWord()"
  >
    <LetterContainer
      @push-letter="(l) => (guessedWordArray[n - 1] = l)"
      @focus-next="setFocusOnNextLetter(n)"
      @focusPrev="setFocusOnPrevLetter(n)"
      v-for="n in wordLen"
      :key="n"
      :letterColor="letterColors[n - 1]"
      :letterIndex="n - 1"
      :disabled="!props.isCurrentRound"

    />
  </div>
  <br />
</template>

<style scoped>
.row-container {
  border-style: solid;
  border-width: 3px;
  display: inline-block;
  margin: 5px;
}

button {
  background-color: lightblue;
  color: black;
  cursor: pointer;
  border: 3px solid gray;
  border-radius: 10px;
  font-size: 48px;
  margin: 5px;
  text-align: center;
}
</style>