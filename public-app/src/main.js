import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'

import App from './App.vue'
import Job from './Job.vue'
//import Log from './Log.vue'
//import User from './User.vue'

const routes = [
	{path: '/:host?/:date?', component: Job},

]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
