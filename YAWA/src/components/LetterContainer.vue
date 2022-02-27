<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits<{ pushLetter: string }>()

let activeColor = "white"
let letter = ref('')

function isInCorrectPosition(letter:string, answerLetter:string) {
    if (letter == answerLetter) {
        return true
    }
    return false
}

function isInWord(letter:string, answerLetter:string) {
    if (letter in answerLetter.split('')) {
        // TODO: Work on considerations if letter is duplicated in guess
        return true
    }
    return false

}

function adjustContainer(letter:string, answerLetter:string) {
    if (isInWord(letter, answerLetter)) {
        activeColor = "yellow"
    } else if (isInCorrectPosition(letter, answerLetter)) {
        activeColor = "green"
    }
}

// Source: https://stackoverflow.com/a/52203434
const alphaOnly = (event:any) => {
    const key = event.data.toLowerCase()
    // If not a letter, return blank input
    if (!/[a-z]/i.test(key)) {
        event.target.value = ""
    }
};

</script>

<template>
    <input v-model="letter" @input="alphaOnly" @change="$emit('push-letter', letter)" :style="{ backgroundColor: activeColor }" type="text" maxlength="1" class="letter-container" />
</template>

<style scoped>
.letter-container {
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