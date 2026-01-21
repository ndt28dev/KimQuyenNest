import { Modal, Text } from "@mantine/core";

type Props = {
  opened: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
  size?: string;
};

export default function FormModalAddUpdate({
  opened,
  close,
  title,
  children,
  size = "xl",
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={size}
      title={
        <Text fw={500} size="lg">
          {title}
        </Text>
      }
    >
      {children}
    </Modal>
  );
}
