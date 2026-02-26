import {
    createOrganization,
    deleteOrganization,
    getOrganizationById,
    getOrganizations,
    updateOrganization,
} from "./actions";
import type {
    CreateOrganizationRequest,
    OrganizationResponse,
    UpdateOrganizationRequest,
} from "./types";

export class OrganizationController {
    static async getAll(): Promise<OrganizationResponse[]> {
        return getOrganizations();
    }

    static async getById(
        organizationId: string,
    ): Promise<OrganizationResponse> {
        return getOrganizationById(organizationId);
    }

    static async create(
        request: CreateOrganizationRequest,
    ): Promise<OrganizationResponse> {
        return createOrganization(request);
    }

    static async update(
        organizationId: string,
        request: UpdateOrganizationRequest,
    ): Promise<OrganizationResponse> {
        return updateOrganization(organizationId, request);
    }

    static async delete(organizationId: string): Promise<{ value: string }> {
        return deleteOrganization(organizationId);
    }
}
