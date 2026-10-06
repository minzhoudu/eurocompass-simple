import { UserRole } from "../models";

export type CreateAdminUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateAdminUserDto = Partial<
  Pick<CreateAdminUserDto, "firstName" | "lastName" | "email" | "role">
> & { isActive?: boolean };
