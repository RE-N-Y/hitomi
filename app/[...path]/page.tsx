import * as s3 from "@/app/lib/actions/s3";
import Paginate from "../components/paginate";

export default async function Page({ params }: { params: { path: string[] } }) {
  const [bucket, ...key] = params.path;
  const path = key.join("/");

  const folderInitialResults = await s3.listFolders(bucket, path, 16);
  const fetchFolders = (bucket:string, key:string) => async (bookmark?: string) => {
    "use server"
    const folders = await s3.listFolders(bucket, key, 16, bookmark);
    return folders;
  }

  const filesInitialResults = await s3.listFiles(bucket, path, 16);
  const fetchFiles = (bucket:string, key:string) => async (bookmark?: string) => {
    "use server"
    const files = await s3.listFiles(bucket, key, 16, bookmark);
    return files
  }

  // const renderItem = (folder: any) => {
  //   return folder.contents.map(({ Prefix }) => (
  //     <div key={Prefix}>
  //       <Folder bucket={bucket} name={Prefix} />
  //     </div>
  //   ));
  // };

  // const renderFiles = (response: ListFilesResponse) => {
  //   if (!response.contents) {
  //     return <div>No files found</div>;
  //   }
  //   return response.contents.map(({ Key, LastModified, Size }) => (
  //     <div key={Key}>
  //       <File
  //         bucket={bucket}
  //         name={Key}
  //         lastModified={LastModified}
  //         size={Size}
  //       />
  //     </div>
  //   ));
  // };

  return (
    <div className="m-4">
      <h1 className="my-4 text-2xl font-bold">Folders</h1>
      <Paginate initialResults={folderInitialResults} fetchItems={fetchFolders(bucket, path)} />
      <h1 className="my-4 text-2xl font-bold">Files</h1>
      <Paginate initialResults={filesInitialResults} fetchItems={fetchFiles(bucket, path)} />
    </div>
  );
}
