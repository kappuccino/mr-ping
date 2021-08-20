<template>
  <div>

    <div class="app">

      <div class="hosts" v-if="state.hosts.length">
        <ul>
          <li v-for="h in state.hosts" :key="h" :class="{active: h === host}">
            <router-link :to="`/${h}`">{{h}}</router-link>
          </li>
        </ul>
      </div>

      <div class="dates" v-if="state.dates.length">
        <ul>
          <li v-for="d in state.dates" :key="d" :class="{active: d === date}">
            <router-link :to="`/${host}/${d}`">{{d}}</router-link>
          </li>
        </ul>
      </div>

      <div class="detail" v-if="state.values.length">
        <UplotVue :data="state.values" :options="state.options" />
<!--        <pre>{{ state.values }}</pre>-->
      </div>

    </div>

<!--    <router-view></router-view>-->

  </div>
</template>

<script setup>
import {reactive, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import UplotVue from 'uplot-vue'
import 'uplot/dist/uPlot.min.css'

const api = process.env.VUE_APP_API

const route = useRoute()

const state = reactive({
  hosts: [],
  dates: [],
  values: [],

  data: [],
  options: {
    title: "Chart",
    width: 900,
    height: 500,
    series: [
      {
        label: "Date",

      },
      {
        label: "Ping (ms)",
        points: { show: false },
        stroke: "blue",

        //fill: "blue"
      }
    ],
    plugins: [],
    //scales: { x: { time: false } }
  }
})

const host = computed(() => route.params.host)
const date = computed(() => route.params.date)

watch(host, () => fetchDates())
watch(date, () => fetchValues())

async function fetchHosts(){
  console.log('fetchHosts()')

  state.dates = []
  state.values = []

  try{
    let res = await fetch(`${api}/ping`)
    state.hosts = await res.json()
  } catch(err){
    console.error('🔥', err)
  }

}

async function fetchDates(){
  if(!host.value) return false

  state.values = []

  const url = `/ping/${host.value}`
  console.log('fetchDates()', url)

  try{
    let res = await fetch(`${api}${url}`)
    state.dates = await res.json()
  } catch(err){
    console.error('🔥', err)
  }
}

async function fetchValues(){
  if(!host.value || !date.value) return

  const url = `/ping/${host.value}/${date.value}`
  console.log('fetchValues()', url)

  try{
    let res = await fetch(`${api}${url}`)
    res = await res.json()

    state.values = res.reduce((acc, next, index) => {
      acc[0][index] = next.time/1000
      acc[1][index] = next.value
      return acc
      //return [r.time/1000, r.value]
    }, [[], []])

  } catch(err){
    console.error('🔥', err)
  }

}


// Fetch on Mount
(async () => {
  await fetchHosts()
})()

</script>

<style src="./style.scss" lang="scss" />
