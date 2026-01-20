import React from "react";
import { NavbarSimple } from "@/components/admin/NavbarSimple";
import { Flex } from "@mantine/core";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Flex w="100%">
        <NavbarSimple />
        {children}
      </Flex>
    </div>
  );
}
