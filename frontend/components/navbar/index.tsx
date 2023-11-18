import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { Login } from "./login";
import { ThemeSwitcher } from "./theme-switch";
import { MessageButton } from "./message";
import { EventsButton } from "./events";

export const Navbar = () => {
  return (
    <NextUINavbar shouldHideOnScroll isBordered>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <h1 className="font-medium text-xl">CarbTrkr</h1>
        </Link>
      </NavbarBrand>

      <NavbarContent></NavbarContent>

      <NavbarContent className="w-max !justify-end gap-1.5 sm:gap-2">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <EventsButton />
        <MessageButton />
        <Login />
      </NavbarContent>
    </NextUINavbar>
  );
};
