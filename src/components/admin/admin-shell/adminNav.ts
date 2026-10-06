import { IconType } from "react-icons";

import { UserRole } from "../../../shared/models";
import {
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
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
  // Hidden from (and refused for) everyone else; omit for all admins.
  roles?: UserRole[];
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
  {
    id: 6,
    label: "Istorija izmena",
    shortLabel: "Istorija",
    path: "/admin/dashboard/istorija",
    icon: IoDocumentTextOutline,
    roles: ["owner"],
  },
  {
    id: 7,
    label: "Administratori",
    shortLabel: "Admini",
    path: "/admin/dashboard/administratori",
    icon: IoShieldCheckmarkOutline,
    roles: ["owner"],
  },
];

export const getAdminNavLinks = (role: UserRole | undefined) =>
  ADMIN_NAV_LINKS.filter(
    (link) => !link.roles || (!!role && link.roles.includes(role)),
  );
