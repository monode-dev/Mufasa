<template>
  <div class="container">
    <div ref="text1" class="text">T 1</div>
    <div ref="text2" class="text">T 2</div>
    <div ref="text3" class="text">T 3</div>
  </div>
  <div class="container-2">
    <div class="text"></div>
    <div ref="box" class="box"></div>
    <div class="text"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'

const box = ref<HTMLElement | null>(null)
const text1 = ref<HTMLElement | null>(null)
const text2 = ref<HTMLElement | null>(null)
const text3 = ref<HTMLElement | null>(null)

const duration = 0.25;
const moveBox = () => {
  gsap.to(box.value, {
    delay: 1,
    duration: duration,
    x: text3.value!.offsetLeft - text2.value!.offsetLeft,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to(box.value, {
        delay: 1,
        duration: duration,
        x: text2.value!.offsetLeft - text3.value!.offsetLeft,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(box.value, {
            delay: 1,
            duration: duration,
            x: 0,
            ease: 'power1.inOut',
            onComplete: moveBox
          })
        }
      })
    }
  })
}

onMounted(() => {
  moveBox()
})
</script>

<style>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3rem;
  width: 100%;
  background-color: red;
}

.container-2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 1rem;
  width: 100%;
  background-color: red;
}

.text {
  width: 5rem;
  background-color: green;
  text-align: center;
  font-size: 2rem;
}

.box {
  position: relative;
  width: 5rem;
  height: 0.125rem;
  background-color: blue;
}
</style>