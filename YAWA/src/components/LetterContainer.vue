<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{ letterColor: string }>()
const emit =
  defineEmits<{
    (e: "pushLetter", value: string): void
   (e:"focusNext"): void
   (e:"focusPrev"): void
 }>()

const letter = ref("")

const adjustContainer = computed((): string => {
  // Change color of letter
  if (props.letterColor === "Y") {
    return "yellow"
  }
  if (props.letterColor === "G") {
    return "limegreen"
  }
  if (props.letterColor === "N") {
    return "lightgrey"
  }
  // Letter is not right
  return "white"
})

// Source: https://stackoverflow.com/a/52203434
const alphaOnly = (event: any) => {
  // Delete letter and shift tab focus to the previous letter if backspace is pressed
  if (event.key === "Backspace") {
    emit("pushLetter", letter.value)
    emit("focusPrev")
    return
  }

  if (!event.data) {
    return
  }
  const key = event.data.toLowerCase()
  // If not a letter, return blank input
  if (!(key && /[a-z]/i.test(key))) {
    event.target.value = ""
    return
  }
  // Valid letter, push to letter array and shift tab focus to the next letter
  emit("pushLetter", letter.value)
  emit("focusNext")
}

</script>

<template>
  <input
    v-model="letter"
    @input="alphaOnly"
    @keydown.backspace="alphaOnly"
    :style="{ backgroundColor: adjustContainer }"
    type="text"
    maxlength="1"
    class="letter-container"
  />
</template>

<style scoped>
.letter-container {
  color: black;
  border: 3px solid gray;
  border-radius: 10px;
  font-size: 48px;
  height: 50px;
  width: 50px;
  margin: 5px;
  text-transform: uppercase;
  text-align: center;
  pointer-events: none; /* Disable interactivity except with keyboard - Much like real Wordle */
  caret-color: transparent; /* Disable cursor - Much like real Wordle */
}
</style>