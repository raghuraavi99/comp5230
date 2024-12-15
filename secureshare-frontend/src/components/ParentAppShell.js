import {
  Container,
  Title,
  AppShell,
  Group,
  Button,
  Stack,
} from "@mantine/core";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

function ParentAppShell() {
  const { token, setToken } = useContext(AuthContext);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 0,
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container>
          <Stack justify="center" mt={"xs"}>
            <Group justify="space-between">
              <Title>SecureShare</Title>

              {token && (
                <Button
                  variant="subtle"
                  size="md"
                  radius="md"
                  onClick={() => {
                    localStorage.clear();
                    setToken("");
                  }}
                >
                  Logout
                </Button>
              )}
            </Group>
          </Stack>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default ParentAppShell;
