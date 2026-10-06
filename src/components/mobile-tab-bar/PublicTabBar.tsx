import { NAV_LINKS } from "../header/utils";
import { MobileTabBar } from "./MobileTabBar";

const links = NAV_LINKS.map(({ id, name, path, icon, activeIcon }) => ({
  id,
  label: name,
  path,
  icon,
  activeIcon,
  end: path === "/",
}));

export const PublicTabBar = () => (
  <MobileTabBar label="Mobilna navigacija" links={links} />
);
