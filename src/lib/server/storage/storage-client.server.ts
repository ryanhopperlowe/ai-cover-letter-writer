import {
	CLOUDFLARE_BUCKET_ACCESS_KEY,
	CLOUDFLARE_BUCKET_NAME,
	CLOUDFLARE_BUCKET_SECRET_KEY,
	CLOUDFLARE_BUCKET_URL,
	NODE_ENV
} from '$env/static/private';
import {
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

const environment = NODE_ENV === 'production' ? ('production' as const) : ('development' as const);

const S3 = new S3Client({
	credentials: {
		accessKeyId: CLOUDFLARE_BUCKET_ACCESS_KEY,
		secretAccessKey: CLOUDFLARE_BUCKET_SECRET_KEY
	},
	endpoint: CLOUDFLARE_BUCKET_URL,
	region: 'auto'
});

class StorageClientClass {
	constructor(
		private readonly s3: S3Client,
		private readonly prefix: string
	) {}

	async listObjects(userId?: string) {
		let Prefix = this.prefix;

		if (userId) {
			Prefix = `${this.prefix}${userId}/`;
		}

		return await this.s3.send(new ListObjectsV2Command({ Bucket: BucketName, Prefix }));
	}

	async getObject(key: string) {
		return await this.s3.send(new GetObjectCommand({ Bucket: BucketName, Key: key }));
	}

	async uploadObject(userId: string, file: File) {
		const key = `${this.prefix}/${userId}/${file.name}`;
		console.log(key);

		return await this.s3.send(
			new PutObjectCommand({
				Bucket: BucketName,
				Key: key,
				Body: await file.text()
			})
		);
	}
}

export const StorageClient = new StorageClientClass(S3, environment);
