import { ListObjectsV2Command, ListObjectsV2Output } from "@aws-sdk/client-s3";
import { s3 } from "./lib/services";
import Scroller from "./components/Scroller";

interface ListResponse {
  contents: ListObjectsV2Output["Contents"];
  next?: string;
}

const list = async (
  bucket: string,
  key: string,
  chunk: number,
  next?: string,
): Promise<ListResponse> => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: key,
    MaxKeys: chunk,
    ContinuationToken: next,
  });
  const { Contents, NextContinuationToken } = await s3.send(command);
  return { contents: Contents || [], next: NextContinuationToken };
};

export default async function Home() {
  const grab = (bucket: string, key: string) => async (next?: string) => {
    "use server";
    const response = await list(bucket, key, 16, next);
    const data = response.contents.filter(({ Key }) => Key.endsWith(".jpg"));
    return { data, next: response.next };
  };
  const fetch = grab("pixiv", "2024-02");
  const initial = await fetch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Scroller bucket="pixiv" initial={initial} fetch={fetch} />
    </main>
  );
}
