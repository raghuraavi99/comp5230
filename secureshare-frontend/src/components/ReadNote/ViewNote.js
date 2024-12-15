import { Button, Stack, Title, Text } from "@mantine/core";
import React from "react";
function ViewNote({ showFetchedNote }) {
  return (
    <Stack>
      <Title order={3}>Ready To View Note ?</Title>
      <Text order={3}>
        You are about to read a note shared via <strong>SecureShare</strong>{" "}
        link.
      </Text>
      <Button size="md" radius="md" color="teal" onClick={showFetchedNote}>
        Show Note
      </Button>
    </Stack>
  );
}

export default ViewNote;
