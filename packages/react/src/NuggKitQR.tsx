import { qrUtils } from '@nuggxyz/nugg-kit-shared';
import React from 'react';

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

export type NuggKitQRProps = {
	uuid: string;
	cipher: string;
};

const useSvgString = (uuid: string, cipher: string) => {
	const dots = React.useMemo(() => {
		return qrUtils.makeDots('M', uuid, cipher);
	}, [uuid, cipher]);

	const svg = React.useMemo(() => {
		return qrUtils.makeSvg(dots);
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

export const useNuggKitQR = (uuid: string, cipher: string) => {
	const svgString = useSvgString(uuid, cipher);

	return <QR svgString={svgString} />;
};

const NuggKitQR = ({ uuid, cipher }: NuggKitQRProps) => {
	return useNuggKitQR(uuid, cipher);
};

export default NuggKitQR;
