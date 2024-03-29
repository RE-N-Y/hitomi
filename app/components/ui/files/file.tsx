import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/app/components/ui/card";
import ImagePreview from "./preview/image";
import { FileIcon } from "lucide-react";

interface FileProps {
  bucket: string;
  name: string;
  size?: number;
  lastModified?: number;
}

const renderPreview = (bucket: string, name: string, type: string) => {
  switch (type) {
    case "png":
    case "jpg":
    case "jpeg":
      return (
        <div className="overflow-y-hidden">
          <ImagePreview
            className="w-full rounded"
            bucket={bucket}
            name={name}
          />
        </div>
      );
    default:
      return (
        <div className="flex h-full w-full items-center justify-center rounded bg-zinc-100">
          <FileIcon size={32} />
        </div>
      );
  }
};

export default function File(props: FileProps) {
  const type = props.name.split(".").pop();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>
          {`Last Modified : ${new Date(props.lastModified).toLocaleString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid aspect-video gap-4">
        {renderPreview(props.bucket, props.name, type)}
      </CardContent>
    </Card>
  );
}
