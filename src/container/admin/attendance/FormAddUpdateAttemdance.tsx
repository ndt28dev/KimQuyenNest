"use client";

import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Attendance } from "@/modules/interfaces/Attendance";
import { getUserFullnameAndEmployeeCode } from "@/utils/getUsers";
import { useEffect } from "react";
import { User } from "@/modules/interfaces/User";

type Props = {
  initialValues?: Partial<Attendance> | null;
  onSubmit: (data: Omit<Attendance, "id">) => void;
  onClose: () => void;
};

export default function FormAddUpdateAttendance({
  initialValues,
  onSubmit,
  onClose,
}: Props) {
  const userOptions = getUserFullnameAndEmployeeCode();

  const form = useForm<Omit<Attendance, "id">>({
    initialValues: {
      user: (initialValues?.user as User) || null,
      checkIn: initialValues?.checkIn ? new Date(initialValues.checkIn) : null,
      checkOut: initialValues?.checkOut
        ? new Date(initialValues.checkOut)
        : null,
      workHours: initialValues?.workHours || 0,
      note: initialValues?.note || "",
    },

    validate: {
      user: (v) => (!v ? "Vui lòng chọn nhân viên" : null),
      checkIn: (v) => (!v ? "Vui lòng chọn giờ vào" : null),
      checkOut: (v, values) => {
        if (!v) return "Vui lòng chọn giờ ra";

        if (values.checkIn && v < values.checkIn) {
          return "Giờ ra phải sau giờ vào";
        }

        return null;
      },
    },
  });

  useEffect(() => {
    const { checkIn, checkOut } = form.values;
    if (checkIn && checkOut) {
      const hours = (checkOut.getTime() - checkIn.getTime()) / 36e5;
      form.setFieldValue("workHours", Math.max(0, +hours.toFixed(2)));
    }
  }, [form.values.checkIn, form.values.checkOut]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(values);
      })}
    >
      <Stack gap="md">
        <Select
          label="Nhân viên"
          placeholder="Chọn nhân viên"
          required
          searchable
          data={userOptions}
          value={form.values.user?.id || null}
          onChange={(value) => {
            const selected = userOptions.find((u) => u.value === value);
            form.setFieldValue("user", (selected?.user as User) || null);
          }}
          error={form.errors.user}
        />

        <DateTimePicker
          label="Giờ vào"
          placeholder="Chọn ngày & giờ vào"
          valueFormat="DD/MM/YYYY HH:mm"
          required
          {...form.getInputProps("checkIn")}
        />

        <DateTimePicker
          label="Giờ ra"
          placeholder="Chọn ngày & giờ ra"
          valueFormat="DD/MM/YYYY HH:mm"
          minDate={form.values.checkIn || undefined}
          required
          {...form.getInputProps("checkOut")}
        />

        <TextInput
          label="Tổng giờ làm"
          type="number"
          min={0}
          step={0.5}
          disabled
          readOnly
          {...form.getInputProps("workHours")}
        />

        <Textarea
          label="Ghi chú"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
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
