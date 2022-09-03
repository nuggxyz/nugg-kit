/* eslint-disable max-classes-per-file */
import { subtle, getRandomValues } from 'crypto';

class crypto {
	public static async generateKey() {
		return subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 128,
			},
			true,
			['encrypt', 'decrypt'],
		);
	}

	public static async exportKey(key: CryptoKey) {
		return subtle.exportKey('raw', key);
	}

	public static async importKey(raw: ArrayBuffer) {
		return subtle.importKey(
			'raw',
			raw,
			{
				name: 'AES-GCM',
			},
			false,
			['encrypt', 'decrypt'],
		);
	}

	public static async encrypt(str: string, key: CryptoKey) {
		const encoded = new TextEncoder().encode(str);
		const iv = getRandomValues(new Uint8Array(12));
		const encrypted = await subtle.encrypt(
			{ name: 'AES-GCM', iv } as AesGcmParams,
			key,
			encoded,
		);

		const buf = Buffer.from(encrypted);

		return Buffer.concat([iv, buf]);
	}

	public static async decrypt(encrypted: ArrayBuffer, key: ArrayBuffer) {
		const thekey = await crypto.importKey(key);

		const iv = new Uint8Array(encrypted.slice(0, 12));

		const encryptedData = new Uint8Array(encrypted.slice(12));

		const decrypted = await subtle.decrypt({ name: 'AES-GCM', iv }, thekey, encryptedData);
		const decoded = new TextDecoder().decode(decrypted);
		return decoded;
	}
}

export class ClientSideCrypto<T = object> {
	public async encrypt(obj: T) {
		const key = await crypto.generateKey();

		const raw = await crypto.encrypt(JSON.stringify(obj), key);

		const exported = await crypto.exportKey(key);

		return {
			ciphertext: Buffer.from(raw).toString('base64'),
			key: Buffer.from(exported).toString('base64'),
		};
	}

	public async decrypt(ciphertext64: string, key64: string) {
		const cyphertext = Buffer.from(ciphertext64, 'base64');

		const key = Buffer.from(key64, 'base64');
		const dec = await crypto.decrypt(cyphertext, key);

		return JSON.parse(dec) as T;
	}
}
