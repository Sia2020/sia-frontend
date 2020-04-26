<template>
  <div id="app">
    <div class="toggle-wrapper">
      <input type="checkbox" class="checkbox" v-model="loggedInAsDirector">
      <label for="checkbox">see director's view</label>
    </div>
    <div class="views-wrapper">
      <Stage
        class="separate-view stage-view"
        :currentAct="currentAct"
        :currentPhase="currentPhase"
        :curtainOpen="curtainOpen"
        :loggedInAsDirector="loggedInAsDirector"
        :timerValue="timerValue"
        :showTimer="showTimer"
        v-on:clap="increaseClapCount" />
      <transition name="view-fade" mode="out-in">
        <component
          class="separate-view"
          :currentAct="currentAct"
          :currentPhase="currentPhase"
          :curtainOpen="curtainOpen"
          :showTimer="showTimer"
          :timerValue="timerValue"
          :totalClapCount="totalClapCount"
          v-on:toggle-curtain="toggleCurtain"
          v-on:start-intermission="startIntermission"
          v-on:end-show="endShow"
          v-on:ring-first-bell="ringFirstBell"
          v-bind:is="currentViewComponent" />
      </transition>
    </div>
  </div>
</template>

<script>
// TODO: this will be "play" view later on
import { PHASES, ROLES, SOCKET_EVENTS } from './constants'
import Stage from './components/Stage.vue'
import DirectorView from './components/DirectorView.vue'
import SpectatorView from './components/SpectatorView.vue'

export default {
  name: 'App',
  components: {
    Stage,
    DirectorView,
    SpectatorView,
  },
  created () {
    this.PHASES = PHASES,
    this.ROLES = ROLES
    this.$options.sockets.onmessage = ({ data }) => this.onWebsocketMessage(data)
  },
  data: function () {
    return {
      // all this will be coming from the backend in real time
      curtainOpen: false,
      totalClapCount: 0,
      currentPhase: PHASES.BEFORE_THE_BELL, // backend + director view state
      currentAct: 1, // backend + director view state
      loggedInAsDirector: false, // depends on which user is logged in
    }
  },
  computed: {
    currentViewComponent: function () {
      return this.loggedInAsDirector ? DirectorView : SpectatorView
    },
    showTimer: function () {
      if (this.currentPhase === PHASES.AFTER_THE_BELL || this.currentPhase === PHASES.INTERMISSION) {
        return true
      }
      return false
    },
    timerValue: function () { // this will come from the backend every second - format TBD
      return {
        minutes: this.currentPhase === PHASES.INTERMISSION ? 20 : 10,
        seconds: 0,
      }
    }
  },
  methods: {
    onWebsocketMessage: function (event) {
      console.log(event)
      switch(event) {
        case SOCKET_EVENTS.CLAP:
          this.increaseClapCount()
          break;
        case SOCKET_EVENTS.OPEN_CURTAIN:
          this.curtainOpen = true
          break;
        case SOCKET_EVENTS.CLOSE_CURTAIN:
          this.curtainOpen = false
          break;
        case SOCKET_EVENTS.RING_BELL:
          this.ringFirstBell()
          break;
        case SOCKET_EVENTS.START_INTERMISSION:
          this.currentPhase = PHASES.INTERMISSION
          break;
        case SOCKET_EVENTS.END_PLAY:
          this.currentPhase = PHASES.AFTER_THE_SHOW
          break;
      }
    },
    // all these methods will be removed once we have backend connected
    toggleCurtain: function () {
      this.curtainOpen = !this.curtainOpen
    },
    increaseClapCount: function () {
      this.totalClapCount++
    },
    ringFirstBell: function () {
      this.currentPhase = PHASES.AFTER_THE_BELL
      const that = this
      this.bellTimeout = setTimeout(function () {
        that.currentPhase = PHASES.SHOW_TIME
      }, 5000)
    },
    startIntermission: function () {
      this.currentPhase = PHASES.INTERMISSION
      const that = this
      if (this.intermissionTimeout) {
        clearTimeout(this.intermissionTimeout)
      }
      this.intermissionTimeout = setTimeout(function () {
        that.currentPhase = PHASES.SHOW_TIME
        that.currentAct++
      }, 5000)
    },
    endShow: function () {
      this.currentPhase = PHASES.AFTER_THE_SHOW
    },
  },
  destroyed() {
    clearTimeout(this.bellTimeout)
    clearTimeout(this.intermissionTimeout)
    delete this.$options.sockets.onmessage
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}

.views-wrapper {
  display: flex;
  width: 100%;
}

.stage-view {
  width: 50%;
}

.separate-view {
  height: 100vh;
  flex-grow: 1;
  flex-shrink: 1;
  width: 0; /* needed for smooth transition back from full-screen */
  /* border: solid 1px black; */
}

.toggle-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 24px;
  background-color: white;
  z-index: 2;
}

.checkbox {
  margin-right: 16px;
}

/* view appearance animation */
.view-fade-enter-active {
  animation: fade-in-animation 0.5s;
}
.view-fade-leave-active {
  animation: fade-in-animation 0.2s reverse;
}

@keyframes fade-in-animation {
  0% {
    opacity: 0;
  }
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
