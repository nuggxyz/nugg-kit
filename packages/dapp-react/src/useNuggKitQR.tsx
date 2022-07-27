import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import React from 'react';
import { makeDots, makeSvg } from 'shared/src';

const getParsed = (input: string) => {
	if (input.startsWith('ERROR') || input === '') {
		return '<svg></svg>';
	}
	if (input.startsWith('data:image/svg+xml;charset=UTF-8,')) {
		return input.replace('data:image/svg+xml;charset=UTF-8,', '');
	}

	if (input.startsWith('data:image/svg+xml;base64,')) {
		return Buffer.from(input.replace('data:image/svg+xml;base64,', ''), 'base64').toString(
			'utf8',
		);
	}

	return input;
};

const getSvgObject = (input: string) => {
	const str = input;

	return new DOMParser().parseFromString(str, 'image/svg+xml');
};

type Props = {
	ecl?: QRCodeErrorCorrectionLevel;
	logoBackground?: string;
	logoUrl?: string;
	logoMargin?: number;
	logoSize?: number;
	size?: number;
};

const useSvgString = (
	data: { key: string; code: string },
	{
		ecl = 'M',
		logoBackground,
		logoMargin = 10,
		logoSize = 50,
		logoUrl,
		size: sizeProp = 200,
	}: Props,
) => {
	const padding = '20';

	const size = sizeProp - parseInt(padding, 10) * 2;

	const logoPosition = size / 2 - logoSize / 2;
	const logoWrapperSize = logoSize + logoMargin * 2;

	const dots = React.useMemo(() => {
		return makeDots(ecl, logoSize, size, data);
	}, [ecl, logoSize, size, data]);

	const svg = React.useMemo(() => {
		return makeSvg(
			logoUrl ?? '',
			size,
			logoWrapperSize,
			logoPosition,
			logoSize,
			logoBackground ?? 'transparent',
			dots,
		);
	}, [size, logoWrapperSize, logoSize, dots, logoBackground, logoPosition, logoUrl]);

	return svg;
};

const QR = React.memo(
	({ svgString }: { svgString: string | null }) => {
		const id = React.useId();

		React.useEffect(() => {
			if (svgString) {
				const str = getParsed(svgString);

				const svg = getSvgObject(str);

				const div = document.getElementById(id) as unknown as SVGElement | undefined;

				if (!div || !svg.documentElement) return;
				svg.documentElement.id = id;
				svg.documentElement.classList.add('customized-dotnugg');

				div.replaceWith(svg.documentElement);
			} else {
				const div = document.getElementById(id);
				if (!div) return;
				div.innerHTML = '';
			}
		}, [svgString, id]);

		return <svg id={id} />;
	},
	(prev, curr) => prev.svgString === curr.svgString,
);

export default (
	data: { key: string; code: string },
	{
		ecl = 'M',
		logoBackground,
		logoMargin = 10,
		logoSize = 50,
		logoUrl,
		size: sizeProp = 200,
	}: Props,
) => {
	const svgString = useSvgString(data, {
		ecl,
		logoBackground,
		logoMargin,
		logoSize,
		logoUrl,
		size: sizeProp,
	});

	return <QR svgString={svgString} />;
};
