import { log } from 'console';
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

log(import.meta.env);

if (!import.meta.env.CLOUDFLARE_BUCKET_ACCESS_KEY)
	throw new Error('CLOUDFLARE_BUCKET_ACCESS_KEY is not set');
if (!import.meta.env.CLOUDFLARE_BUCKET_SECRET_KEY)
	throw new Error('CLOUDFLARE_BUCKET_SECRET_KEY is not set');
if (!import.meta.env.CLOUDFLARE_BUCKET_URL) throw new Error('CLOUDFLARE_BUCKET_URL is not set');
if (!import.meta.env.CLOUDFLARE_BUCKET_NAME) throw new Error('CLOUDFLARE_BUCKET_NAME is not set');

const BucketName = import.meta.env.CLOUDFLARE_BUCKET_NAME;

const environment =
	import.meta.env.NODE_ENV === 'production' ? ('production' as const) : ('development' as const);

const S3 = new S3Client({
	credentials: {
		accessKeyId: import.meta.env.CLOUDFLARE_BUCKET_ACCESS_KEY,
		secretAccessKey: import.meta.env.CLOUDFLARE_BUCKET_SECRET_KEY
	},
	endpoint: import.meta.env.CLOUDFLARE_BUCKET_URL,
	region: 'auto'
});

class StorageClientClass {
	constructor(
		private readonly s3: S3Client,
		private readonly prefix: string
	) {}

	async listObjects() {
		return await this.s3.send(
			new ListObjectsV2Command({ Bucket: BucketName, Prefix: this.prefix })
		);
	}

	async getObject(key: string) {
		return await this.s3.send(new GetObjectCommand({ Bucket: BucketName, Key: key }));
	}
}

export const StorageClient = new StorageClientClass(S3, environment);
