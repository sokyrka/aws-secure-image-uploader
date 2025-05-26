import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME!;
const URL_EXPIRATION_SECONDS = 60;

export const imageUploadUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const claims = event.requestContext.authorizer?.claims;
        const userId = claims?.sub;
        const filename = event.queryStringParameters?.filename;

        if (!userId || !filename) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing userId or filename in the request' }),
            };
        }

        const key = `uploads/${userId}/${filename}`;

        const signedUrl = s3.getSignedUrl('putObject', {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: URL_EXPIRATION_SECONDS,
            ContentType: 'image/jpeg',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ uploadUrl: signedUrl, key }),
        };
    } catch (error) {
        console.error('Error generating signed URL:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error: could not generate upload URL',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};

export const getDownloadUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const claims = event.requestContext.authorizer?.claims;
        const userId = claims?.sub;
        const key = decodeURIComponent(event.pathParameters?.key || '');

        if (!userId || !key.startsWith(`uploads/${userId}/`)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied or invalid key' }),
            };
        }

        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: URL_EXPIRATION_SECONDS,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ downloadUrl: signedUrl }),
        };
    } catch (error) {
        console.error('Error generating download URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }),
        };
    }
};

export const listUserFiles = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const claims = event.requestContext.authorizer?.claims;
        const userId = claims?.sub;

        if (!userId) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied' }),
            };
        }

        const result = await s3
            .listObjectsV2({
                Bucket: BUCKET_NAME,
                Prefix: `uploads/${userId}/`,
            })
            .promise();

        const files = result.Contents?.map((obj) => obj.Key) || [];

        return {
            statusCode: 200,
            body: JSON.stringify({ files }),
        };
    } catch (error) {
        console.error('Error listing files:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }),
        };
    }
};

export const deleteFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const claims = event.requestContext.authorizer?.claims;
        const userId = claims?.sub;
        const key = decodeURIComponent(event.pathParameters?.key || '');

        if (!userId || !key.startsWith(`uploads/${userId}/`)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied or invalid key' }),
            };
        }

        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }),
        };
    }
};
