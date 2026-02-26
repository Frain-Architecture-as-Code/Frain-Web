import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type {
    C4ModelResponse,
    GetProjectDetailsResponse,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "@/services/c4models/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const {
    getC4Model,
    updateC4Model,
    getViewSummaries,
    getViewDetail,
    updateNodePosition,
    getProjectDetails,
} = await import("@/services/c4models/actions");

const mockGet = api.get as Mock;
const mockPut = api.put as Mock;
const mockPatch = api.patch as Mock;

const sampleC4Model: C4ModelResponse = {
    projectId: "project-1",
    c4Model: {
        title: "My System",
        description: "Architecture overview",
        updatedAt: "2024-01-01T00:00:00Z",
        views: [
            {
                id: "view-1",
                type: "CONTEXT",
                name: "System Context",
                nodes: [
                    {
                        id: "node-1",
                        type: "PERSON",
                        name: "User",
                        description: "A user",
                        technology: "",
                        x: 100,
                        y: 200,
                    },
                ],
                externalNodes: [],
                relations: [],
            },
        ],
    },
};

const sampleViewSummary: ViewSummaryResponse = {
    id: "view-1",
    type: "CONTEXT",
    name: "System Context",
};

const sampleViewDetail: ViewDetailResponse = {
    id: "view-1",
    type: "CONTEXT",
    name: "System Context",
    nodes: [
        {
            id: "node-1",
            type: "PERSON",
            name: "User",
            description: "A user",
            technology: "",
            x: 100,
            y: 200,
        },
    ],
    externalNodes: [],
    relations: [
        {
            sourceId: "node-1",
            targetId: "node-2",
            description: "Uses",
            technology: "HTTPS",
        },
    ],
};

const sampleProjectDetails: GetProjectDetailsResponse = {
    title: "My System",
    description: "Architecture overview",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getC4Model", () => {
    it("returns the C4 model for a project", async () => {
        mockGet.mockResolvedValue({ data: sampleC4Model });

        const result = await getC4Model("project-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1",
        );
        expect(result).toEqual(sampleC4Model);
    });

    it("throws Error with ApiError message", async () => {
        mockGet.mockRejectedValue(
            new ApiError(
                {
                    code: "NOT_FOUND",
                    message: "Model not found",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                404,
            ),
        );

        await expect(getC4Model("project-999")).rejects.toThrow(
            "Model not found",
        );
    });
});

describe("updateC4Model", () => {
    it("puts and returns the updated model", async () => {
        mockPut.mockResolvedValue({ data: sampleC4Model });

        const result = await updateC4Model("project-1", sampleC4Model.c4Model);

        expect(mockPut).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1",
            sampleC4Model.c4Model,
        );
        expect(result).toEqual(sampleC4Model);
    });
});

describe("getViewSummaries", () => {
    it("returns view summaries for a project", async () => {
        mockGet.mockResolvedValue({ data: [sampleViewSummary] });

        const result = await getViewSummaries("project-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1/views",
        );
        expect(result).toEqual([sampleViewSummary]);
    });
});

describe("getViewDetail", () => {
    it("returns detailed view data", async () => {
        mockGet.mockResolvedValue({ data: sampleViewDetail });

        const result = await getViewDetail("project-1", "view-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1/views/view-1",
        );
        expect(result).toEqual(sampleViewDetail);
        expect(result.nodes).toHaveLength(1);
        expect(result.relations).toHaveLength(1);
    });
});

describe("updateNodePosition", () => {
    it("patches node position and returns updated view", async () => {
        mockPatch.mockResolvedValue({ data: sampleViewDetail });

        const request = { x: 300, y: 400 };
        const result = await updateNodePosition(
            "project-1",
            "view-1",
            "node-1",
            request,
        );

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1/views/view-1/nodes/node-1",
            request,
        );
        expect(result).toEqual(sampleViewDetail);
    });

    it("throws on failure", async () => {
        mockPatch.mockRejectedValue(
            new ApiError(
                {
                    code: "NOT_FOUND",
                    message: "Node not found",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                404,
            ),
        );

        await expect(
            updateNodePosition("project-1", "view-1", "node-999", {
                x: 0,
                y: 0,
            }),
        ).rejects.toThrow("Node not found");
    });
});

describe("getProjectDetails", () => {
    it("returns project details", async () => {
        mockGet.mockResolvedValue({ data: sampleProjectDetails });

        const result = await getProjectDetails("project-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/c4models/projects/project-1/details",
        );
        expect(result).toEqual(sampleProjectDetails);
    });

    it("throws generic message for unexpected errors", async () => {
        mockGet.mockRejectedValue(new TypeError("Network error"));

        await expect(getProjectDetails("project-1")).rejects.toThrow(
            "An unexpected error occurred",
        );
    });
});
