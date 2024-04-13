"use server";

import {
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2Output,
  ListDirectoryBucketsCommand,
  ListDirectoryBucketsCommandOutput,
  CommonPrefix,
  _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/app/lib/services";
import { FetchResult } from "@/app/components/paginate";

const getPresignedURL = async (bucket: string, key: string) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const listFolders = async (
  bucket: string,
  key: string,
  chunk: number,
  bookmark?: string,
): Promise<FetchResult<CommonPrefix>> => {
  const folderCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
    Delimiter: "/",
    MaxKeys: chunk,
    ContinuationToken: bookmark,
  });

  const response = await s3.send(folderCommand);
  const folders = response.CommonPrefixes || [];
  return {
    bucket,
    type: "folder",
    items: folders.filter(({ Prefix }) => Prefix !== key + "/"),
    bookmark: response.NextContinuationToken,
    
  };
};

const listFiles = async (
  bucket: string,
  key: string,
  chunk: number,
  bookmark?: string,
): Promise<FetchResult<_Object>> => {
  const fileCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
    MaxKeys: chunk,
    ContinuationToken: bookmark,
  });

  const response = await s3.send(fileCommand);
  const files = response.Contents || [];
  const items = await Promise.all(files.map(async (file) => {
    const url = await getPresignedURL(bucket, file.Key);
    return { ...file, url };
  }));
  return {
    bucket,
    type: "file",
    items,
    bookmark: response.NextContinuationToken,
    
  };
};

export { getPresignedURL, listFolders, listFiles };
