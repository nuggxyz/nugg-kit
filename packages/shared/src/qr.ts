import QRCodeUtil from 'qrcode';

export const QR_SIZE = 250;
export const LOGO_SIZE = 65;
const generateMatrix = (
	value: object,
	errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel,
) => {
	const arr = Array.prototype.slice.call(
		(
			QRCodeUtil.create(JSON.stringify(value), { errorCorrectionLevel })
				.modules as unknown as {
				data: QRCodeUtil.QRCode;
			}
		).data,
		0,
	) as QRCodeUtil.QRCode[];

	const sqrt = Math.sqrt(arr.length);

	return arr.reduce((prev, curr, index) => {
		if (index % sqrt === 0) {
			prev.push([curr]);
			return prev;
		}

		prev[prev.length - 1].push(curr);

		return prev;
	}, [] as QRCodeUtil.QRCode[][]);
};

export const makeSvg = (dots: string[]) => {
	return `<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 ${QR_SIZE} ${QR_SIZE}"
            >
				<svg viewBox="0 0 815.32 815.32" y="${
					QR_SIZE / 2 - LOGO_SIZE / 2
				}" x="${0}" height="${LOGO_SIZE}" fill="transparent" color="transparent">
				<circle fill="#FFF" cx="407.66" cy="407.66" r="407.66"></circle>
				<polygon fill="rgba(52,52,52,1.0)" transform="translate(50,50)" points="357.66 67.37 357.66 282.37 536.08 363.41 357.66 67.37"></polygon>
				<polygon fill="rgba(140,140,140,1.0)" transform="translate(50,50)" points="357.66 502.59 357.66 647.95 179.21 397.31 357.66 502.59"></polygon>
				<polygon fill="rgba(60,60,59,1.0)" transform="translate(50,50)" points="357.66 502.59 357.66 647.95 536.11 397.31 357.66 502.59"></polygon>
				<polygon fill="rgba(140,140,140,1.0)" transform="translate(50,50)" points="357.66 67.37 357.66 282.37 179.24 363.41 357.66 67.37"></polygon>
				<polygon fill="#141414" transform="translate(50,50)" points="357.66 282.37 357.66 468.97 536.08 363.41 357.66 282.37"></polygon>
				<polygon fill="#393939" transform="translate(50,50)" points="357.66 282.37 357.66 468.97 179.24 363.41 357.66 282.37"></polygon>
				</svg>
					<g>
                <rect
                    fill="transparent"
                    height="${QR_SIZE}"
                    width="${QR_SIZE}"
                />
                ${dots.join('')}
				</g>
            </svg>`.replaceAll('\n', '');
};

export const makeDots = (
	ecl: QRCodeUtil.QRCodeErrorCorrectionLevel,
	// size: number,
	uuid: string,
	cipher: string,
) => {
	const dots: string[] = [];
	const matrix = generateMatrix({ uuid, cipher }, ecl);

	const cellSize = QR_SIZE / matrix.length;
	const qrList = [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
	];

	qrList.forEach(({ x, y }) => {
		const x1 = (matrix.length - 7) * cellSize * x;
		const y1 = (matrix.length - 7) * cellSize * y;
		for (let i = 0; i < 3; i++) {
			dots.push(
				`<rect
                    fill="${i % 2 !== 0 ? 'white' : 'black'}"
                    height="${cellSize * (7 - i * 2)}"
                    key="${i}-${x}-${y}"
                    rx="${(i - 2) * -5 + (i === 0 ? 2 : 0)}"
                    ry="${(i - 2) * -5 + (i === 0 ? 2 : 0)}"
                    width="${cellSize * (7 - i * 2)}"
                    x="${x1 + cellSize * i}"
                    y="${y1 + cellSize * i}"
                />`,
			);
		}
	});

	const clearArenaSize = Math.floor((LOGO_SIZE + 15) / cellSize);
	const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
	const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

	matrix.forEach((row: QRCodeUtil.QRCode[], i: number) => {
		row.forEach((_: any, j: number) => {
			if (matrix[i][j]) {
				if (
					!(
						(i < 7 && j < 7) ||
						(i > matrix.length - 8 && j < 7) ||
						(i < 7 && j > matrix.length - 8)
					)
				) {
					if (
						!(
							i > matrixMiddleStart &&
							i < matrixMiddleEnd &&
							j > matrixMiddleStart &&
							j < matrixMiddleEnd
						)
					) {
						dots.push(
							`<circle
                                cx="${i * cellSize + cellSize / 2}"
                                cy="${j * cellSize + cellSize / 2}"
                                fill="black"
                                key="${`circle-${i}-${j}`}"
                                r="${cellSize / 3}"
                            />`,
						);
					}
				}
			}
		});
	});
	return dots;
};
