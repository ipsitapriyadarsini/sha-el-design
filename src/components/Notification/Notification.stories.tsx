import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { Button } from "../Button";
import { notify } from "./NotificationService";
import { NotificationContainer } from "./Notification";

const stories = storiesOf("Notification", module);

stories.add(
  "Basic",
  withInfo({ inline: true })(() => (
    <>
      <NotificationContainer />
      <Button
        onClick={() =>
          notify({
            type: "info",
            title: "hey there",
            message: "This is an example for info",
          })
        }
      >
        Info
      </Button>
      <Button
        onClick={() =>
          notify({
            type: "error",
            title: "hey there",
            message: "This is an example for error",
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          notify({
            type: "warning",
            title: "hey there",
            message: "This is an example for warning",
          })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          notify({
            type: "success",
            title: "hey there",
            message: "This is an example for success",
          })
        }
      >
        Success
      </Button>
    </>
  ))
);
