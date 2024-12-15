import React, { useContext, useEffect, useState } from "react";
import {
  Stack,
  Title,
  Modal,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Alert,
} from "@mantine/core";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useBoolean } from "@fluentui/react-hooks";
import { login, register } from "../service/auth.service";
import { AuthContext } from "./Context/AuthContext";

function AuthModal({ opened, completeAuth }) {
  const { setToken, setDisplayName } = useContext(AuthContext);

  const [isShowingLogin, { setTrue: showLogin, setFalse: showRegister }] =
    useBoolean(true);

  const [
    isAuthenticating,
    { setTrue: startAuthenticating, setFalse: completeAuthenticating },
  ] = useBoolean(false);

  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setAuthError("");
  }, [isShowingLogin]);

  useEffect(() => {
    if (isAuthenticating) setAuthError("");
  }, [isAuthenticating]);

  async function attemptLogin(payload) {
    const res = await login(payload);
    const token = res.data.token;
    localStorage.setItem("token", token);
    setToken(token);

    const displayName = res.data.name;
    localStorage.setItem("displayName", displayName);
    setDisplayName(displayName);
  }

  async function attemptRegister(payload) {
    await register(payload);
  }

  async function attemptAuth(payload) {
    try {
      startAuthenticating();
      if (isShowingLogin) {
        await attemptLogin(payload);
      } else {
        await attemptRegister(payload);
        await attemptLogin(payload);
      }

      completeAuth();
    } catch (e) {
      console.log(e);
      setAuthError(e?.response?.data?.message ?? "Something went wrong !!");
    } finally {
      completeAuthenticating();
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title={<Title order={3}>{isShowingLogin ? "Login" : "Register"}</Title>}
      size={"md"}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <Stack>
        {authError && (
          <Alert
            color="red"
            title="Error"
            variant="light"
            radius="md"
            icon={<ExclamationTriangleIcon />}
          >
            {authError}
          </Alert>
        )}
        {isShowingLogin ? (
          <LoginForm
            switchForm={() => showRegister()}
            onLogin={attemptAuth}
            isAuthenticating={isAuthenticating}
          />
        ) : (
          <RegisterForm
            switchForm={() => showLogin()}
            onRegister={attemptAuth}
            isAuthenticating={isAuthenticating}
          />
        )}
      </Stack>
    </Modal>
  );
}

function LoginForm({ switchForm, onLogin, isAuthenticating }) {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username:
        isNotEmpty("Email cannot be empty !") &&
        isEmail("Please provide a valid email !"),
      password: isNotEmpty("Password cannot be empty !"),
    },
  });

  function onSubmit(e) {
    e.preventDefault();

    form.validate();

    if (form.isValid()) {
      console.log(form.values);
      onLogin(form.values);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <CommonAuthFields
          usernameKey={form.key("username")}
          usernameFormInputProps={form.getInputProps("username")}
          passwordKey={form.key("password")}
          passwordFormInputProps={form.getInputProps("password")}
        />

        <Group justify="space-between" mt={"md"}>
          <Button
            size="sm"
            radius="md"
            variant="transparent"
            pl={0}
            onClick={switchForm}
            disable={isAuthenticating}
          >
            New to SecureShare
          </Button>
          <Button
            size="sm"
            radius="md"
            variant="filled"
            color="teal"
            type="submit"
            loading={isAuthenticating}
          >
            Login
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function RegisterForm({ switchForm, onRegister, isAuthenticating }) {
  const form = useForm({
    initialValues: {
      name: "",
      username: "",
      password: "",
    },
    validate: {
      name: isNotEmpty("Your name is required !"),
      username:
        isNotEmpty("Email cannot be empty !") &&
        isEmail("Please provide a valid email !"),
      password: isNotEmpty("Password cannot be empty !"),
    },
  });

  function onSubmit(e) {
    e.preventDefault();

    form.validate();

    if (form.isValid()) {
      console.log(form.values);
      onRegister(form.values);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          size="sm"
          withAsterisk
          label={"Name"}
          placeholder={"Your Name e.g Simon Riley"}
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <CommonAuthFields
          usernameKey={form.key("username")}
          usernameFormInputProps={form.getInputProps("username")}
          passwordKey={form.key("password")}
          passwordFormInputProps={form.getInputProps("password")}
        />

        <Group justify="space-between" mt={"md"}>
          <Button
            size="sm"
            radius="md"
            variant="transparent"
            pl={0}
            onClick={switchForm}
            disabled={isAuthenticating}
          >
            Already Registered ?
          </Button>
          <Button
            size="sm"
            radius="md"
            variant="filled"
            color="teal"
            type="submit"
            loading={isAuthenticating}
          >
            Register
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function CommonAuthFields({
  usernameKey,
  usernameFormInputProps,
  passwordKey,
  passwordFormInputProps,
}) {
  return (
    <Stack>
      <TextInput
        size="sm"
        withAsterisk
        label={"Email"}
        placeholder={"Email e.g sample@user.com"}
        key={usernameKey}
        {...usernameFormInputProps}
      />
      <PasswordInput
        size="sm"
        withAsterisk
        label={"Password"}
        placeholder={"Password ..."}
        key={passwordKey}
        {...passwordFormInputProps}
      />
    </Stack>
  );
}

export default AuthModal;
