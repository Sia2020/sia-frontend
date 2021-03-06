<template>
  <div id="app">
    <div class="toggle-wrapper">
      <input type="checkbox" class="checkbox" v-model="loggedInAsDirector">
      <label for="checkbox">see director's view</label>
    </div>
    <div class="modal" v-if="modalOpen">
      <button v-on:click="closeModal" class="modal-close-btn">X</button>
      <h1 class="modal-h1">This is the MVP of SIA theater view.</h1>
      <p class="modal-p">To fully enjoy it, please do the following:</p>
      <ul class="modal-ul">
        <li class="modal-li">on one computer, open this page and check "see director's view" checkbox. It's important that you only do this on a single computer (a play has a single director)</li>
        <li class="modal-li">on another computer, or multiple computers, open this page as the audience and wait for the director's moves. Don't forget to clap in the right moments!</li>
      </ul>
      <p class="modal-p">If something doesn't work, it's possible that somebody else is also "directing". For now we have a single play only and everyone who opens this page is connected through the same backend.</p>
      <button v-on:click="closeModal">Go to SIA theater</button>
    </div>
    <div class="views-wrapper">
      <Stage
        class="separate-view stage-view"
        :currentAct="currentAct"
        :currentPhase="currentPhase"
        :curtainOpen="curtainOpen"
        :loggedInAsDirector="loggedInAsDirector"
        :timerEnd="timerEnd"
        :showTimer="showTimer"
        v-on:clap="increaseClapCount" />
      <transition name="view-fade" mode="out-in">
        <component
          class="separate-view"
          :currentAct="currentAct"
          :currentPhase="currentPhase"
          :curtainOpen="curtainOpen"
          :showTimer="showTimer"
          :timerEnd="timerEnd"
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
      modalOpen: true,
      curtainOpen: false,
      totalClapCount: 0,
      currentPhase: PHASES.BEFORE_THE_BELL,
      currentAct: 1,
      loggedInAsDirector: false, // will depend on which user is logged in
      timerEnd: null,
    }
  },
  computed: {
    currentViewComponent: function () {
      return this.loggedInAsDirector ? DirectorView : SpectatorView
    },
    showTimer: function () {
      if (this.timerEnd &&
        (this.currentPhase === PHASES.AFTER_THE_BELL || this.currentPhase === PHASES.INTERMISSION)
      ) {
        return true
      }
      return false
    },
    // timerValue: function () { // this will come from the backend every second - format TBD
    //   return {
    //     minutes: this.currentPhase === PHASES.INTERMISSION ? 20 : 10,
    //     seconds: 0,
    //   }
    // }
  },
  methods: {
    closeModal: function () {
      this.modalOpen = false
    },
    onWebsocketMessage: function (data) {
      if (Object.values(SOCKET_EVENTS).includes(data)) {
        console.log(data)
        switch(data) {
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
          case SOCKET_EVENTS.START_PLAY:
          case SOCKET_EVENTS.END_INTERMISSION:
            this.currentPhase = PHASES.SHOW_TIME
            break;
        }
      } else {
        let parsedData
        try {
          parsedData = JSON.parse(data)
        } catch (err) {
          console.log('error when parsing websocket data: ', err)
          return
        }
        console.log(parsedData)
        this.curtainOpen = parsedData.curtainOpen
        this.totalClapCount = parsedData.totalClapCount
        this.currentPhase = parsedData.currentPhase
        this.currentAct = parsedData.currentAct
        this.timerEnd = parsedData.timerEnd
      }
    },
    toggleCurtain: function () {
      // this.curtainOpen = !this.curtainOpen
    },
    increaseClapCount: function () {
      this.totalClapCount++
    },
    ringFirstBell: function () {
      // this.currentPhase = PHASES.AFTER_THE_BELL
      // const that = this
      // this.bellTimeout = setTimeout(function () {
      //   that.currentPhase = PHASES.SHOW_TIME
      // }, 5000)
    },
    startIntermission: function () {
      // this.currentPhase = PHASES.INTERMISSION
      // const that = this
      // if (this.intermissionTimeout) {
      //   clearTimeout(this.intermissionTimeout)
      // }
      // this.intermissionTimeout = setTimeout(function () {
      //   that.currentPhase = PHASES.SHOW_TIME
      //   that.currentAct++
      // }, 5000)
    },
    endShow: function () {
      this.currentPhase = PHASES.AFTER_THE_SHOW
    },
  },
  watch: {
    currentPhase: function () {
      // ugly, fix it later
      if (this.currentPhase === PHASES.SHOW_TIME) {
        this.timerEnd = null
      }
    }
  },
  destroyed() {
    clearTimeout(this.bellTimeout)
    clearTimeout(this.intermissionTimeout)
    clearTimeout(this.pingTimeout)
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

.modal-h1 {
  margin: 24px;
  font-size: 36px;
}

.modal-ul {
  list-style-type: disc;
  list-style-position: inside;
}

.modal-li {
  padding: 8px;
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  padding: 40px 30%;
  background-color: white;
  width: 100vw;
  height: 100vh;
  z-index: 4;
  font-size: 24px;
}

.modal-p {
  margin: 24px;
}

.modal-close-btn {
  position: fixed;
  top: 36px;
  right: 36px;
  border: none;
  font-size: 40px;
  cursor: pointer;
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
