import {
  ListObjectsV2Command,
  ListObjectsV2Output,
  ListDirectoryBucketsCommand,
  ListDirectoryBucketsCommandOutput,
} from "@aws-sdk/client-s3";
import { s3 } from "@/app/lib/services";
import File from "../components/ui/files/file";
import Folder from "../components/ui/files/folder";

interface ListFilesResponse {
  contents: ListObjectsV2Output["Contents"];
  next?: string;
}

interface ListFoldersResponse {
  contents: ListObjectsV2Output["CommonPrefixes"];
  next?: string;
}

interface ListResponse {
  files: ListFilesResponse;
  folders: ListFoldersResponse;
}

const listObjects = async (
  bucket: string,
  key: string,
  chunk: number,
  next?: string,
): Promise<ListResponse> => {
  const folderCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
    Delimiter: "/",
    MaxKeys: chunk,
    ContinuationToken: next,
  });

  const fileCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
    MaxKeys: chunk,
    ContinuationToken: next,
  });
  const folderResponse = await s3.send(folderCommand);
  const fileResponse = await s3.send(fileCommand);

  return {
    files: {
      contents: fileResponse.Contents || [],
      next: fileResponse.NextContinuationToken,
    },
    folders: {
      contents: folderResponse.CommonPrefixes || [],
      next: folderResponse.NextContinuationToken,
    },
  };
};

export default async function Page({ params }: { params: { path: string[] } }) {
  const [bucket, ...key] = params.path;
  const response = await listObjects(bucket, key.join("/"), 16);
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {response.folders.contents.map(({ Prefix }) => (
        <div key={Prefix}>
          <Folder bucket={bucket} name={Prefix} />
        </div>
      ))}
      {response.files.contents.map(({ Key, LastModified, Size }) => (
        <div key={Key}>
          <File
            bucket={bucket}
            name={Key}
            lastModified={LastModified}
            size={Size}
          />
        </div>
      ))}
    </div>
  );
}
