import { IconType } from "react-icons";
import {
  IoMegaphoneOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoReceiptOutline,
  IoTimeOutline,
} from "react-icons/io5";

type AdminNavLink = {
  id: number;
  label: string;
  shortLabel: string;
  path: string;
  icon: IconType;
  end?: boolean;
};

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  {
    id: 1,
    label: "Polasci",
    shortLabel: "Polasci",
    path: "/admin/dashboard",
    icon: IoTimeOutline,
    end: true,
  },
  {
    id: 2,
    label: "Cene i informacije",
    shortLabel: "Cene",
    path: "/admin/dashboard/informacije",
    icon: IoPricetagOutline,
  },
  {
    id: 3,
    label: "Rezervacije",
    shortLabel: "Rezervacije",
    path: "/admin/dashboard/rezervacije",
    icon: IoReceiptOutline,
  },
  {
    id: 4,
    label: "Putnici po polasku",
    shortLabel: "Putnici",
    path: "/admin/dashboard/putnici",
    icon: IoPeopleOutline,
  },
  {
    id: 5,
    label: "Obaveštenja",
    shortLabel: "Obaveštenja",
    path: "/admin/dashboard/obavestenja",
    icon: IoMegaphoneOutline,
  },
];
