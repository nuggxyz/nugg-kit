import React, { useState } from 'react';
import { useNuggKitQR } from 'dapp-react/src';
import './App.css';

const App = () => {
	const [count, setCount] = useState(0);

	const Svg = useNuggKitQR(
		{ code: '1234', key: '2343' },
		{
			ecl: 'M',
			size: 400,
			logoSize: 50,
		},
	);

	return (
		<div className="App">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: 600,
					height: 600,
					background: 'trqnsparent',
				}}
			>
				{Svg}
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
