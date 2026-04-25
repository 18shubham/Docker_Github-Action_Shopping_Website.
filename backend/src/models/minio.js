const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET = 'products';

const initMinio = async () => {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
    console.log('MinIO bucket created');
  } else {
    console.log('MinIO bucket ready');
  }
};

module.exports = { minioClient, BUCKET, initMinio };
