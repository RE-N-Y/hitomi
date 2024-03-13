import Image from "next/image";
import { useEffect, useState } from "react";
import { getPresignedURL } from "@/app/lib/actions";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface PictureProps {
  className?: string;
  location: `${string}/${string}`;
}

export default function Picture({ className, location }: PictureProps) {
  const [bucket, ...rest] = location.split("/");
  const key = rest.join("/");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchURL = async () => {
      const url = await getPresignedURL(bucket, key);
      setUrl(url);
    };
    fetchURL();
  }, [bucket, key]);

  if (!url)
    return <Skeleton className={cn("aspect-square w-full", className)} />;
  return (
    <Image className={className} src={url} width={512} height={512} alt="alt" />
  );
}
