"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

export interface FetchResult<T> {
  items: T[];
  bookmark?: string;
}

export interface ViewerProps<T> {
  fetch: (...args: any[]) => Promise<FetchResult<T>>;
  renderItem: (item: T) => JSX.Element;
  initialResult: FetchResult<T>;
}

export default function Viewer<T>({
  fetch,
  renderItem,
  initialResult,
}: ViewerProps<T>) {
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {result.items.map(renderItem)}
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const { items: newItems, bookmark: newBookmark } = await fetch(
            result.bookmark,
          );
          setResult({
            items: [...result.items, ...newItems],
            bookmark: newBookmark,
          });
          setLoading(false);
        }}
      >
        Load More
      </Button>
    </>
  );
}
