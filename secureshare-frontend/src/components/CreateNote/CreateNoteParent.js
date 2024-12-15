import React, { useContext, useEffect, useState } from "react";
import InputCard from "./InputCard";
import ReadyNoteLink from "./ReadyNoteLink";
import { Container, Stack } from "@mantine/core";
import AboutSecureShare from "../AboutSecureShare";
import AuthModal from "../AuthModal";
import { useBoolean } from "@fluentui/react-hooks";
import { AuthContext } from "../Context/AuthContext";

function CreateNoteParent() {
  const { setToken, token, setDisplayName } = useContext(AuthContext);
  const [createdNote, setCreatedNote] = useState({
    id: null,
    expiresAt: null,
  });

  const [isAuthRequired, { setTrue: authRequired, setFalse: authNotRequired }] =
    useBoolean(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setDisplayName(localStorage.getItem("displayName"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) {
      authRequired();
    } else {
      authNotRequired();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Container>
      <AuthModal
        opened={isAuthRequired}
        completeAuth={() => authNotRequired()}
      />
      <Stack>
        <AboutSecureShare />

        {createdNote?.id ? (
          <ReadyNoteLink
            createdNote={createdNote}
            createNewNote={() => {
              setCreatedNote({ id: null, expiresAt: null });
            }}
          />
        ) : (
          <InputCard
            setCreatedNote={(createdNote) => setCreatedNote(createdNote)}
          />
        )}
      </Stack>
    </Container>
  );
}

export default CreateNoteParent;
