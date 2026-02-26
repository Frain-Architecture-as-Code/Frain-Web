export enum OrganizationVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export interface CreateOrganizationRequest {
    name: string;
    visibility?: OrganizationVisibility;
}

export interface UpdateOrganizationRequest {
    name?: string;
    visibility?: OrganizationVisibility;
}

export interface OrganizationResponse {
    organizationId: string;
    ownerMemberId: string;
    name: string;
    visibility: OrganizationVisibility;
    createdAt: string;
    updatedAt: string;
}
