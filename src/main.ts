import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import initStorePlugin from './plugins/initStore';
import './registerServiceWorker';

const app = createApp(App);
const pinia = createPinia();

pinia.use(initStorePlugin);

app.use(pinia);
app.mount('#app');
