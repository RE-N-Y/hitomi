"use client"

import React, { useEffect, useState } from "react";
import Folder from "./ui/files/folder";
import File from "./ui/files/file";
import { Button } from "./ui/button";
import { Masonry, useInfiniteLoader } from "masonic";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";


interface PaginateProps<T> {
    initialResults: T;
    fetchItems: (bookmark?: string, suffix?: string[]) => Promise<T>;
    enableFilter?: boolean;
}

export interface FetchResult<T> {
    items: T[];
    bookmark?: string;
    bucket: string;
    type: "file" | "folder";
}

interface S3Item {
    id: string;
    url: string;
    Key: string;
    Prefix: string;
    LastModified: number;
}

export default function Paginate<T extends S3Item>({ initialResults, fetchItems, enableFilter }: PaginateProps<FetchResult<T>>) {
    const [results, setResults] = useState(initialResults);
    const [displayResults, setDisplayResults] = useState(results);
    const [hasNext, setHasNext] = useState(!!results.bookmark);
    const loadMore = useInfiniteLoader(async (startIndex, stopIndex, currentItems) => {
        const newResults = await fetchItems(results.bookmark);
        setHasNext(!!newResults.bookmark);
        const updatedResults = {
            ...newResults,
            items: [...results.items, ...newResults.items]
        };
        setResults(updatedResults);
    }, 
    {
        isItemLoaded: (index, items) => !!items[index],
        minimumBatchSize: 32,
        threshold: 3
    });

    const [type, setType] = useState("all");
    const [date, setDate] = useState("oldest");

    const type2suffix = (type: string) => {
        switch (type) {
            case "image":
                return [".jpg", ".jpeg", ".png", ".gif"];
            case "video":
                return [".mp4", ".mov", ".avi", ".mkv"];
            case "json":
                return [".json"];
            case "misc":
                return [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];
            default:
                return undefined;
        }
    }

    const getURLSuffix = (url: string) => {
        // e.g. https://pixiv.s3.us-east-1.wasabisys.com/2024-02-18/116123522.jpg?...... > .jpg
        const [baseUrl, ..._] = url.split('?');
        const match = baseUrl.match(/\.([^\/]+)$/)
        return match ? match[1] : ''
    }

    const S3ItemCard = ({ index, data, width } : { index:number, data:T, width:number }) => {
        switch (results.type) {
            case "folder":
                return (
                    <div key={data.Prefix}>
                        <Folder bucket={results.bucket} name={data.Prefix} />
                    </div>
                );
            case "file":
                return (
                    <div key={data.Key}>
                        <File bucket={results.bucket} name={data.Key} lastModified={data.LastModified} url={data.url} />
                    </div>
                );
        }
    }

    useEffect(() => {
        setDisplayResults(results);
    }, [results]);

    const renderFilter = () => {
        if (!enableFilter) {
            return null;
        }
        return <div className="flex gap-3">
        <Select onValueChange={(type) => setType(type)}>
            <SelectTrigger className="max-w-[8rem]">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="all">all</SelectItem>
                    <SelectItem value="image">image</SelectItem>
                    <SelectItem value="video">video</SelectItem>
                    <SelectItem value="json">json</SelectItem>
                    <SelectItem value="misc">misc</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        {/* <Select onValueChange={(date) => setDate(date)}>
            <SelectTrigger className="max-w-[8rem]">
                <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="oldest">oldest</SelectItem>
                    <SelectItem value="latest">latest</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select> */}
    </div>
    }
    
    return (
        <div className="flex flex-col gap-3">
            {renderFilter()}
            <Masonry 
                items={displayResults.items} 
                render={S3ItemCard} 
                onRender={loadMore}
                columnGutter={4} 
                overscanBy={1.25} 
                ssrWidth={386}
                columnWidth={386}
            />
            {/* <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {displayResults.items.length > 0 ? displayResults.items.map(renderItem) : <div>No items</div>}
            </div>
            {displayResults.items.length > 0 && (
            <div className="flex justify-center">
                {hasNext && (
                    <Button onClick={loadMore}>
                        Load More
                    </Button>
                )}
            </div>)} */}
        </div>
    );
}