"use client"

import React, { useState } from "react";
import Folder from "./ui/files/folder";
import File from "./ui/files/file";
import { Button } from "./ui/button";

interface PaginateProps<T> {
    initialResults: T;
    fetchItems: (bookmark?: string) => Promise<T>;
}

export interface FetchResult<T> {
    items: T[];
    bookmark?: string;
    bucket: string;
    type: "file" | "folder";
}

export default function Paginate<T>({ initialResults,  fetchItems }: PaginateProps<FetchResult<T>>) {
    const [results, setResults] = useState(initialResults);
    const [hasNext, setHasNext] = useState(!!results.bookmark);

    const renderItem = (item:T) => {
        switch (results.type) {
            case "folder":
                return (
                    <div key={item.Prefix}>
                        <Folder bucket={results.bucket} name={item.Prefix} />
                    </div>
                );
            case "file":
                return (
                    <div key={item.Key}>
                        <File bucket={results.bucket} name={item.Key} lastModified={item.LastModified} url={item.url} />
                    </div>
                );
        }
    }

    const loadMore = async () => {
        const newResults = await fetchItems(results.bookmark);
        setHasNext(!!newResults.bookmark);
        setResults({
            ...newResults,
            items: [...results.items, ...newResults.items]
        });
    }

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-3">
                {results.items.map(renderItem)}
            </div>
            <div className="flex justify-center">
                {hasNext && (
                    <Button onClick={loadMore}>
                        Load More
                    </Button>
                )}
            </div>
        </div>
    );
}