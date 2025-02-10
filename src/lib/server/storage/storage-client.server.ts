import {
	CLOUDFLARE_BUCKET_ACCESS_KEY,
	CLOUDFLARE_BUCKET_NAME,
	CLOUDFLARE_BUCKET_SECRET_KEY,
	CLOUDFLARE_BUCKET_URL
} from '$env/static/private';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';

if (!CLOUDFLARE_BUCKET_ACCESS_KEY) throw new Error('CLOUDFLARE_BUCKET_ACCESS_KEY is not set');
if (!CLOUDFLARE_BUCKET_SECRET_KEY) throw new Error('CLOUDFLARE_BUCKET_SECRET_KEY is not set');
if (!CLOUDFLARE_BUCKET_URL) throw new Error('CLOUDFLARE_BUCKET_URL is not set');
if (!CLOUDFLARE_BUCKET_NAME) throw new Error('CLOUDFLARE_BUCKET_NAME is not set');

const BucketName = CLOUDFLARE_BUCKET_NAME;

const environment =
	process.env.NODE_ENV === 'production' ? ('production' as const) : ('development' as const);

const S3 = new S3Client({
	credentials: {
		accessKeyId: CLOUDFLARE_BUCKET_ACCESS_KEY,
		secretAccessKey: CLOUDFLARE_BUCKET_SECRET_KEY
	},
	endpoint: CLOUDFLARE_BUCKET_URL,
	region: 'auto'
});

type KeyParams = {
	format: string;
	userId: string;
	itemId?: string;
};

class StorageClientClass {
	constructor(
		private readonly s3: S3Client,
		private readonly prefix: string
	) {}

	async listObjectsForUser(userId: string) {
		const Prefix = this.#getKey({ format: 'pdf', userId });

		const res = await this.s3.send(new ListObjectsV2Command({ Bucket: BucketName, Prefix }));

		return res.Contents;
	}

	async getObject(userId: string, itemId: string) {
		const key = this.#getKey({ format: 'pdf', userId, itemId });

		return await this.s3.send(new GetObjectCommand({ Bucket: BucketName, Key: key }));
	}

	async uploadObject(userId: string, file: File) {
		const itemId = crypto.randomUUID();
		const key = this.#getKey({ format: 'pdf', userId, itemId });

		const res = await this.s3.send(
			new PutObjectCommand({
				Bucket: BucketName,
				Key: key,
				Body: await file.text()
			})
		);

		return { res, id: itemId };
	}

	async deleteObject(userId: string, itemId: string) {
		const key = this.#getKey({ format: 'pdf', userId, itemId });

		await this.s3.send(new DeleteObjectCommand({ Bucket: BucketName, Key: key }));
	}

	#getKey({ format, userId, itemId }: KeyParams) {
		let prefix = `${this.prefix}/${userId}/${format}`;

		if (itemId) {
			prefix += `/${itemId}`;
		}

		return prefix;
	}
}

export const StorageClient = new StorageClientClass(S3, environment);
