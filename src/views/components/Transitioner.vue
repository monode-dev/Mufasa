<script setup lang="ts">
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { gsap } from "gsap";

function getEnterFromRoute(route: RouteLocationNormalizedLoaded) {
  console.log(route.path);
  if (route.path === '/home') {
    return async function (el: HTMLElement, done: () => void) {
      // Wait for a half second then call done
      await new Promise((resolve) => setTimeout(resolve, 2000));
      done();
    };
  } else if (route.path === '/home/settings') {
    return function (el: HTMLElement, done: () => void) {
      gsap.from(el, {
        duration: 2,
        opacity: 0,
        // transform: `translateY(50vh)`,
        ease: 'power1.out',
        onComplete: done,
      });
    };
  } else {
    return function (el: HTMLElement, done: () => void) { done(); };
  }
}
function getLeaveFromRoute(route: RouteLocationNormalizedLoaded) {
  if (route.path === '/home') {
    return async function (el: HTMLElement, done: () => void) {
      // Wait for a half second then call done
      await new Promise((resolve) => setTimeout(resolve, 2000));
      done();
    };
  } else if (route.path === '/home/settings') {
    return function (el: HTMLElement, done: () => void) {
      gsap.to(el, {
        duration: 2,
        opacity: 0,
        // transform: `translateY(50vh)`,
        ease: 'power1.out',
        onComplete: done,
      });
    };
  } else {
    return function (el: HTMLElement, done: () => void) { done(); };
  }
}
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition
      @duration="2"
      appear
      @enter="getEnterFromRoute(route)"
      @leave="getLeaveFromRoute(route)"
    >
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>