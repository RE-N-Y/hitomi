import * as s3 from "@/app/lib/actions/s3";
import Paginate from "../components/paginate";

export default async function Page({ params }: { params: { path: string[] } }) {
  const [bucket, ...key] = params.path;
  const path = key.join("/");

  const folderInitialResults = await s3.listFolders(bucket, path, 16);
  const fetchFolders = (bucket:string, key:string) => async (bookmark?: string, suffix?: string[]) => {
    "use server"
    const folders = await s3.listFolders(bucket, key, 16, bookmark);
    return folders;
  }

  const filesInitialResults = await s3.listFiles(bucket, path, 16);
  const fetchFiles = (bucket:string, key:string) => async (bookmark?: string, suffix?: string[]) => {
    "use server"
    const files = await s3.listFiles(bucket, key, 16, bookmark, suffix);
    return files
  }

  return (
    <div className="m-4">
      <h1 className="my-4 text-2xl font-bold">Folders</h1>
      <Paginate initialResults={folderInitialResults} fetchItems={fetchFolders(bucket, path)} />
      <h1 className="my-4 text-2xl font-bold pr-4 mr-4 border-r border-r-zinc-500">Files</h1>
      <Paginate initialResults={filesInitialResults} fetchItems={fetchFiles(bucket, path)} enableFilter />
    </div>
  );
}
