<template>

  <div>

    <div class="top">
      <h1>Log</h1>
    </div>

    <div class="actions">
      <button @click="fetchDates">Reload dates</button>
      <button @click="fetchLog(state.date)" v-if="state.date">Reload {{state.date}}</button>
      <button @click="emptyLog(state.date)" v-if="state.date">Empty {{state.date}}</button>
      {{ state.loading ? 'Loading logs' : 'Idle'}}
    </div>

    <div class="logs">
      <ul class="dates" v-if="state.dates.length">
        <li v-for="(d,index) in state.dates" :key="index" @click="setDate(d)" :class="{on: d === state.date}">{{d}}</li>
      </ul>

      <ul class="lines" v-if="state.logs.length">
        <li v-for="(l,index) in state.logs" :key="index" :class="`${l.type || 'success'}`">
          <b>{{l.date}}</b>: {{l.msg}}
          <pre v-if="l.meta">{{l.meta}}</pre>
<!--          <pre>{{l}}</pre>-->
        </li>
      </ul>
    </div>

<!--    <hr />

    <pre>{{ state }}</pre>-->

  </div>

</template>

<script setup>
import dayjs from 'dayjs'
import {reactive, watchEffect} from 'vue'

const state = reactive({
  logs: [],
  loading: false,
  dates: [],
  date: ''
})

const api = process.env.VUE_APP_API

watchEffect(() => {
  console.log('date is', state.date)
  if(state.date) fetchLog(state.date)
})

const fetchDates = async () => {
  state.loading = true

  try {
    let res = await fetch(`${api}/log`)
    state.dates = await res.json()

    if(!state.date) state.date = state.dates[0]

  } catch(err) {
    console.error('🔥', err)
  }

  state.loading = false
}

const fetchLog = async date => {
  state.logs = []
  state.loading = true

  try {
    let res = await fetch(`${api}/log/${date}`)
    state.logs = await res.json()
  } catch(err) {
    console.error('🔥', err)
  }

  state.loading = false
}

const emptyLog = async date => {
  const ok = confirm(`Empty log ${date} ?`)
  if(!ok) return

  state.logs = []
  state.date = ''
  state.loading = true

  try {
    await fetch(`${api}/log/${date}`, {
      method: 'DELETE'
    })

    await fetchDates()

  } catch(err) {
    console.error('🔥', err)
  }

  state.loading = false

}

const setDate = d => {
  state.date = d
}

// Fetch on Mount
(async () => {
  await fetchDates()
})()

</script>
