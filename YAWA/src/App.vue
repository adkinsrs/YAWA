<script setup lang="ts">

import { ref } from 'vue'

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import RowContainer from './components/RowContainer.vue'

/*
After debating on combining the two below lists to increase the number of possible answer words,
I decided to just use each list as intended. I feel that many of the allowed guessable words are
a bit obtuse and difficult to reasonably guess for the average player.

Maybe I can make a "hard" mode by combining both lists for the answer.
*/

/* CHANGES TO MOVE THINGS ALONG:
* Arrow button in place of enter key submit
* Random word and "play agaain" instead of daily reset
*/


// Possible answer words in Wordle
const wordleAnswersUrl = "https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/5d752e5f0702da315298a6bb5a771586d6ff445c/wordle-answers-alphabetical.txt"
// Guessable words in Wordle, excluding answer words
const wordleAllowedUrl = "https://gist.githubusercontent.com/cfreshman/cdcdf777450c5b5301e439061d29694c/raw/de1df631b45492e0974f7affe266ec36fed736eb/wordle-allowed-guesses.txt"

const wordAnswer = "steve"
const currentRound = ref(1)
const maxRounds = 6

</script>

<template>
  <header>
  <font-awesome-icon class="clear-left" icon="question-circle" />
  <h1>YAWA</h1>
  <font-awesome-icon class="clear-right" icon="signal" />
  <font-awesome-icon class="clear-right" icon="cog" />
  </header>
  <h2>(Yet Another Wordle App)</h2>
  <RowContainer v-for="n in 6" :key="n" :wordLen="5" :secretWord="wordAnswer"/>
  <p v-if="currentRound > maxRounds">You have run out of guesses. The correct answer is "{{wordAnswer.toUpperCase()}}"</p>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  display: inline;
  margin-left: 20px;
  margin-right: 20px;
}

.clear-left {
  clear: left;
}
.clear-right {
  clear: right;
}

</style>

