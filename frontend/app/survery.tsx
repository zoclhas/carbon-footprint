"use client";

import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { RadioGroup, Radio } from "@nextui-org/react";

export default function Survey() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  useEffect(() => {
    const surveryCheck = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/check-survey",
        {
          method: "get",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `users API-Key ${user!.user.apiKey}`,
          },
        },
      );

      if (res.ok) {
        const data: {
          error?: boolean;
          done: boolean;
        } = await res.json();

        if (!data.done) {
          onOpen();
          localStorage.setItem("survey", "false");
        } else if (data.done) {
          localStorage.setItem("survey", "true");
        }
      }
    };

    if (user) {
      const survey = localStorage.getItem("survey");
      if (survey !== "true") {
        surveryCheck();
      }
    }
  }, []);

  const [cook, setCook] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");

  const submitHandler = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (
      user &&
      ["clean", "non_clean"].includes(cook) &&
      ["electric", "non_electric", "none"].includes(vehicle)
    ) {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/set-survey", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `users API-Key ${user!.user.apiKey}`,
        },
        body: JSON.stringify({
          cooking: cook,
          vehicle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.done) {
        }
      } else {
        location.reload();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      backdrop="blur"
      isKeyboardDismissDisabled
      hideCloseButton
      placement="center"
    >
      <ModalContent as="form" onSubmit={submitHandler}>
        {(onClose) => (
          <>
            <ModalHeader>Required Survery</ModalHeader>
            <ModalBody>
              <RadioGroup
                label="Do you cook using a clean method?"
                orientation="horizontal"
                onValueChange={setCook}
                isRequired
              >
                <Radio value="clean">Yes</Radio>
                <Radio value="non_clean">No</Radio>
              </RadioGroup>
              <RadioGroup
                label="What type of vehicle do you drive?"
                orientation="horizontal"
                onValueChange={setVehicle}
                isRequired
              >
                <Radio value="electric">Electrical</Radio>
                <Radio value="non_electric">Non Electrical</Radio>
                <Radio value="none">None</Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" onPress={onClose}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
