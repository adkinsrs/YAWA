import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faCog, faQuestionCircle, faShareAlt, faSignal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft, faCog, faQuestionCircle, faShareAlt, faSignal)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
