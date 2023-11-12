"use client";

import useLocalStorage from "@/lib/use-local-store";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarItem,
  Link,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { LogIn, LogOut, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Login = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [user, setUser] = useLocalStorage("user", null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  const removeUser = (onClose: () => void) => {
    localStorage.removeItem("user");
    onClose();
    router.push("/login");
    location.reload();
  };

  if (mount) {
    return (
      <>
        <NavbarItem>
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly color="success" variant="flat">
                  <User2 />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acoount Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  href="/account"
                  startContent={
                    <User2 className="text-xl stroke-default-500 pointer-events-none flex-shrink-0" />
                  }
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={
                    <LogOut className="text-xl stroke-default-500 pointer-events-none flex-shrink-0" />
                  }
                  onPress={onOpen}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={Link}
              href="/login"
              startContent={<LogIn />}
              color="success"
              variant="flat"
            >
              Login
            </Button>
          )}
        </NavbarItem>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h1 className="font-medium text-xl">
                    Are you sure you want to logout?
                  </h1>
                </ModalHeader>
                <ModalFooter>
                  <Button color="success" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    onPress={() => removeUser(onClose)}
                  >
                    Logout
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return null;
};
