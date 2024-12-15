import React, { useRef } from "react";
import {
  Modal,
  Button,
  Select,
  PasswordInput,
  Stack,
  Title,
  Group,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

function MoreOptionsModal({
  toggleMoreOptions,
  shouldShowMoreOptions,
  onApplyCallback,
}) {
  const destroyAfterOptions = useRef([
    { value: 0, label: "Immediately After Opened" },
    { value: 60, label: "After 1 Hour" },
    { value: 1440, label: "After 1 Day" },
    { value: 10080, label: "After 7 Days" },
  ]);

  const form = useForm({
    initialValues: {
      destroyAfter: destroyAfterOptions.current[0].value.toString(),
      password: "",
      confirmPassword: "",
    },

    validate: {
      destroyAfter: isNotEmpty("Please select note self destruction time"),
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  function onSubmit(e) {
    e.preventDefault();
    form.validate();

    if (form.isValid()) {
      console.log(form.values);
      const { destroyAfter, password } = form.values;
      onApplyCallback({
        expiresIn: +destroyAfter,
        password,
      });
      toggleMoreOptions();
    }
  }

  return (
    <Modal
      opened={shouldShowMoreOptions}
      onClose={toggleMoreOptions}
      title={<Title order={3}>More options</Title>}
      size={"xl"}
    >
      <Stack gap={"md"}>
        <Select
          size="md"
          label={"Destroy After"}
          placeholder="Pick value"
          description="Time when should the note be destroyed"
          data={destroyAfterOptions.current.map((data) => ({
            ...data,
            value: data.value.toString(),
          }))}
          key={form.key("destroyAfter")}
          {...form.getInputProps("destroyAfter")}
        />

        <form onSubmit={onSubmit}>
          <Group grow>
            <PasswordInput
              size="md"
              label={"Custom Password"}
              description="Enter a custom password to encrypt the note"
              placeholder={"Custom password"}
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <PasswordInput
              size="md"
              label={"Confirm Password"}
              description="Re-enter the custom password"
              placeholder={"Confirm custom password"}
              key={form.key("confirmPassword")}
              {...form.getInputProps("confirmPassword")}
            />
          </Group>

          <Group justify="flex-end" mt="md">
            <Button color="grey" variant="outline" onClick={toggleMoreOptions}>
              Cancel
            </Button>
            <Button type="submit" color="teal">
              Apply
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}

export default MoreOptionsModal;
