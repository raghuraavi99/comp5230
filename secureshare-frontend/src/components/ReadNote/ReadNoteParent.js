import React, { useEffect, useState } from "react";
import ViewNote from "./ViewNote";
import { Container, Stack, Loader, Group, Title } from "@mantine/core";
import AboutSecureShare from "../AboutSecureShare";
import NoteContentCard from "./NoteContentCard";
import { useBoolean } from "@fluentui/react-hooks";
import NoteDestroyed from "./NoteDestroyed";
import { useParams } from "react-router-dom";
import {
  forceDeleteNote,
  getNote,
  getNoteStatus,
} from "../../service/note.service";

function ReadNoteParent() {
  const { noteId } = useParams();

  const [note, setNote] = useState({});
  const [shouldShowFetchedNote, { setTrue: showFetchedNote }] =
    useBoolean(false);

  const [doesNoteExists, { setTrue: noteExists, setFalse: noteDosentExists }] =
    useBoolean(true);

  const [
    isCheckingNoteExists,
    { setTrue: setCheckingNoteExists, setFalse: completeCheckingNoteExistence },
  ] = useBoolean(true);

  const [
    isDeletingNote,
    { setTrue: deletingNote, setFalse: completeDeletingNote },
  ] = useBoolean(false);

  async function fetchNote() {
    try {
      const res = await getNote(noteId);
      if (res.data) {
        console.log(res.data);
        setNote(res.data);
      } else {
        throw Error("Invalid response for note (No data in response)");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function checkNoteExists() {
    try {
      setCheckingNoteExists();
      await getNoteStatus(noteId);
      noteExists();
    } catch (e) {
      console.log(e);
      noteDosentExists();
    } finally {
      completeCheckingNoteExistence();
    }
  }

  async function deleteNoteNow() {
    try {
      deletingNote();
      await forceDeleteNote(noteId);
      checkNoteExists();
    } catch (e) {
      console.log(e);
      alert("Something went wrong deleting note");
    } finally {
      completeDeletingNote();
    }
  }

  useEffect(() => {
    checkNoteExists();
  }, []);

  useEffect(() => {
    if (shouldShowFetchedNote) fetchNote();
  }, [shouldShowFetchedNote]);

  return (
    <Container>
      <Stack>
        <AboutSecureShare />

        {isCheckingNoteExists ? (
          <Group justify="center">
            <Title order={3}>Verifying note </Title>
            <Loader color="blue" size="md" type="dots" />
          </Group>
        ) : (
          <>
            {doesNoteExists ? (
              <>
                {shouldShowFetchedNote ? (
                  <NoteContentCard
                    note={note}
                    deleteNoteNow={deleteNoteNow}
                    isDeletingNote={isDeletingNote}
                  />
                ) : (
                  <ViewNote showFetchedNote={showFetchedNote} />
                )}
              </>
            ) : (
              <NoteDestroyed />
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}

export default ReadNoteParent;
