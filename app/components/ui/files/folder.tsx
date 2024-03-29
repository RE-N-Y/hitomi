import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { FolderIcon } from "lucide-react";

interface FolderProps {
  name: string;
  bucket: string;
}

export default function Folder({ name, bucket }: FolderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-4">
            <FolderIcon size={24} />
            <Link href={`/${bucket}/${name}`}>{name}</Link>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
