import React from "react";
import { Alert, Stack, Text, Title } from "@mantine/core";

function NoteDestroyed() {
  return (
    <Stack>
      <Title order={3}>Note Destroyed</Title>

      <Alert color="red">
        <Text size="md" fw={"bold"} c={"red"}>
          If you haven't read this note it means someone else has. If you read
          it but forgot to write it down, then you need to ask whoever sent it
          to re-send it.
        </Text>
      </Alert>
    </Stack>
  );
}

export default NoteDestroyed;
