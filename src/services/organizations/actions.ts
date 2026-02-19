"use server";

import { api } from "@/lib/api";
import type {
    CreateOrganizationRequest,
    OrganizationResponse,
    UpdateOrganizationRequest,
} from "./types";

export async function getOrganizations(): Promise<OrganizationResponse[]> {
    const { data } = await api.get<OrganizationResponse[]>(
        "/api/v1/organizations",
    );
    return data;
}

export async function getOrganizationById(
    organizationId: string,
): Promise<OrganizationResponse> {
    const { data } = await api.get<OrganizationResponse>(
        `/api/v1/organizations/${organizationId}`,
    );
    return data;
}

export async function createOrganization(
    request: CreateOrganizationRequest,
): Promise<OrganizationResponse> {
    const { data } = await api.post<OrganizationResponse>(
        "/api/v1/organizations",
        request,
    );
    return data;
}

export async function updateOrganization(
    organizationId: string,
    request: UpdateOrganizationRequest,
): Promise<OrganizationResponse> {
    const { data } = await api.patch<OrganizationResponse>(
        `/api/v1/organizations/${organizationId}`,
        request,
    );
    return data;
}

export async function deleteOrganization(
    organizationId: string,
): Promise<{ value: string }> {
    const { data } = await api.delete<{ value: string }>(
        `/api/v1/organizations/${organizationId}`,
    );
    return data;
}
