<template>
  <div class="wrapper">
    <div class="dynamic-content">
      <Timer v-show="showTimer" :timerValue="timerValue" />
      <button
        v-if="currentPhase === this.PHASES.BEFORE_THE_BELL"
        v-on:click="ringFirstBell">
        Ring the first bell (10 minutes to show time)
      </button>
      <div class="show-status" v-if="currentPhase === this.PHASES.SHOW_TIME">
        Show time!
      </div>
      <div class="show-status" v-if="currentPhase === this.PHASES.AFTER_THE_SHOW">
        The show is over
      </div>
      <button
        v-if="currentPhase === this.PHASES.SHOW_TIME"
        v-on:click="toggleCurtain">
        {{ curtainOpen ? 'Close' : 'Open' }} curtain
      </button>
      <button
        v-if="!curtainOpen && curtainWasOpen && currentPhase === this.PHASES.SHOW_TIME && this.currentAct < this.numberOfActs"
        v-on:click="startIntermission">
        Start intermission
      </button>
      <button
        v-if="!curtainOpen && curtainWasOpen && currentPhase === this.PHASES.SHOW_TIME && this.currentAct === this.numberOfActs"
        v-on:click="endShow">
        End the show
      </button>
    </div>
    <div class="statistics">
      <p>{{ totalClapCount }} claps received</p>
      <p>{{ peopleWatching }} people watching</p>
    </div>
  </div>
</template>

<script>
import { PHASES } from '../../src/constants'
import Timer from './Timer'

export default {
  name: 'DirectorView',
  components: {
    Timer,
  },
  created () {
    this.PHASES = PHASES
  },
  data: function () {
    return {
      peopleWatching: 42, // this will come from the backend
      curtainWasOpen: false, // backend + state
      numberOfActs: 2, // this will come from the backend as a part of "play definition"
    }
  },
  props: {
    curtainOpen: {
      type: Boolean,
    },
    showTimer: {
      type: Boolean,
    },
    totalClapCount: {
      type: Number,
    },
    currentPhase: {
      type: String,
    },
    currentAct: {
      type: Number,
    },
    timerValue: {
      type: Object,
    },
  },
  methods: {
    toggleCurtain: function () {
      this.curtainWasOpen = true
      // this method will call the backend instead of emitting event
      this.$emit('toggle-curtain')
    },
    ringFirstBell: function () {
      // this method will call the backend instead
      this.$emit('ring-first-bell')
    },
    startIntermission: function () {
      // this method will call the backend instead
      this.$emit('start-intermission')
      this.curtainWasOpen = false
    },
    endShow: function () {
      // this method will call the backend instead
      this.$emit('end-show')
    }
  },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statistics {
  padding: 16px;
}

p {
  padding: 8px;
}

.dynamic-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  height: 320px;
}

.show-status {
  padding: 16px;
  font-size: 36px;
}
</style>