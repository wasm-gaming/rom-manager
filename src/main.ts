/**
 * The jq79 entry point. While the UI is migrated off Preact it is served as
 * next.html beside the Preact app; it becomes the only entry when that is done.
 */
import './styles/index.css';
import App from './views/App.html';

App.mount('#app');
