import Image from "next/image";
import * as s3 from "@/app/lib/actions/s3";

interface ImagePreviewProps {
  className?: string;
  bucket: string;
  name: string;
}

export default async function ImagePreview(props: ImagePreviewProps) {
  const src = await s3.getPresignedURL(props.bucket, props.name);
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
