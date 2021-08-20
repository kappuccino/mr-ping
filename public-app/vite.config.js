import path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		EnvironmentPlugin(['VUE_APP_API']),
	],
	build: {
		outDir: path.dirname(__dirname)+'/public'
	}
})
