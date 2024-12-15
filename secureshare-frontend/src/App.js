import React, { useState } from "react";
import ParentAppShell from "./components/ParentAppShell";
import CreateNoteParent from "./components/CreateNote/CreateNoteParent";
import { Routes, Route } from "react-router-dom";
import ReadNoteParent from "./components/ReadNote/ReadNoteParent";
import { AuthContext } from "./components/Context/AuthContext";

const App = () => {
  const [token, setToken] = useState();
  const [displayName, setDisplayName] = useState();

  return (
    <AuthContext.Provider
      value={{ token, setToken, displayName, setDisplayName }}
    >
      <Routes>
        <Route path="/" element={<ParentAppShell />}>
          <Route index element={<CreateNoteParent />} />
          <Route path=":noteId" element={<ReadNoteParent />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
