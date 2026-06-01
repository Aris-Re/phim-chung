<template>
  <div
    id="aris"
    :class="[
      !videoOnly && side ? 'expanded' : '',
      { 'video-fullscreen': fullscreen, 'mobile-overlay-chat': fullscreen && isMobile },
    ]"
  >
    <template v-if="!$client.supported">
      <aris-unsupported />
    </template>
    <template v-else>
      <main class="aris-main">
        <div v-if="!videoOnly" class="header-container">
          <aris-header />
        </div>
        <div class="video-container">
          <aris-video
            ref="video"
            :hideControls="hideControls"
            :extraControls="isEmbedMode"
            @control-attempt="controlAttempt"
          />
        </div>
        <div v-if="!videoOnly" class="room-container">
          <aris-members />
          <div class="room-menu">
            <div class="settings">
              <aris-menu />
            </div>
            <div class="controls">
              <aris-controls :shakeKbd="shakeKbd" />
            </div>
            <div class="emotes">
              <aris-emotes />
            </div>
          </div>
        </div>
      </main>
      <aris-side v-if="!videoOnly && side && !(fullscreen && isMobile)" />
      <aris-connect v-if="!connected" />
      <aris-about v-if="about" />
      <notifications
        v-if="!videoOnly"
        group="aris"
        position="top left"
        style="top: 50px; pointer-events: none"
        :ignoreDuplicates="true"
      />
    </template>
  </div>
</template>

<style lang="scss">
  #aris {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100vw;
    max-height: 100vh;
    flex-direction: row;
    display: flex;

    .aris-main {
      min-width: 360px;
      max-width: 100%;
      flex-grow: 1;
      flex-direction: column;
      display: flex;
      overflow: auto;

      .header-container {
        background: $background-tertiary;
        height: $menu-height;
        flex-shrink: 0;
        display: flex;
      }

      .video-container {
        background: rgba($color: #000, $alpha: 0.4);
        max-width: 100%;
        flex-grow: 1;
        display: flex;
      }

      .room-container {
        background: $background-tertiary;
        height: $controls-height;
        max-width: 100%;
        flex-shrink: 0;
        flex-direction: column;
        display: flex;

        .room-menu {
          max-width: 100%;
          flex: 1;
          display: flex;

          .settings {
            margin-left: 10px;
            flex: 1;
            justify-content: flex-start;
            align-items: center;
            display: flex;
          }

          .controls {
            flex: 1;
            justify-content: center;
            align-items: center;
            display: flex;
          }

          .emotes {
            margin-right: 10px;
            flex: 1;
            justify-content: flex-end;
            align-items: center;
            display: flex;
          }
        }
      }
    }

    &.mobile-overlay-chat {
      .header-container,
      .room-container {
        display: none !important;
      }

      .aris-main {
        height: 100vh;
        min-height: 100vh;
      }

      .video-container {
        flex: 1;
        min-height: 0;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    html,
    body {
      overflow-y: auto !important;
      width: auto !important;
      height: auto !important;
    }

    body > p {
      display: none;
    }

    #aris {
      position: relative;
      flex-direction: column;
      max-height: initial !important;

      .aris-main {
        height: 100vh;
      }

      .aris-menu {
        height: 100vh;
        width: 100% !important;
      }
    }
  }

  @media only screen and (max-width: 1024px) and (orientation: portrait) {
    #aris {
      &.expanded .aris-main {
        height: 40vh;
      }

      &.expanded .aris-menu {
        height: 60vh;
        width: 100% !important;
      }

      &.expanded.mobile-overlay-chat .aris-main {
        height: 100vh;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    #aris .aris-main .room-container {
      display: none;
    }
  }
</style>

<script lang="ts">
  import { Vue, Component, Ref, Watch } from 'vue-property-decorator'

  import Connect from '~/components/connect.vue'
  import Video from '~/components/video.vue'
  import Menu from '~/components/menu.vue'
  import Side from '~/components/side.vue'
  import Controls from '~/components/controls.vue'
  import Members from '~/components/members.vue'
  import Emotes from '~/components/emotes.vue'
  import About from '~/components/about.vue'
  import Header from '~/components/header.vue'
  import Unsupported from '~/components/unsupported.vue'

  @Component({
    name: 'aris',
    components: {
      'aris-connect': Connect,
      'aris-video': Video,
      'aris-menu': Menu,
      'aris-side': Side,
      'aris-controls': Controls,
      'aris-members': Members,
      'aris-emotes': Emotes,
      'aris-about': About,
      'aris-header': Header,
      'aris-unsupported': Unsupported,
    },
  })
  export default class extends Vue {
    @Ref('video') video!: Video

    shakeKbd = false
    isMobile = false
    private mobileMedia: MediaQueryList | null = null

    get fullscreen() {
      return this.$accessor.client.fullscreen
    }

    get volume() {
      const numberParam = parseFloat(new URL(location.href).searchParams.get('volume') || '1.0')
      return Math.max(0.0, Math.min(!isNaN(numberParam) ? numberParam * 100 : 100, 100))
    }

    get isCastMode() {
      return !!new URL(location.href).searchParams.get('cast')
    }

    get isEmbedMode() {
      return !!new URL(location.href).searchParams.get('embed')
    }

    get hideControls() {
      return this.isCastMode
    }

    get videoOnly() {
      return this.isCastMode || this.isEmbedMode
    }

    mounted() {
      this.mobileMedia = window.matchMedia('(max-width: 768px)')
      this.isMobile = this.mobileMedia.matches
      this.mobileMedia.addEventListener('change', this.onMobileMediaChange)
    }

    beforeDestroy() {
      this.mobileMedia?.removeEventListener('change', this.onMobileMediaChange)
    }

    onMobileMediaChange = (event: MediaQueryListEvent) => {
      this.isMobile = event.matches
    }

    @Watch('volume', { immediate: true })
    onVolume(volume: number) {
      if (new URL(location.href).searchParams.has('volume')) {
        this.$accessor.video.setVolume(volume)
      }
    }

    @Watch('hideControls', { immediate: true })
    onHideControls(enabled: boolean) {
      if (enabled) {
        this.$accessor.video.setMuted(false)
        this.$accessor.settings.setSound(false)
      }
    }

    @Watch('side')
    onSide(side: boolean) {
      if (side) {
        this.$nextTick(() => {
          const side = document.querySelector('aside')
          if (side) {
            side.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    }

    controlAttempt() {
      if (this.shakeKbd || this.$accessor.remote.hosted) return

      this.shakeKbd = true
      window.setTimeout(() => (this.shakeKbd = false), 5000)
    }

    get about() {
      return this.$accessor.client.about
    }

    get side() {
      return this.$accessor.client.side
    }

    get connected() {
      return this.$accessor.connected
    }
  }
</script>
