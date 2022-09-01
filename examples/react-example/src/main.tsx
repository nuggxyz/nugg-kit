import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

try {
	globalThis.Buffer = globalThis.Buffer || (await import('buffer')).Buffer;
} catch (e) {
	console.error(e);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
