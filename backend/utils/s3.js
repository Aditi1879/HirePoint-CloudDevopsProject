
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromIni } from "@aws-sdk/credential-providers";

// Use local AWS SSO credentials when AWS_PROFILE is set.
// On EC2, automatically use the attached IAM role.
const credentials = process.env.AWS_PROFILE
    ? fromIni({ profile: process.env.AWS_PROFILE })
    : undefined;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    ...(credentials ? { credentials } : {})
});

export const uploadResumeToS3 = async (file, userId) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `resumes/${userId}/${Date.now()}-${safeName}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }));

    return key;
};

export const getResumeDownloadUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
    });

    return getSignedUrl(s3, command, { expiresIn: 300 });
};
