"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import Picture from "./ui/picture";
import { cn } from "@/lib/utils";

interface VirtualItemProps {
  children?: React.ReactNode;
  onEnter?: () => void;
  onExit?: () => void;
}

function VirtualItem({ children, onEnter, onExit }: VirtualItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: "some" });

  useEffect(() => {
    if (isInView) {
      onEnter?.();
    } else {
      onExit?.();
    }
  }, [isInView]);

  return <div ref={ref}>{children}</div>;
}

interface ScrollerProps<T> {
  initial: { data: T[]; next?: string };
  fetch: (next?: string) => Promise<{ data: T[]; next?: string }>;
  bucket: string;
  n?: number;
  threshold?: number;
}

const distribute = (items: any[], columns: any[][], weights: number[]) => {
  const newColumns = columns.map((column) => [...column]);
  const startIndex = weights.indexOf(Math.min(...weights));
  items.forEach((item, i) => {
    newColumns[(i + startIndex) % columns.length]?.push(item);
  });
  return newColumns;
};

export default function Scroller<T>({
  initial,
  fetch,
  bucket,
  threshold = 0.85,
}: ScrollerProps<T>) {
  const n = 3;
  const [next, setNext] = useState(initial.next);
  const [columns, setColumns] = useState(
    distribute(initial.data, Array(n).fill([]), Array(n).fill(0)),
  );
  const refs = useRef<HTMLDivElement[] | null[]>(columns.map(() => null));
  const [startIndex, setStartIndex] = useState(0);
  const [numItems, setNumItems] = useState(initial.data.length);
  const [endIndex, setEndIndex] = useState(numItems);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  const handleScroll = () => {
    if (!window.scrollbars.visible) setScrollYProgress(1);
    else {
      setScrollYProgress(
        window.scrollY / (document.body.scrollHeight - window.innerHeight),
      );
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollYProgress > threshold) {
      setEndIndex(endIndex + n);
      if (endIndex >= numItems) {
        more();
      }
    }
  }, [scrollYProgress]);

  const more = async () => {
    if (next) {
      const { data, next: nexxt } = await fetch(next);
      const weights = refs.current.map((ref) => ref?.offsetHeight || 0);
      setColumns(distribute(data, columns, weights));
      setNumItems(numItems + data.length);
      setNext(nexxt);
    }
  };

  return (
    <>
      <div className={cn("grid grid-cols-3 gap-4")}>
        {columns.map((column, i) => (
          <div className="h-fit" key={i} ref={(e) => (refs.current[i] = e)}>
            {column.map((item) => (
              <Picture
                className="my-4 rounded"
                key={item.Key}
                location={`${bucket}/${item.Key}`}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
