<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ letterColor: string}>()
const emits = defineEmits<{ pushLetter: string }>()

let activeColor = "white"
let letter = ref('')

const adjustContainer = computed( () => {
    // Change color of letter
    if (props.letterColor === "Y") { activeColor = "yellow" }
    if (props.letterColor === "G") { activeColor = "green" }
});

// Source: https://stackoverflow.com/a/52203434
const alphaOnly = (event:any) => {
    const key = event.data!.toLowerCase()
    // If not a letter, return blank input
    if (!(key && /[a-z]/i.test(key))) {
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