import { Modal, Text } from "@mantine/core";

type Props = {
  opened: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
};

export default function FormModalAddUpdate({
  opened,
  close,
  title,
  children,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={"xl"}
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
