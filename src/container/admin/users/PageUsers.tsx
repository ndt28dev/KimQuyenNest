"use client";

import { useEffect, useState } from "react";
import MyLayoutAdmin from "@/components/admin/MyLayoutAdmin";
import TableData from "@/components/admin/TableData";
import FormAddUser from "./FormAddUser";
import FormModalAddUpdate from "@/components/admin/FormModalAddUpdate";

import {
  ActionIcon,
  Badge,
  Button,
  Fieldset,
  Group,
  Text,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { User } from "@/modules/interfaces/User";
import { formatDateUTC } from "@/utils/date";
import { notifications } from "@mantine/notifications";

const STORAGE_KEY = "employees";

const getPersonsFromLocal = (): User[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const savePersonsToLocal = (data: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateEmployeeCode = (list: User[]) => {
  const year = new Date().getFullYear().toString().slice(-2); // 26

  const sameYear = list
    .map((p) => p.employeeCode)
    .filter((code) => code.startsWith(`KQN${year}`));

  let next = 1;
  if (sameYear.length > 0) {
    const last = sameYear.sort().at(-1)!;
    next = Number(last.slice(-2)) + 1;
  }

  return `KQN${year}${next.toString().padStart(2, "0")}`;
};

export const personColumns = (
  onEdit?: (row: User) => void,
  onDelete?: (row: User) => void
): MRT_ColumnDef<User>[] => [
  {
    id: "stt",
    header: "STT",
    size: 80,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "employeeCode",
    header: "Mã NV",
    size: 130,
  },
  {
    accessorKey: "fullName",
    header: "Họ tên",
  },
  {
    accessorKey: "gender",
    header: "GT",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      switch (value) {
        case "male":
          return "Nam";
        case "female":
          return "Nữ";
        case "other":
          return "Khác";
        default:
          return "";
      }
    },
    size: 100,
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
    size: 150,
    Cell: ({ cell }) => formatDateUTC(cell.getValue<string>()),
  },
  {
    accessorKey: "phone",
    header: "Sđt",
    size: 120,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Phòng ban",
    size: 150,
  },
  {
    accessorKey: "position",
    header: "Chức vụ",
    size: 130,
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      switch (value) {
        case "active":
          return <Badge color="blue">Đang làm</Badge>;
        case "inactive":
          return <Badge color="red">Đã nghĩ</Badge>;
        default:
          return "";
      }
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    size: 200,
    Cell: ({ cell }) => (
      <Text
        size="sm"
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {cell.getValue<string>() || "-"}
      </Text>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    enableSorting: false,
    enablePinning: true,
    size: 120,
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

export default function PageUsers() {
  const [data, setData] = useState<User[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    setData(getPersonsFromLocal());
  }, []);

  const handleSubmit = (formData: Omit<User, "id" | "employeeCode">) => {
    if (editingUser) {
      // 👉 UPDATE
      const newData = data.map((item) =>
        item.id === editingUser.id ? { ...editingUser, ...formData } : item
      );

      setData(newData);
      savePersonsToLocal(newData);
    } else {
      // 👉 ADD
      const newUser: User = {
        ...formData,
        id: crypto.randomUUID(),
        employeeCode: generateEmployeeCode(data),
      };

      const newData = [...data, newUser];
      setData(newData);
      savePersonsToLocal(newData);
    }

    setEditingUser(null);
    setIsOpenModal(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsOpenModal(true);
  };

  const handleDelete = (row: User) => {
    const newData = data.filter((p) => p.id !== row.id);
    setData(newData);
    savePersonsToLocal(newData);
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
    <MyLayoutAdmin title="Quản lý nhân viên">
      <Fieldset
        legend={
          <Text
            bg={"brand.1"}
            px={10}
            style={{ borderLeft: "5px solid var(--mantine-color-brand-4)" }}
            c={"brand.5"}
          >
            Danh sách nhân viên
          </Text>
        }
      >
        <TableData
          data={data}
          columns={personColumns(handleEdit, handleDelete)}
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
            </Group>
          }
        />
      </Fieldset>

      <FormModalAddUpdate
        title="Thêm nhân viên"
        opened={isOpenModal}
        close={() => setIsOpenModal(false)}
      >
        <FormModalAddUpdate
          title={editingUser ? "Sửa nhân viên" : "Thêm nhân viên"}
          opened={isOpenModal}
          close={() => {
            setIsOpenModal(false);
            setEditingUser(null);
          }}
        >
          <FormAddUser
            initialValues={editingUser}
            onSubmit={handleSubmit}
            onClose={() => {
              setIsOpenModal(false);
              setEditingUser(null);
            }}
          />
        </FormModalAddUpdate>
      </FormModalAddUpdate>
    </MyLayoutAdmin>
  );
}
