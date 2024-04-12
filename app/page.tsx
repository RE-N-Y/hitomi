import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/lib/services";
import Link from "next/link";

const listBuckets = async () => {
  const client = new ListBucketsCommand({ region: "us-west-2" });
  const response = await s3.send(client);
  return response;
};

export default async function Home() {
  const buckets = await listBuckets();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div>
        <h1>Welcome to SS3</h1>
        {buckets.Buckets?.map((bucket) => (
          <div key={bucket.Name}>
            <Link href={`/${bucket.Name}`}>{bucket.Name}</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
