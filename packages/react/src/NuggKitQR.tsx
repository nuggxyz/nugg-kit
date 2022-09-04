import { qrUtils } from '@nuggxyz/nugg-kit-typescript';
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
	ksuid: string;
	encryptionKey: string;
};

const useSvgString = (ksuid: string, encryptionKey: string) => {
	const dots = React.useMemo(() => {
		return qrUtils.makeDots('M', ksuid, encryptionKey);
	}, [ksuid, encryptionKey]);

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

export const useNuggKitQR = (ksuid: string, encryptionKey: string) => {
	const svgString = useSvgString(ksuid, encryptionKey);

	return <QR svgString={svgString} />;
};

const NuggKitQR = ({ ksuid, encryptionKey }: NuggKitQRProps) => {
	return useNuggKitQR(ksuid, encryptionKey);
};

export default NuggKitQR;
