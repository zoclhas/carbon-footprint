"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ name = "password" }: { name?: string }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const toggleVisibility = () => setVisible(!visible);

  return (
    <Input
      name={name}
      type={visible ? "text" : "password"}
      label="Password"
      size="lg"
      required
      endContent={
        <Button
          isIconOnly
          variant="light"
          color="success"
          onClick={toggleVisibility}
        >
          {visible ? (
            <EyeOff className="stroke-foreground-400" />
          ) : (
            <Eye className="stroke-foreground-400" />
          )}
        </Button>
      }
    />
  );
};
