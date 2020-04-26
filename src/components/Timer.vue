<template>
  <div :class="[{ 'timer-wrapper-absolute': absolute }]">
    <div :class="['timer', { 'timer-light': light }]">
      <div class="minutes">{{ minutes }}</div>
      <div class="colon">:</div>
      <div class="seconds">{{ seconds }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    timerValue: {
      type: Object,
    },
    absolute: {
      type: Boolean,
    },
    light: {
      type: Boolean,
    },
  },
  computed: {
    minutes: function () {
      return ("0" + this.timerValue.minutes).slice(-2)
    },
    seconds: function () {
      return ("0" + this.timerValue.seconds).slice(-2)
    },
  }
}
</script>

<style>
.timer-wrapper-absolute {
  position: absolute;
  top: 100px;
  display: flex;
  justify-content: center;
  z-index: 3;
  width: 100%;
}

.timer {
  display: flex;
  margin: 24px;
  border-radius: 8px;
  background-color: black;
  color: white;
}

.timer-light {
  background-color: white;
  color: black;
}

.minutes,
.seconds,
.colon {
  font-size: 48px;
}

.minutes,
.seconds {
  padding: 24px 16px;
}

.colon {
  padding: 24px 0;
}
</style>