import {
  Stack,
  Title,
  Card,
  Group,
  Text,
  Alert,
  ActionIcon,
  Button,
  CopyButton,
} from "@mantine/core";
import { CopyIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { getNoteExpiryStatusMessage } from "../../service/date.util.service";

function ReadyNoteLink({ createdNote, createNewNote }) {
  console.log(createdNote);
  // const location = useLocation();

  const [noteUrl, setNoteUrl] = useState("");

  useEffect(() => {
    const fullURL = `${window.location.protocol}//${window.location.host}/${createdNote.id}`;
    setNoteUrl(fullURL);
  }, [createdNote]);

  return (
    <Stack>
      <Title order={3}>Note Link Ready</Title>

      <Card shadow="lg" radius="md">
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500} c="blue">
            {noteUrl}
          </Text>

          <CopyButton value={noteUrl}>
            {({ _, copy }) => (
              <ActionIcon variant="subtle" color="gray" aria-label="Settings">
                <CopyIcon
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                  onClick={copy}
                />
              </ActionIcon>
            )}
          </CopyButton>
        </Group>
      </Card>

      <Alert
        title={getNoteExpiryStatusMessage(createdNote.expiresAt)}
        variant="light"
        color="orange"
        radius="md"
        icon={<InfoCircledIcon />}
      ></Alert>

      <Group justify="flex-end">
        <Button
          variant="outline"
          color="blue"
          size="md"
          radius="md"
          onClick={createNewNote}
        >
          Create new note
        </Button>
        <Button
          variant="filled"
          color="teal"
          size="md"
          radius="md"
          onClick={() => {
            window.open(noteUrl, "_blank");
          }}
        >
          Open link
        </Button>
      </Group>
    </Stack>
  );
}

export default ReadyNoteLink;
