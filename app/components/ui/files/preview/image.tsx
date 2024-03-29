import Image from "next/image";
import { getPresignedURL } from "@/app/lib/actions";

interface ImagePreviewProps {
  className?: string;
  bucket: string;
  name: string;
}

export default async function ImagePreview(props: ImagePreviewProps) {
  const src = await getPresignedURL(props.bucket, props.name);
  return (
    <Image
      className={props.className}
      src={src}
      alt="alt"
      width={256}
      height={256}
    />
  );
}
