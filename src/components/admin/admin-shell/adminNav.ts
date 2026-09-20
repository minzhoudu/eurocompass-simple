import { IconType } from "react-icons";
import { IoPricetagOutline, IoTimeOutline } from "react-icons/io5";

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
];
