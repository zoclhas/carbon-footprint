"use client";

import useLocalStorage from "@/lib/use-local-store";
import { NavbarItem, Link, Button } from "@nextui-org/react";
import { LogIn, User2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Login = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (mount) {
    return (
      <NavbarItem>
        {user ? (
          <Button
            as={Link}
            href="/account"
            isIconOnly
            color="success"
            variant="flat"
          >
            <User2 />
          </Button>
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
    );
  }

  return null;
};
