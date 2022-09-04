import React, { useState } from 'react';

import './App.css';
import { NuggKitQR } from '@nuggxyz/nugg-kit-react';

const App = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: 200,
					height: 200,
					background: 'trqnsparent',
				}}
			>
				<NuggKitQR
					ksuid="2EHbJpGgorGQyigvJrdb8AvYUdd"
					encryptionKey="rHm91Ig2ZLSOj3BByYh0Dg=="
				/>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button
					type="submit"
					onClick={() => setCount((_count) => _count + 1)}
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	);
};

export default App;
