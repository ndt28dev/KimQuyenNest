"use client";
import FormModalAddUpdate from "@/components/admin/FormModalAddUpdate";
import MyLayoutAdmin from "@/components/admin/MyLayoutAdmin";
import TableData from "@/components/admin/TableData";
import { Attendance } from "@/modules/interfaces/Attendance";
import { formatDateTime, formatDateUTC } from "@/utils/date";
import { ActionIcon, Button, Fieldset, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconClockCheck,
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useState } from "react";
import FormAddUpdateAttemdance from "./FormAddUpdateAttemdance";

const STORAGE_KEY = "attendance";

const getAttendanceFromLocal = (): Attendance[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveAttendanceToLocal = (data: Attendance[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const attendanceColumns = (
  onEdit?: (row: Attendance) => void,
  onDelete?: (row: Attendance) => void
): MRT_ColumnDef<Attendance>[] => [
  {
    id: "stt",
    header: "STT",
    size: 60,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "user.fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "checkIn",
    header: "Giờ vào",
    size: 130,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value ? formatDateTime(value) : "-";
    },
  },

  {
    accessorKey: "checkOut",
    header: "Giờ ra",
    size: 130,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value ? formatDateTime(value) : "-";
    },
  },
  {
    accessorKey: "workHours",
    header: "Giờ làm",
    size: 100,
    Cell: ({ cell }) => `${cell.getValue<number>()} giờ`,
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    size: 200,
    Cell: ({ cell }) => (
      <Text size="sm" style={{ whiteSpace: "normal" }}>
        {cell.getValue<string>() || "-"}
      </Text>
    ),
  },

  {
    id: "actions",
    header: "Thao tác",
    size: 100,
    enableSorting: false,
    Cell: ({ row }) => (
      <Group gap="xs">
        <ActionIcon color="yellow" onClick={() => onEdit?.(row.original)}>
          <IconEdit size={16} />
        </ActionIcon>

        <ActionIcon color="red" onClick={() => onDelete?.(row.original)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    ),
  },
];

export default function PageAttendance() {
  const [data, setData] = useState<Attendance[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(
    null
  );

  useEffect(() => {
    setData(getAttendanceFromLocal());
  }, []);

  const handleSubmit = (formData: Omit<Attendance, "id">) => {
    let newData: Attendance[];

    if (editingAttendance) {
      // 👉 UPDATE
      newData = data.map((item) =>
        item.id === editingAttendance.id
          ? {
              ...item,
              user: formData.user,
              checkIn: formData.checkIn,
              checkOut: formData.checkOut,
              workHours: formData.workHours,
              note: formData.note,
            }
          : item
      );

      notifications.show({
        title: "Thành công",
        message: "Cập nhật chấm công thành công",
        color: "green",
        autoClose: 3000,
      });
    } else {
      // 👉 ADD
      const newAttendance: Attendance = {
        id: crypto.randomUUID(),
        ...formData,
      };

      newData = [...data, newAttendance];

      notifications.show({
        title: "Thành công",
        message: "Thêm chấm công thành công",
        color: "green",
        autoClose: 3000,
      });
    }

    setData(newData);
    saveAttendanceToLocal(newData);

    setEditingAttendance(null);
    setIsOpenModal(false);
  };

  const handleEdit = (row: Attendance) => {
    setEditingAttendance(row);
    setIsOpenModal(true);
  };
  const handleDelete = (row: Attendance) => {
    modals.openConfirmModal({
      title: "Xác nhận xóa",
      centered: true,

      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa chấm công của{" "}
          <b>{row.user?.fullName || "nhân viên"}</b> không?
        </Text>
      ),

      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },

      onConfirm: () => {
        const newData = data.filter((item) => item.id !== row.id);

        setData(newData);
        saveAttendanceToLocal(newData);

        notifications.show({
          title: "Đã xóa",
          message: "Đã xóa chấm công thành công",
          color: "red",
          autoClose: 3000,
        });
      },
    });
  };

  const handleDeveloping = (feature: string) => {
    notifications.show({
      title: "Thông báo",
      message: `${feature} đang được phát triển 🚧`,
      color: "brand.4",
      autoClose: 3000,
    });
  };

  return (
    <MyLayoutAdmin title="Quản lý chấm công">
      <Fieldset
        legend={
          <Text
            bg={"brand.1"}
            px={10}
            style={{ borderLeft: "5px solid var(--mantine-color-brand-4)" }}
            c={"brand.5"}
          >
            Danh sách chấm công
          </Text>
        }
      >
        <TableData
          data={data}
          columns={attendanceColumns(handleEdit, handleDelete)}
          topToolbar={
            <Group py={10}>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setIsOpenModal(true)}
                bg={"blue"}
              >
                Thêm
              </Button>

              <Button
                variant="light"
                color={"teal"}
                leftSection={<IconUpload size={16} />}
                onClick={() => handleDeveloping("Tính năng Import")}
              >
                Import
              </Button>

              <Button
                variant="light"
                color="grape"
                leftSection={<IconDownload size={16} />}
                onClick={() => handleDeveloping("Tính năng Export")}
              >
                Export
              </Button>
              <Button
                color="pink"
                leftSection={<IconClockCheck size={16} />}
                onClick={() => handleDeveloping("Tính năng Chấm công")}
              >
                Chấm công
              </Button>
            </Group>
          }
        />
      </Fieldset>

      <FormModalAddUpdate
        size="md"
        title={editingAttendance ? "Sửa chấm công" : "Thêm chấm công"}
        opened={isOpenModal}
        close={() => {
          setIsOpenModal(false);
          setEditingAttendance(null);
        }}
      >
        <FormAddUpdateAttemdance
          initialValues={editingAttendance}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsOpenModal(false);
            setEditingAttendance(null);
          }}
        />
      </FormModalAddUpdate>
    </MyLayoutAdmin>
  );
}
