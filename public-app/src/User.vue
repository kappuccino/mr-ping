<template>

  <div>

    <div class="top">
      <h1>Instagram users</h1>
    </div>

    <div class="actions">
      <button @click="fetchUsers">Reload users</button>
      {{ state.loading ? 'Loading logs' : 'Idle'}}
    </div>

    <div class="users">
      <div class="names">
        <input type="search" v-model="state.search">

        <ul v-if="usersList.length">
          <li v-for="(u,index) in usersList" :key="index" @click="selectUser(u)" :class="{on: u === state.selected}">{{u}}</li>
        </ul>
      </div>

      <div class="detail" v-if="state.selected">
        <h1>@{{ state.user.username }}</h1>
        <h4>{{ state.user.followers }} followers</h4>
        <h4>Last check {{ state.user.date }} </h4>

        <ul class="images" v-if="state.user.images.length">
          <li v-for="(img,index) in state.user.images" :key="img.id">
            <a :href="img.url" target="_blank">
              <img :src="img.thumbnail" />
            </a>
          </li>
        </ul>

<!--        <pre>{{ state.user }}</pre>-->
      </div>
    </div>

<!--    <hr />

    <pre>{{ state }}</pre>-->

  </div>

</template>

<script setup>
import {reactive, watchEffect, computed} from 'vue'

const state = reactive({
  loading: false,
  search: '',
  users: [],
  selected: '',
  user: {}
})

const api = process.env.VUE_APP_API

watchEffect(() => {
  if(state.selected) fetchUser(state.selected)
})

const usersList = computed(() => {
  return state.users.filter(u => u.includes(state.search))
})

const fetchUsers = async () => {
  state.loading = true

  try {
    let res = await fetch(`${api}/user`)
    state.users = await res.json()
  } catch(err) {
    console.error('🔥', err)
  }

  state.loading = false
}

const fetchUser = async username => {
  state.user = {}
  state.loading = true

  try {
    let res = await fetch(`${api}/user/${username}`)
    state.user = await res.json()
  } catch(err) {
    console.error('🔥', err)
  }

  state.loading = false
}

const selectUser = u => {
  state.selected = u
}

// Fetch on Mount
(async () => {
  await fetchUsers()
})()

</script>
