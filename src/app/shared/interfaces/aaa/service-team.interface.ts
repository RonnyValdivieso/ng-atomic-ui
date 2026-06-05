export type ServiceTeamStatus = 'Active' | 'Inactive';

export interface ServiceTeam {
  id: string;
  name: string;
  status: ServiceTeamStatus;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  squarePicture?: string | null;
  rectangularPicture?: string | null;
}

/**
 * Detail shape for `GET /v1/service-teams/{id}`. Per swagger this is
 * `ServiceTeamResponse` — the same fields as the list row (no extra
 * counts or audit metadata are returned).
 */
export type ServiceTeamDetail = ServiceTeam;

/**
 * Member row from `GET /v1/service-teams/{id}/members` (paginated). The
 * endpoint's response body isn't typed in swagger, so these fields are
 * defensive/optional — refine once a real payload is observed.
 */
export interface ServiceTeamMember {
  id?: string;
  userId?: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  role?: string | null;
  roleName?: string | null;
  picture?: string | null;
}

/**
 * Create payload. Sent as `multipart/form-data` so the two pictures can travel
 * alongside the textual fields in a single request.
 *
 * Field name casing matches what the API multipart endpoint expects
 * (`Name`, `Email`, `Phone`, `Code`, `Address`, `SquarePicture`,
 * `RectangularPicture`). `Code` and `Address` are not in the published swagger
 * spec but the backend accepts them on this endpoint per product decision.
 */
export interface CreateServiceTeamRequest {
  name: string;
  email?: string | null;
  phone?: string | null;
  code?: string | null;
  address?: string | null;
  squarePicture?: File | null;
  rectangularPicture?: File | null;
}

export interface UpdateServiceTeamRequest {
  name: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateServiceTeamStatusRequest {
  status: ServiceTeamStatus;
}
