export interface OrganizationName {
    value: string;
}

export type OrganizationVisibility = "PUBLIC" | "PRIVATE";

export interface CreateOrganizationRequest {
    name: OrganizationName;
    visibility?: OrganizationVisibility;
}

export interface UpdateOrganizationRequest {
    name?: OrganizationName;
    visibility?: OrganizationVisibility;
}

export interface OrganizationResponse {
    organizationId: string;
    ownerMemberId: string;
    name: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
}
