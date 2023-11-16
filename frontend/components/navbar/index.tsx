import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { Login } from "./login";
import { ThemeSwitcher } from "./theme-switch";

export const Navbar = () => {
  return (
    <NextUINavbar shouldHideOnScroll isBordered>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <h1 className="font-medium text-xl">CarbTrkr</h1>
        </Link>
      </NavbarBrand>

      <NavbarContent></NavbarContent>

      <NavbarContent className="w-max !justify-end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <Login />
      </NavbarContent>
    </NextUINavbar>
  );
};
