import { mount } from 'svelte';
import App from './App.svelte';
import '@tokens/tokens.css';
import '@components-css';

mount(App, { target: document.getElementById('app')! });
