export const PHASES = {
  BEFORE_THE_BELL: 'before_the_bell',
  AFTER_THE_BELL: 'after_the_bell',
  SHOW_TIME: 'show_time',
  INTERMISSION: 'intermission',
  AFTER_THE_SHOW: 'after_the_show',
}

export const ROLES = {
  SPECTATOR: 'spectator',
  DIRECTOR: 'director',
}

export const SOCKET_EVENTS = {
  CLAP: 'clap',
  OPEN_CURTAIN: 'open-curtain',
  CLOSE_CURTAIN: 'close-curtain',
  RING_BELL: 'ring-bell',
  START_INTERMISSION: 'start-intermission',
  END_PLAY: 'end-play',
  START_PLAY: 'start-play',
  END_INTERMISSION: 'end-intermission',
}