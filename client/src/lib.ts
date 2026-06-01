import { accessor as aris } from './store'
import { PluginObject } from 'vue'

// Plugins
import Logger from './plugins/log'
import Client from './plugins/neko'
import Axios from './plugins/axios'
import Swal from './plugins/swal'
import Anime from './plugins/anime'
import { i18n } from './plugins/i18n'

// Components
import Connect from '~/components/connect.vue'
import Video from '~/components/video.vue'
import Menu from '~/components/menu.vue'
import Side from '~/components/side.vue'
import Controls from '~/components/controls.vue'
import Members from '~/components/members.vue'
import Emotes from '~/components/emotes.vue'
import About from '~/components/about.vue'
import Header from '~/components/header.vue'
import Chat from '~/components/chat.vue'
import Clipboard from '~/components/clipboard.vue'
import Emoji from '~/components/emoji.vue'
import Emote from '~/components/emote.vue'
import Context from '~/components/context.vue'
import Markdown from '~/components/markdown'
import Avatar from '~/components/avatar.vue'

// Vue
import Vue from 'vue'
import ToolTip from 'v-tooltip'

Vue.use(ToolTip)

const exportMixin = {
  computed: {
    $accessor() {
      return aris
    },
    $client() {
      return window.$client
    },
  },
}

const plugini18n: PluginObject<undefined> = {
  install(Vue) {
    Vue.prototype.i18n = i18n
    Vue.prototype.$t = i18n.t.bind(i18n)
    Vue.prototype.$te = i18n.te.bind(i18n)
  },
}

function extend(component: any) {
  return component.use(plugini18n).use(Logger).use(Axios).use(Swal).use(Anime).use(Client).extend(exportMixin)
}

export const ArisConnect = extend(Connect)
export const ArisVideo = extend(Video)
export const ArisMenu = extend(Menu)
export const ArisSide = extend(Side)
export const ArisControls = extend(Controls)
export const ArisMembers = extend(Members)
export const ArisEmotes = extend(Emotes)
export const ArisAbout = extend(About)
export const ArisHeader = extend(Header)
export const ArisChat = extend(Chat)
export const ArisClipboard = extend(Clipboard)
export const ArisEmoji = extend(Emoji)
export const ArisEmote = extend(Emote)
export const ArisMarkdown = extend(Markdown)
export const ArisContext = extend(Context)
export const ArisAvatar = extend(Avatar)

/** @deprecated Use Aris* exports */
export const NekoConnect = ArisConnect
/** @deprecated Use Aris* exports */
export const NekoVideo = ArisVideo
/** @deprecated Use Aris* exports */
export const NekoMenu = ArisMenu
/** @deprecated Use Aris* exports */
export const NekoSide = ArisSide
/** @deprecated Use Aris* exports */
export const NekoControls = ArisControls
/** @deprecated Use Aris* exports */
export const NekoMembers = ArisMembers
/** @deprecated Use Aris* exports */
export const NekoEmotes = ArisEmotes
/** @deprecated Use Aris* exports */
export const NekoAbout = ArisAbout
/** @deprecated Use Aris* exports */
export const NekoHeader = ArisHeader
/** @deprecated Use Aris* exports */
export const NekoChat = ArisChat
/** @deprecated Use Aris* exports */
export const NekoClipboard = ArisClipboard
/** @deprecated Use Aris* exports */
export const NekoEmoji = ArisEmoji
/** @deprecated Use Aris* exports */
export const NekoEmote = ArisEmote
/** @deprecated Use Aris* exports */
export const NekoMarkdown = ArisMarkdown
/** @deprecated Use Aris* exports */
export const NekoContext = ArisContext
/** @deprecated Use Aris* exports */
export const NekoAvatar = ArisAvatar

aris.initialise()
export default aris
