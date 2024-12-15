import {
  Card,
  Stack,
  Alert,
  Title,
  Group,
  Button,
  CopyButton,
} from "@mantine/core";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { getNoteExpiryStatusMessage } from "../../service/date.util.service";
import { useBoolean } from "@fluentui/react-hooks";
function NoteContentCard({ note, deleteNoteNow, isDeletingNote }) {
  const [copiedNote, { setTrue: noteCopied, setFalse: readyForCopy }] =
    useBoolean(false);

  useEffect(() => {
    if (copiedNote) {
      const timer = setTimeout(() => readyForCopy(), 3000);
      return () => clearTimeout(timer);
    }
  }, [copiedNote]);

  return (
    <Stack>
      <Title order={3}>{!note ? "Fetching Note ..." : "Note Content"}</Title>
      {note && (
        <Alert
          title={getNoteExpiryStatusMessage(note.expiresAt)}
          variant="light"
          color="orange"
          radius="md"
          icon={<InfoCircledIcon />}
        ></Alert>
      )}
      {note?.content ? (
        <>
          <Card withBorder>{note.content}</Card>
          <Group justify="flex-end">
            <CopyButton value={note.content}>
              {({ copied, copy }) => (
                <Button
                  size="md"
                  radius="md"
                  variant="outline"
                  color="gray"
                  aria-label="Settings"
                  onClick={() => {
                    copy();
                    noteCopied();
                  }}
                >
                  {copiedNote ? "Copied" : "Copy Note"}
                </Button>
              )}
            </CopyButton>
            {note.expiresAt && (
              <Button
                size="md"
                radius="md"
                color="orange"
                onClick={deleteNoteNow}
                loading={isDeletingNote}
                disabled={isDeletingNote}
              >
                Delete note now
              </Button>
            )}
          </Group>
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
}

export default NoteContentCard;
