import { User } from "./User";

export type Attendance = {
  id: string;
  user: User;
  checkIn: Date | null; // giờ vào
  checkOut: Date | null; // giờ ra
  workHours: number; // tổng giờ làm (8.0)
  note: string; // ghi chú (nếu có)
};
