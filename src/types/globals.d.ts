export {};
export type Roles = "Admin" | "org:admin" | "unauthorized";
declare global {
  interface CustomJwtSessionClaims {
    membership: Record<string, string>;
    departament: Record<string, string>;
    role?: Roles;
  }
}
