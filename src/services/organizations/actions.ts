"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type {
    CreateOrganizationRequest,
    OrganizationResponse,
    UpdateOrganizationRequest,
} from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getOrganizations(): Promise<OrganizationResponse[]> {
    try {
        const { data } = await api.get<OrganizationResponse[]>(
            "/api/v1/organizations",
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getOrganizationById(
    organizationId: string,
): Promise<OrganizationResponse> {
    try {
        const { data } = await api.get<OrganizationResponse>(
            `/api/v1/organizations/${organizationId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function createOrganization(
    request: CreateOrganizationRequest,
): Promise<OrganizationResponse> {
    try {
        const { data } = await api.post<OrganizationResponse>(
            "/api/v1/organizations",
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateOrganization(
    organizationId: string,
    request: UpdateOrganizationRequest,
): Promise<OrganizationResponse> {
    try {
        const { data } = await api.patch<OrganizationResponse>(
            `/api/v1/organizations/${organizationId}`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function deleteOrganization(
    organizationId: string,
): Promise<{ value: string }> {
    try {
        const { data } = await api.delete<{ value: string }>(
            `/api/v1/organizations/${organizationId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
