import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import React from 'react';
import { makeDots, makeSvg } from '@nuggxyz/nugg-kit-shared/src/qr-utils';

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
	data: { key: string; code: string };
};

const useSvgString = ({ ecl = 'M', data }: Props) => {
	const dots = React.useMemo(() => {
		return makeDots(ecl, data);
	}, [ecl, data]);

	const svg = React.useMemo(() => {
		return makeSvg(dots);
	}, [dots]);

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

export const useNuggKitQR = (data: Props['data'], ecl = 'M' as Props['ecl']) => {
	const svgString = useSvgString({
		data,
		ecl,
	});

	return <QR svgString={svgString} />;
};

const NuggKitQR = ({ ecl = 'M', data }: Props) => {
	return useNuggKitQR(data, ecl);
};

export default NuggKitQR;
