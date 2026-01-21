import { User } from "@/modules/interfaces/User";

const USER_STORAGE_KEY = "users";

export const getUserFullnameAndEmployeeCode = () => {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  const users: User[] = raw ? JSON.parse(raw) : [];

  return users.map((u) => ({
    label: `${u.fullName} - ${u.employeeCode}`,
    user: u,
    value: u.id,
  }));
};
