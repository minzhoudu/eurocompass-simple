import { IconType } from "react-icons";
import {
  IoHome,
  IoHomeOutline,
  IoInformationCircle,
  IoInformationCircleOutline,
  IoTicket,
  IoTicketOutline,
} from "react-icons/io5";

type NavLinkItem = {
  id: number;
  name: string;
  path: string;
  // Used by the bottom tab bar on phones; `activeIcon` is the filled version.
  icon: IconType;
  activeIcon: IconType;
};

export const NAV_LINKS: NavLinkItem[] = [
  {
    id: 1,
    name: "Početna",
    path: "/",
    icon: IoHomeOutline,
    activeIcon: IoHome,
  },
  {
    id: 2,
    name: "Rezervacije",
    path: "/rezervacije",
    icon: IoTicketOutline,
    activeIcon: IoTicket,
  },
  {
    id: 3,
    name: "Informacije",
    path: "/informacije",
    icon: IoInformationCircleOutline,
    activeIcon: IoInformationCircle,
  },
];
