const AWS = require('aws-sdk');

const s3Upload = (filename, data) => {
    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3Response) => {
            if (err) {
                reject(err);
            } else {
                resolve(s3Response.Location);
            }
        });
    });
};

module.exports = {
    s3Upload
}