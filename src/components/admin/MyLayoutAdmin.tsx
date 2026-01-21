import { Box, Divider, Stack, Title } from "@mantine/core";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function MyLayoutAdmin({ title, children }: Props) {
  return (
    <Stack p={16} gap={16} flex={1} bg={"#F1F3F5"} miw={0}>
      <Box pb={16} w={"100%"} style={{ borderBottom: "1px solid #c1c1c1" }}>
        <Title order={2} c={"#333"}>
          {title}
        </Title>
      </Box>
      <Box w={"100%"}>{children}</Box>
    </Stack>
  );
}
