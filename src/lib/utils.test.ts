import { describe, expect, it } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("cn", () => {
    it("merges class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
        expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("handles undefined and null inputs", () => {
        expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("resolves tailwind conflicts with last-wins", () => {
        expect(cn("px-4", "px-2")).toBe("px-2");
    });

    it("resolves complex tailwind conflicts", () => {
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("merges with clsx arrays", () => {
        expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("returns empty string for no inputs", () => {
        expect(cn()).toBe("");
    });

    it("handles clsx object syntax", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });
});

describe("formatDate", () => {
    it("formats an ISO date string to US locale", () => {
        const result = formatDate("2024-01-15T12:00:00Z");
        expect(result).toBe("Jan 15, 2024");
    });

    it("formats another date correctly", () => {
        const result = formatDate("2023-12-25T12:00:00Z");
        expect(result).toBe("Dec 25, 2023");
    });

    it("formats a mid-year date correctly", () => {
        const result = formatDate("2025-06-15T12:00:00Z");
        expect(result).toBe("Jun 15, 2025");
    });
});
