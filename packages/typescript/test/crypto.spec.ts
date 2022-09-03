/* eslint-disable module-resolver/use-alias */

import { expect } from 'chai';

import { ClientSideCrypto } from '../src';

describe('main', () => {
	it('hello', async () => {
		const context = new ClientSideCrypto<{ a: string; b: string; c: number }>();

		const payload = { a: 'c', b: 'd', c: 69 };

		const encrypted = await context.encrypt(payload);

		const decrypted = await context.decrypt(encrypted.ciphertext, encrypted.key);

		console.log({ encrypted });

		expect(decrypted).to.deep.equal(payload);
	});
});
