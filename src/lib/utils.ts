import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LinkedListNode {
  _id: string;
  prev?: string | null;
  next?: string | null;
  [key: string]: any;
}

export function sortLinkedList<T extends LinkedListNode>(nodes: T[]): T[] {
  if (!nodes.length) return [];

  const map = new Map<string, T>();
  nodes.forEach((n) => map.set(n._id, n));

  const head = nodes.find((n) => !n.prev) ?? nodes[0];

  const result: T[] = [];
  let current: T | undefined = head;

  while (current) {
    result.push(current);
    current = current.next ? map.get(current.next) : undefined;
  }

  return result;
}
