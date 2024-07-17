<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToUniverse() {
  router.push({ name: 'universe' })
}

function createUniverse() {}
</script>

<template>
  <div class="c-WelcomeMenu">
    <div class="c-WelcomeMenu__wrapper">
      <h1>
        <span> Welcome to </span>
        Unravel
      </h1>

      <p>Discover your tech architecture in a universe of interconnected systems.</p>

      <button class="btn" @click="goToUniverse">Load universe</button>
      <button class="btn" @click="createUniverse" disabled>Create Universe</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-WelcomeMenu {
  z-index: -1;
  display: flex;
  flex-direction: column;
  align-items: end;
  background-color: var(--un-c-pitch-black);
  background-image: url('/planet.jpg');
  background-repeat: no-repeat;
  background-position-x: -720px;
  height: 100%;

  @media screen and (max-width: 1024px) {
    background-image: none;
  }

  p {
    max-width: 30rem;
    font-weight: 100;
    padding-bottom: 1rem;
    opacity: 0.8;
    text-align: center;
  }

  &__wrapper {
    z-index: 1;
    display: flex;
    flex-direction: column;
    margin-right: 10vw;
    align-items: center;
    gap: 1rem;
    padding-top: max(20vh, 5rem);
    margin-left: auto;

    @media screen and (max-width: 920px) {
      text-align: center;
      margin-right: 0;
      padding-left: 5rem;
      padding-right: 5rem;
    }

    h1 {
      text-transform: uppercase;
      letter-spacing: 0.5rem;
      font-size: 1.7rem;
      font-weight: 500;

      span {
        font-weight: 300;
        opacity: 0.3;
      }

      @media screen and (max-width: 1024px) {
        text-align: center;
      }
    }

    button {
      width: 50%;
    }
  }
}
</style>
