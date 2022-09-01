import { GraphQLClient } from 'graphql-request';
import { combine } from 'zustand/middleware';
import create from 'zustand/vanilla';

import { WaitSubscription, getSdk } from './gen/graphql.types';

const https_client = new GraphQLClient('http://us.dev02.nuggapi.v1.api.nugg.xyz/graphql');

const wss_client = new GraphQLClient('wss://us.dev02.nuggapi.v1.api.nugg.xyz/graphql/realtime');

const store = create(
	combine(
		{
			socket: null as WaitSubscription | null,
			ttl: 0,
			id: 0,
		},
		(set, get) => {
			const trigger = async (dat: { data: string; id: string }) => {
				const dats = await getSdk(wss_client).Wait(dat);
			};
		},
	),
);
