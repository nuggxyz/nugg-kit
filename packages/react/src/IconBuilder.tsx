import { icons } from 'packages/typescript/src';
import type { SvgProperties } from 'csstype';
import React from 'react';

export type IconName = keyof typeof icons;

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
	children?: React.ReactNode;
	size?: string | number;
	color?: string;
	title?: string;
}
export declare type IconType = (props: IconBaseProps) => JSX.Element;

type Setter = Partial<typeof icons[IconName]>;

type Child = NonNullable<Setter['child']>[number];

const IconSwitch = ({ child, fill }: { child: Child; fill: string }) => {
	switch (child.tag) {
		case 'rect':
			return (
				<rect
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'path':
			return (
				<path
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'circle':
			// @ts-ignore
			return (
				<circle
					// @ts-ignore
					fill={fill}
					{...child?.attr}
				/>
			);
		case 'polygon':
			// @ts-ignore
			return (
				<polygon
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
	fill: string;
	size: number | string;
	style?: SvgProperties;
}) => {
	const id = React.useId();
	return (
		<svg
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
		</svg>
	);
};

const Icon = ({
	icon,
	fill,
	size,
	style,
}: {
	icon: IconName;
	fill: string;
	size: number | string;
	style?: SvgProperties;
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
	style?: SvgProperties;
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
