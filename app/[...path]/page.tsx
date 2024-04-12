import File from "../components/ui/files/file";
import Folder from "../components/ui/files/folder";
import { Button } from "../components/ui/button";
import Viwer from "../components/viewers/viewer";
import * as s3 from "@/app/lib/actions/s3";

export default async function Page({ params }: { params: { path: string[] } }) {
  const [bucket, ...key] = params.path;

  const folderInitialResults = await s3.listFolders(bucket, key.join("/"), 16);
  const renderItem = (folder: any) => {
    return folder.contents.map(({ Prefix }) => (
      <div key={Prefix}>
        <Folder bucket={bucket} name={Prefix} />
      </div>
    ));
  };

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
      <Paginater fetch={s3.listFolders} initialResult={folderInitialResults} />
      <h1 className="my-4 text-2xl font-bold">Files</h1>
      {/* <div className="grid grid-cols-4 gap-4">
        {renderFiles(response.files)}
      </div> */}
    </div>
  );
}
