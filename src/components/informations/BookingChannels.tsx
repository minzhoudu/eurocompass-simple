import { FaViber, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Badge, getButtonClasses } from "../../shared";

export const BookingChannels = () => (
  <div className="flex w-full flex-col gap-6 rounded-2xl border border-line bg-raised p-6 shadow-card md:flex-row md:items-center md:justify-between">
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold uppercase tracking-widest text-accent-ink">
        Novo
      </span>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-2 text-lg text-ink-muted">
        Karte od sada možete rezervisati preko
        <Badge variant="whatsapp" size="md">
          <FaWhatsapp className="size-4 text-social-whatsapp" />
          WhatsApp
        </Badge>
        i
        <Badge variant="viber" size="md">
          <FaViber className="size-4 text-social-viber" />
          Viber
        </Badge>
        aplikacije na broj
        <strong className="whitespace-nowrap text-xl font-bold text-ink">
          060 / 74-21-006
        </strong>
      </p>
    </div>

    <Link
      to="/rezervacije"
      className={getButtonClasses({ className: "shrink-0 whitespace-nowrap" })}
    >
      Rezerviši online
    </Link>
  </div>
);
