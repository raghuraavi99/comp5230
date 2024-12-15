import React, { useState } from "react";
import { Group, Stack, Textarea, Title } from "@mantine/core";
import { Button } from "@mantine/core";
import { useBoolean } from "@fluentui/react-hooks";
import MoreOptionsModal from "./MoreOptionsModal";
import { createNewNote } from "../../service/note.service";

function InputCard({ setCreatedNote }) {
  const [shouldShowMoreOptions, { toggle: toggleMoreOptions }] =
    useBoolean(false);

  const [noteError, setNoteError] = useState("");

  const [payload, setPayload] = useState({
    content: "",
  });

  const [
    isCreatingNewNote,
    { setTrue: setCreatingNewNote, setFalse: completedCreatingNewNote },
  ] = useBoolean(false);

  async function createNote() {
    try {
      setCreatingNewNote();
      const res = await createNewNote(payload);
      if (res?.data) {
        setCreatedNote(res.data);
      }
    } catch (e) {
      console.log(e);
      alert("Something went wrong creating note");
    } finally {
      completedCreatingNewNote();
    }
  }

  function onMoreOptionsApplied(moreOptionSettings) {
    setPayload((currPayload) => ({ ...currPayload, ...moreOptionSettings }));
  }

  return (
    <>
      <Stack>
        <Textarea
          variant="filled"
          size="md"
          minRows={13}
          autosize
          label={
            <Title order={3} mb="md">
              Create Note
            </Title>
          }
          placeholder={"Write something here ......"}
          value={payload.content}
          onChange={(event) => {
            const { value } = event.currentTarget;
            setPayload((prevData) => ({
              ...prevData,
              content: value,
            }));
          }}
          error={noteError}
        />

        <Group grow>
          <Button
            variant="outline"
            size="md"
            radius="md"
            onClick={toggleMoreOptions}
            disabled={isCreatingNewNote}
          >
            More options
          </Button>
          <Button
            variant="filled"
            color="teal"
            size="md"
            radius="md"
            loading={isCreatingNewNote}
            onClick={() => {
              if (payload.content && payload.content.trim()) {
                createNote();
              } else {
                setNoteError("Note cannot be empty");
              }
            }}
          >
            Done
          </Button>
        </Group>
      </Stack>

      <MoreOptionsModal
        shouldShowMoreOptions={shouldShowMoreOptions}
        toggleMoreOptions={toggleMoreOptions}
        onApplyCallback={onMoreOptionsApplied}
      />
    </>
  );
}

export default InputCard;
