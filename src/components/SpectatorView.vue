<template>
  <div>
    <div class="spectator-view-wrapper" v-show="currentPhase !== this.PHASES.SHOW_TIME">
      <div class="chat-wrapper audience-chat-wrapper">
        <button v-on:click="onAudienceChatClick" v-if="!audienceChatOpen" class="chat-trigger">
          Chat with other spectators
        </button>
        <div class="chat audience-chat" v-if="audienceChatOpen">
          <button class="close-button" v-on:click="closeAudienceChat">X</button>
        </div>
      </div>
      <div class="chat-wrapper crew-chat-wrapper">
        <button v-on:click="onCrewChatClick" v-if="!crewChatOpen" class="chat-trigger">
          Say something nice to the crew!
        </button>
        <div class="chat crew-chat" v-if="crewChatOpen">
          <button class="close-button" v-on:click="closeCrewChat">X</button>
        </div>
      </div>
      <div class="name-input-wrapper" v-if="nameInputOpen">
        <input v-model="displayName" placeholder="Set your display name">
        <button v-on:click="setDisplayName">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { PHASES } from '../../src/constants'

export default {
  name: 'SpectatorView',
  created () {
    this.PHASES = PHASES
  },
  data: function () {
    return {
      displayName: '',
      nameInputOpen: false,
      audienceChatOpen: false,
      crewChatOpen: false,
    }
  },
  props: {
    currentPhase: {
      type: String,
    },
  },
  methods: {
    setDisplayName: function () {
      if (this.displayName.trim().length > 0) {
        this.nameInputOpen = false
      }
    },
    onAudienceChatClick: function () {
      if (!this.displayName) {
        this.nameInputOpen = true
      }
      this.audienceChatOpen = true
    },
    onCrewChatClick: function () {
      if (!this.displayName) {
        this.nameInputOpen = true
      }
      this.crewChatOpen = true
    },
    closeAudienceChat: function () {
      this.audienceChatOpen = false
    },
    closeCrewChat: function () {
      this.crewChatOpen = false
    }
  }
}
</script>

<style scoped>
.spectator-view-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-wrapper {
  flex-grow: 1;
  display: flex;
  padding: 24px;
}

.chat {
  position: relative;
  border: 1px solid black;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
  width: 300px;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  padding: 0;
  font-size: 24px;
}

.chat-trigger {
  border-radius: 50px;
}

.audience-chat-wrapper {
  align-items: flex-start;
}

.crew-chat-wrapper {
  justify-content: flex-end;
  align-items: flex-end;
}

.name-input-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

input {
  border-radius: 8px;
  border: solid 1px rgb(209, 209, 209);
  padding: 16px;
  font-size: 16px;
  box-shadow: none;
  background-color: transparent;
}
</style>