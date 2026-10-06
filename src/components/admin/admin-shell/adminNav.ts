import { IconType } from "react-icons";

import { UserRole } from "../../../shared/models";
import {
  IoDocumentText,
  IoDocumentTextOutline,
  IoMegaphone,
  IoMegaphoneOutline,
  IoPeople,
  IoPeopleOutline,
  IoPricetag,
  IoPricetagOutline,
  IoReceipt,
  IoReceiptOutline,
  IoShieldCheckmark,
  IoShieldCheckmarkOutline,
  IoTime,
  IoTimeOutline,
} from "react-icons/io5";

type AdminNavLink = {
  id: number;
  label: string;
  shortLabel: string;
  path: string;
  icon: IconType;
  // Filled version for the open page (bottom tab bar on phones).
  activeIcon: IconType;
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
    activeIcon: IoTime,
    end: true,
  },
  {
    id: 2,
    label: "Cene i informacije",
    shortLabel: "Cene",
    path: "/admin/dashboard/informacije",
    icon: IoPricetagOutline,
    activeIcon: IoPricetag,
  },
  {
    id: 3,
    label: "Rezervacije",
    shortLabel: "Rezervacije",
    path: "/admin/dashboard/rezervacije",
    icon: IoReceiptOutline,
    activeIcon: IoReceipt,
  },
  {
    id: 4,
    label: "Putnici po polasku",
    shortLabel: "Putnici",
    path: "/admin/dashboard/putnici",
    icon: IoPeopleOutline,
    activeIcon: IoPeople,
  },
  {
    id: 5,
    label: "Obaveštenja",
    shortLabel: "Obaveštenja",
    path: "/admin/dashboard/obavestenja",
    icon: IoMegaphoneOutline,
    activeIcon: IoMegaphone,
  },
  {
    id: 6,
    label: "Istorija izmena",
    shortLabel: "Istorija",
    path: "/admin/dashboard/istorija",
    icon: IoDocumentTextOutline,
    activeIcon: IoDocumentText,
    roles: ["owner"],
  },
  {
    id: 7,
    label: "Administratori",
    shortLabel: "Admini",
    path: "/admin/dashboard/administratori",
    icon: IoShieldCheckmarkOutline,
    activeIcon: IoShieldCheckmark,
    roles: ["owner"],
  },
];

export const getAdminNavLinks = (role: UserRole | undefined) =>
  ADMIN_NAV_LINKS.filter(
    (link) => !link.roles || (!!role && link.roles.includes(role)),
  );
