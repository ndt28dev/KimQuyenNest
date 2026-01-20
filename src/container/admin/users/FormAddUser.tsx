"use client";

import { User } from "@/modules/interfaces/User";
import {
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

type Props = {
  initialValues?: Partial<User> | null;
  onClose: () => void;
  onSubmit: (data: Omit<User, "id" | "employeeCode">) => void;
};

const STORAGE_KEY = "employees";

export function generateEmployeeCode(): string {
  const PREFIX = "KQN";

  // 1️⃣ Lấy 2 số cuối của năm hiện tại
  const year = new Date().getFullYear().toString().slice(-2);

  // 2️⃣ Lấy data từ localStorage
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as {
    employeeCode?: string;
  }[];

  // 3️⃣ Lọc các mã đúng format KQN + year
  const codes = data
    .map((item) => item.employeeCode)
    .filter(
      (code): code is string => !!code && code.startsWith(`${PREFIX}${year}`)
    );

  // 4️⃣ Lấy số lớn nhất
  let maxNumber = 0;

  codes.forEach((code) => {
    // VD: KQN2607 -> lấy 07
    const num = parseInt(code.slice(-2), 10);
    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num;
    }
  });

  // 5️⃣ +1 và format 2 chữ số
  const nextNumber = (maxNumber + 1).toString().padStart(2, "0");

  // 6️⃣ Ghép mã
  return `${PREFIX}${year}${nextNumber}`;
}

export default function FormAddUser({
  onClose,
  onSubmit,
  initialValues,
}: Props) {
  // 1. Lấy dữ liệu cũ
  const oldData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const form = useForm({
    initialValues: {
      employeeCode: initialValues?.employeeCode || generateEmployeeCode(),
      fullName: initialValues?.fullName || "",
      gender: initialValues?.gender || "",
      dob: initialValues?.startDate ? new Date(initialValues.startDate) : null,
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      address: initialValues?.address || "",
      department: initialValues?.department || "",
      position: initialValues?.position || "",
      startDate: initialValues?.startDate
        ? new Date(initialValues.startDate)
        : new Date(),
      status: initialValues?.status || "active",
      note: initialValues?.note || "",
    },

    validate: {
      employeeCode: (v) => (!v ? "Vui lòng nhập mã nhân viên" : null),

      fullName: (v) => (!v ? "Vui lòng nhập họ tên" : null),

      gender: (v) => (!v ? "Vui lòng chọn giới tính" : null),

      dob: (v: Date | null) => {
        if (!v) return "Vui lòng chọn ngày sinh";
        if (v > new Date()) return "Ngày sinh không được ở tương lai";
        return null;
      },

      phone: (v) => {
        if (!v) return "Vui lòng nhập số điện thoại";
        if (!/^0\d{9}$/.test(v))
          return "Số điện thoại phải bắt đầu bằng 0 và đủ 10 số";
        return null;
      },

      email: (v) => {
        if (!v) return "Vui lòng nhập email";
        if (!/^\S+@\S+\.\S+$/.test(v)) return "Email không đúng định dạng";
        return null;
      },

      address: (v) => (!v ? "Vui lòng nhập địa chỉ" : null),

      department: (v) => (!v ? "Vui lòng chọn phòng ban" : null),

      position: (v) => (!v ? "Vui lòng chọn chức vụ" : null),

      startDate: (v) => (!v ? "Vui lòng chọn ngày vào làm" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <Group grow>
          <TextInput
            label="Mã nhân viên"
            value={form.values.employeeCode}
            withAsterisk
            readOnly
            disabled
            {...form.getInputProps("employeeCode")}
          />
          <TextInput
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            withAsterisk
            {...form.getInputProps("fullName")}
          />
        </Group>

        <Group grow>
          <Select
            label="Giới tính"
            placeholder="Chọn giới tính"
            withAsterisk
            data={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
              { value: "other", label: "Khác" },
            ]}
            {...form.getInputProps("gender")}
          />

          <DateInput
            label="Ngày sinh"
            placeholder="dd/mm/yyyy"
            maxDate={new Date()} // ✅ chặn ngày tương lai
            {...form.getInputProps("dob")}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Số điện thoại"
            placeholder="0123456789"
            withAsterisk
            {...form.getInputProps("phone")}
          />

          <TextInput
            label="Email"
            placeholder="email@example.com"
            withAsterisk
            {...form.getInputProps("email")}
          />
        </Group>

        <TextInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          {...form.getInputProps("address")}
        />

        <Group grow>
          <Select
            label="Phòng ban"
            placeholder="Chọn phòng ban"
            data={["Quay phim", "Kỹ thuật", "Livestream", "Kế toán"]}
            {...form.getInputProps("department")}
          />

          <Select
            label="Chức vụ"
            placeholder="Chọn chức vụ"
            data={["Nhân viên", "Quản lý", "Admin"]}
            {...form.getInputProps("position")}
          />
        </Group>

        <Group grow>
          <DateInput
            label="Ngày vào làm"
            placeholder="dd/mm/yyyy"
            {...form.getInputProps("startDate")}
          />

          <Select
            label="Trạng thái"
            data={[
              { value: "active", label: "Đang làm" },
              { value: "inactive", label: "Nghỉ việc" },
            ]}
            {...form.getInputProps("status")}
          />
        </Group>

        <Textarea
          label="Ghi chú"
          placeholder="Thông tin thêm..."
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => {
              onClose();
              form.reset();
            }}
          >
            Hủy
          </Button>
          <Button type="submit" color="teal">
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
