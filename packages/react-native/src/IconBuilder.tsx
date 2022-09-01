import React from 'react';
import Svg, { Circle, Path, Polygon, Rect, SvgProps } from 'react-native-svg';
import type { IconType } from 'react-icons/lib';
import { ColorValue } from 'react-native';
import icons from 'shared/src/icons';

export type IconName = keyof typeof icons;

type Setter = Partial<typeof icons[IconName]>;

type Child = NonNullable<Setter['child']>[number];

const IconSwitch = ({ child, fill }: { child: Child; fill: ColorValue }) => {
	switch (child.tag) {
		case 'rect':
			return (
				<Rect
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'path':
			return (
				<Path
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'circle':
			// @ts-ignore
			return (
				<Circle
					// @ts-ignore
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'polygon':
			// @ts-ignore
			return (
				<Polygon
					// @ts-ignore
					fill={fill}
					{...child?.attr}
				/>
			);
		default:
			return null;
	}
};

const parsed = {
	attr: { fill: 'currentColor', viewBox: '0 0 20 20' },
	children: [] as JSX.Element[],
};

const parseIcon = (icon: IconType): Setter => {
	const hi = icon({}).props as typeof parsed;

	const child = hi.children.map((c) => {
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		return { attr: c.props, tag: c.type };
	});

	// @ts-ignore
	delete hi.children;

	return {
		...hi,
		// @ts-ignore
		child,
	};
};

const IconBuilder = ({
	element,
	fill,
	size,
	style,
}: {
	element: Setter;
	fill: ColorValue;
	size: number | string;
	style?: SvgProps['style'];
}) => {
	const id = React.useId();
	return (
		<Svg
			viewBox={element?.attr?.viewBox}
			height={size}
			width={size}
			style={style}
			fill={fill}
			color={fill}
			{...element.attr}
		>
			{element?.child?.map((child, index) => (
				<IconSwitch
					child={child}
					fill={fill}
					key={`${id}-${index}`}
				/>
			))}
		</Svg>
	);
};

const Icon = ({
	icon,
	fill,
	size,
	style,
}: {
	icon: IconName;
	fill: ColorValue;
	size: number | string;
	style?: SvgProps['style'];
}) => {
	return (
		<IconBuilder
			element={icons[icon]}
			fill={fill}
			size={size}
			style={style}
		/>
	);
};

export const ReactIcon = ({
	icon,
	fill,
	size,
	style,
}: {
	icon: IconType;
	fill: string;
	size: number | string;
	style?: SvgProps['style'];
}) => {
	return (
		<IconBuilder
			element={parseIcon(icon)}
			fill={fill}
			size={size}
			style={style}
		/>
	);
};

export default Icon;
