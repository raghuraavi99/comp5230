import { Alert, Title, Text, Stack } from "@mantine/core";
import React, { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

function AboutSecureShare() {
  const { displayName } = useContext(AuthContext);

  function capitalizeFirstLetter(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <Alert
      title={
        <Stack gap={4}>
          {displayName && (
            <Title order={2} c="yellow">
              Hi {capitalizeFirstLetter(displayName.split(" ")[0])},
            </Title>
          )}
          <Title order={4}>Welcome to SecureShare!</Title>
        </Stack>
      }
      variant="light"
      color="cyan"
      radius="md"
    >
      <Text size="sm">
        SecureShare is your go-to platform for{" "}
        <strong>secure, ephemeral messaging</strong>. Create{" "}
        <strong>encrypted notes</strong> that self-destruct after being read or
        after a set time. In today’s digital world, protecting your sensitive
        information is crucial, and SecureShare is here to help you share{" "}
        <strong>securely</strong> and <strong>temporarily</strong>
        .
        <br />
        <br />
        Start sharing safely today!
      </Text>
    </Alert>
  );
}

export default AboutSecureShare;
