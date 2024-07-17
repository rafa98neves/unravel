<template>
  <section>
    <div class="space stars1" />
    <div class="space stars2" />
    <div class="space stars3" />
    <slot />
  </section>
</template>

<style scoped lang="scss">
section {
  position: relative;
  height: 100%;
  width: 100%;
}

.space {
  z-index: 0;
  position: fixed;
  background: transparent center / 300px 300px round;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  opacity: 0.5;
}

.stars1 {
  transform: rotate(30deg);
  animation: space 180s ease-in-out infinite;
  background-image: radial-gradient(1px 1px at 25px 5px, var(--un-c-white), transparent),
    radial-gradient(1px 1px at 50px 25px, var(--un-c-white), transparent),
    radial-gradient(1px 1px at 125px 20px, var(--un-c-white), transparent),
    radial-gradient(1.5px 1.5px at 50px 75px, var(--un-c-white), transparent),
    radial-gradient(2px 2px at 15px 125px, var(--un-c-white), transparent),
    radial-gradient(2.5px 2.5px at 110px 80px, var(--un-c-white), transparent);
}
.stars2 {
  transform: rotate(0deg);
  animation: space 240s ease-in-out infinite;
  background-image: radial-gradient(1px 1px at 75px 125px, var(--un-c-white), transparent),
    radial-gradient(1px 1px at 100px 75px, var(--un-c-white), transparent),
    radial-gradient(1.5px 1.5px at 199px 100px, var(--un-c-white), transparent),
    radial-gradient(2px 2px at 20px 50px, var(--un-c-white), transparent),
    radial-gradient(2.5px 2.5px at 100px 5px, var(--un-c-white), transparent),
    radial-gradient(2.5px 2.5px at 5px 5px, var(--un-c-white), transparent);
}
.stars3 {
  transform: rotate(40deg);
  animation: space 300s ease-in-out infinite;
  background-image: radial-gradient(1px 1px at 10px 10px, var(--un-c-white), transparent),
    radial-gradient(1px 1px at 150px 150px, var(--un-c-white), transparent),
    radial-gradient(1.5px 1.5px at 60px 170px, var(--un-c-white), transparent),
    radial-gradient(1.5px 1.5px at 175px 180px, var(--un-c-white), transparent),
    radial-gradient(2px 2px at 195px 95px, var(--un-c-white), transparent),
    radial-gradient(2.5px 2.5px at 95px 145px, var(--un-c-white), transparent);
}

@keyframes space {
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
