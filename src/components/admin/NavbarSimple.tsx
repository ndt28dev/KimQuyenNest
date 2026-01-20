"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import { Code, Group, Title } from "@mantine/core";
import classes from "../../styles/admin/NavbarSimple.module.css";
import { dataNav } from "@/modules/data/DataNav";

export function NavbarSimple() {
  const pathname = usePathname(); // URL hiện tại

  const links = dataNav.map((item) => (
    <Link
      key={item.label}
      href={item.link}
      className={classes.link}
      data-active={pathname === item.link || undefined}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Title order={2} c="brand.4">
            KimQuyenNest
          </Title>
          <Code fw={700} bg="brand.4">
            v1.1.1
          </Code>
        </Group>

        {links}
      </div>

      {/* <div className={classes.footer}> */}
      {/* <button className={classes.link}>
          <IconSwitchHorizontal className={classes.linkIcon} />
          <span>Change account</span>
        </button> */}

      {/* <button className={classes.link}>
          <IconLogout className={classes.linkIcon} />
          <span>Logout</span>
        </button> */}
      {/* </div> */}
    </nav>
  );
}
