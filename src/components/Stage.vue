<template>
  <div
    :class="[{ 'full-screen': !loggedInAsDirector && currentPhase === this.PHASES.SHOW_TIME}, 'stage']">
    <div class="resp-iframe-wrapper">
      <iframe class="resp-iframe" src="https://www.youtube-nocookie.com/embed/e3Q6vBIvuuU?controls=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="curtains">
      <transition name="announcement">
        <div v-show="announcementVisible" class="announcement-wrapper">
          <div class="announcement">
            {{ announcementText }}
          </div>
        </div>
      </transition>
      <transition name="announcement">
        <Timer v-if="showTimer" :timerEnd="timerEnd" absolute light />
      </transition>
      <transition name="announcement">
        <div v-if="bellRinging" class="bell-wrapper">
          <div class="bell">
            <img class="bell-img" src="@/assets/ringing-bell.svg" />
          </div>
        </div>
      </transition>
      <transition name="curtain-left">
        <div v-show="!curtainOpen" class="curtain curtain-left" />
      </transition>
      <transition name="curtain-right">
        <div v-show="!curtainOpen" class="curtain curtain-right" />
      </transition>
    </div>
    <transition name="fade">
      <button class="clap" v-on:click="clap" v-if="!loggedInAsDirector">
        <img class="clap-img" src="@/assets/clap.png" />
        <div class="clap-count">{{ clapCount }}</div>
      </button>
    </transition>
  </div>
</template>

<script>1
// we will need curtain image in higher resolution
// sound effect when opening curtain?
// TODO: mute the video when curtains are closed
// TODO: actually stop the stream when curtains are closed?
// for youtube: https://developers.google.com/youtube/iframe_api_reference?hl=en#Loading_a_Video_Player
// TODO: possibly show timer here as well in spectator view
import { PHASES, SOCKET_EVENTS } from '../../src/constants'
import Timer from './Timer'

export default {
  name: 'Stage',
  components: {
    Timer,
  },
  created () {
    this.PHASES = PHASES
  },
  data: function () {
    return {
      clapCount: 0,
      announcementVisible: false,
      bellRinging: false,
    }
  },
  props: {
    curtainOpen: {
      type: Boolean,
    },
    currentPhase: {
      type: String,
    },
    currentAct: {
      type: Number,
    },
    loggedInAsDirector: {
      type: Boolean,
    },
    showTimer: {
      type: Boolean,
    },
    timerEnd: {
      type: Number,
    },
  },
  computed: {
    announcementText: function () {
      let text
      switch(this.currentPhase) {
        case PHASES.AFTER_THE_BELL:
          text = 'The play will start in:'
          break;
        case PHASES.SHOW_TIME:
          text = `Act ${this.currentAct} is starting now`
          break;
        case PHASES.INTERMISSION:
          // TODO: take intermission time from play definition
          // TODO: this one should not dissapear actually
          text = 'Intermission - please be back in:'
          break;
        case PHASES.AFTER_THE_SHOW:
          // TODO: this one should not dissapear actually
          text = 'The play has ended'
          break;
      }
      return text
    },
    momentaryAnnouncement: function () {
      return this.currentPhase === PHASES.SHOW_TIME
    },
  },
  methods: {
    clap: function () {
      this.clapCount++
      // instead of line below, there will be request to the backend to increase total claps
      // this.$emit('clap')
      this.$socket.send(SOCKET_EVENTS.CLAP)
    }
  },
  watch: {
    currentPhase: function () {
      this.announcementVisible = true
      const that = this
      if (this.momentaryAnnouncement) {
        if (this.announcementTimeout) {
          clearTimeout(this.announcementTimeout)
        }
        this.announcementTimeout = setTimeout(function () {
          that.announcementVisible = false
        }, 3000)
      }

      if (this.currentPhase === PHASES.AFTER_THE_BELL) {
        this.bellRinging = true
        if (this.bellRingingTimeout) {
          clearTimeout(this.bellRingingTimeout)
        }
        this.bellRingingTimeout = setTimeout(function () {
          that.bellRinging = false
        }, 2000)
      }
    },
  },
  destroyed() {
    clearTimeout(this.announcementTimeout)
    clearTimeout(this.bellRingingTimeout)
  },
}
</script>

<style scoped>
.stage {
  position: relative;
  overflow: hidden;
  transition: width 1.5s ease-in-out;
}

.full-screen {
  width: 100%;
}

.resp-iframe-wrapper {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
  height: 100%;
}

.resp-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.curtains {
  width: 100%;
  height: 100%;
}

.curtain {
  position: absolute;
  top: 0;
  bottom: 0;
  background-image: url("~@/assets/blue-curtains.jpg");
  background-size: cover;
}

.curtain-left {
  left: 0;
  right: 50%;
}

.curtain-right {
  right: 0;
  left: 50%;
}

.bell-wrapper {
  position: absolute;
  top: calc(50% - 90px - 24px);
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 3;
}

.bell {
  border-radius: 8px;
  background-color: white;
  padding: 24px;
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}

.bell-img {
  height: 180px;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.clap {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: white;
}

/* clap appearance animation */
.fade-enter-active {
  animation: fade-in-animation 0.7s;
}
.fade-leave-active {
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

.clap-count {
  text-align: right;
}

.announcement-wrapper {
  position: absolute;
  top: 20px;
  z-index: 2;
  display: flex;
  justify-content: center;
  width: 100%;
}

.announcement {
  border-radius: 8px;
  background-color: white;
  padding: 24px;
  font-size: 24px;
  color: black;
}

/* announcement animation styles */
.announcement-enter-active {
  transition: opacity 1.5s ease-in-out;
}

.announcement-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.announcement-enter,
.announcement-leave-to {
  opacity: 0;
}

/* curtain animation styles */
.curtain-left-enter {
  transform: translateX(-100%);
}

.curtain-left-enter-active {
  transition: transform 3s ease-in-out;
}

.curtain-left-leave-active {
  transition: transform 3s ease-in-out;
}

.curtain-left-leave-to {
  transform: translateX(-100%);
}

.curtain-right-enter {
  transform: translateX(100%);
}

.curtain-right-enter-active {
  transition: transform 3s ease-in-out;
}

.curtain-right-leave-active {
  transition: transform 3s ease-in-out;
}

.curtain-right-leave-to {
  transform: translateX(100%);
}
</style>