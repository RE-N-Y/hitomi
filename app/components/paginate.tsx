"use client"

import React, { useEffect, useState } from "react";
import Folder from "./ui/files/folder";
import File from "./ui/files/file";
import { Button } from "./ui/button";
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

export default function Paginate<T>({ initialResults,  fetchItems, enableFilter }: PaginateProps<FetchResult<T>>) {
    const [results, setResults] = useState(initialResults);
    const [displayResults, setDisplayResults] = useState(results);
    const [hasNext, setHasNext] = useState(!!results.bookmark);

    const [type, setType] = useState("all");
    const [date, setDate] = useState("oldest");

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

    const loadMore = async () => {
        const newResults = await fetchItems(results.bookmark, type2suffix(type));
        setHasNext(!!newResults.bookmark);
        const updatedResults = {
            ...newResults,
            items: [...results.items, ...newResults.items]
        };
        setResults(updatedResults);
    }

    useEffect(() => {
        setDisplayResults(results);
    }, [results]);

    useEffect(() => {
        const suffix = type2suffix(type);
        if (!suffix) {
            setDisplayResults(results);
            return;
        }
        setDisplayResults({
            ...results,
            items: results.items.filter((item) => {
                return suffix.some((ext) => item.Key.endsWith(ext))
            })
        })
    }, [type, results]);

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
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {displayResults.items.map(renderItem)}
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