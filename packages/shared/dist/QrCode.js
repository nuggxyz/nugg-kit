"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDots = exports.makeSvg = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateMatrix = (value, errorCorrectionLevel) => {
    const arr = Array.prototype.slice.call(qrcode_1.default.create(value, { errorCorrectionLevel }).modules, 0);
    const sqrt = Math.sqrt(arr.length);
    return arr.reduce((prev, curr, index) => {
        if (index % sqrt === 0) {
            prev.push([curr]);
            return prev;
        }
        prev[prev.length - 1].push(curr);
        return prev;
    }, []);
};
const makeSvg = (logoUri, size, logoWrapperSize, logoPosition, logoSize, logoBackground, dots) => {
    return `<svg
                height="${size}"
                style="all: revert;"
                width="${size}"
            >
                <defs>
                    <clipPath id="clip-wrapper">
                        <rect
                            height="${logoWrapperSize}"
                            width="${logoWrapperSize}"
                        />
                    </clipPath>
                    <clipPath id="clip-logo">
                        <rect
                            height="${logoSize}"
                            width="${logoSize}"
                            fill="${logoBackground}"
                        />
                    </clipPath>
                </defs>
                <image href="${logoUri}" height="200" width="200" style="position: absolute; top: ${logoPosition}; right: 0; left: 0;"/>
                <rect
                    fill="transparent"
                    height="${size}"
                    width="${size}"
                />
                ${dots.join()}
            </svg>`;
};
exports.makeSvg = makeSvg;
const makeDots = (ecl, logoSize, size, uri) => {
    const dots = [];
    const matrix = generateMatrix(uri, ecl);
    const cellSize = size / matrix.length;
    const qrList = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
    ];
    qrList.forEach(({ x, y }) => {
        const x1 = (matrix.length - 7) * cellSize * x;
        const y1 = (matrix.length - 7) * cellSize * y;
        for (let i = 0; i < 3; i++) {
            dots.push(`<rect
                    fill="${i % 2 !== 0 ? 'white' : 'black'}"
                    height="${cellSize * (7 - i * 2)}"
                    key="${i}-${x}-${y}"
                    rx="${(i - 2) * -5 + (i === 0 ? 2 : 0)}" // calculated border radius for corner squares
                    ry="${(i - 2) * -5 + (i === 0 ? 2 : 0)}" // calculated border radius for corner squares
                    width="${cellSize * (7 - i * 2)}"
                    x="${x1 + cellSize * i}"
                    y="${y1 + cellSize * i}"
                />`);
        }
    });
    const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;
    matrix.forEach((row, i) => {
        row.forEach((_, j) => {
            if (matrix[i][j]) {
                if (!((i < 7 && j < 7) ||
                    (i > matrix.length - 8 && j < 7) ||
                    (i < 7 && j > matrix.length - 8))) {
                    if (!(i > matrixMiddleStart &&
                        i < matrixMiddleEnd &&
                        j > matrixMiddleStart &&
                        j < matrixMiddleEnd)) {
                        dots.push(`<circle
                                cx="${i * cellSize + cellSize / 2}"
                                cy="${j * cellSize + cellSize / 2}"
                                fill="black"
                                key="${`circle-${i}-${j}`}"
                                r="${cellSize / 3}" // calculate size of single dots
                            />`);
                    }
                }
            }
        });
    });
    return dots;
};
exports.makeDots = makeDots;
//# sourceMappingURL=QrCode.js.map