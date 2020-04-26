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
  created() {
    const endTime = this.getEndTime()
    this.countdown(endTime)
  },
  data: function () {
    return {
      minutesRemaining: this.timerValue.minutes,
      secondsRemaining: this.timerValue.seconds,
    }
  },
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
      return ("0" + this.minutesRemaining).slice(-2)
    },
    seconds: function () {
      return ("0" + this.secondsRemaining).slice(-2)
    },
  },
  methods:  {
    getEndTime: function () {
      const now = Date.now()
      const expiry = now + this.timerValue.minutes * 60000
      return expiry
    },
    getTimeRemaining: function (endTime) {
      const t = endTime - Date.now()
      const seconds = Math.floor( (t/1000) % 60 )
      const minutes = Math.floor( (t/1000/60) % 60 )
      return {
        minutes,
        seconds,
      }
    },
    moveTheClock: function (that, endTime) {
      const { minutes, seconds } = that.getTimeRemaining(endTime)

      that.minutesRemaining = minutes
      that.secondsRemaining = seconds

      if(minutes === 0 && seconds === 0) {
        clearInterval(that.intervalTimer)
      }
    },
    countdown: function (endTime) {
      const that = this
      this.intervalTimer = setInterval(() => {
        that.moveTheClock(that, endTime)
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.intervalTimer)
  },
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