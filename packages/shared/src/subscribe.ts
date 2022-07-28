import { gql } from 'graphql-request';
import { combine } from 'zustand/middleware';
import create from 'zustand/vanilla';

import { Sdk } from './gen/graphql.types';

const abc = gql`
	subscription Help($id: ID!, $data: String!) {
		wait(input: { id: $id, data: $data }) {
			id
			data
		}
	}
`;

const store = create(
	combine(
		{
			socket: null as Sdk | null,
			ttl: 0,
			id: 0,
		},
		(set, get) => {
			const updateSocket = (nextSocket: Sdk) => {};
		},
	),
);
