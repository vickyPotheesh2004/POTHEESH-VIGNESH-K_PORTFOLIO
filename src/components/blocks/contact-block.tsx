import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { SubHeading } from "@/components/ui/section";
import { CopyButton } from "@/components/copy-button";
import { ContactForm } from "@/components/contact-form";
import { CONTACT, SITE } from "@/data/site";
import { SERVICES } from "@/data/profile";

const SERVICE_TITLES = SERVICES.map((service) => service.title);

const CHANNELS = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    Icon: Mail,
    copy: CONTACT.email,
  },
  {
    label: "Phone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phoneHref}`,
    Icon: Phone,
    copy: CONTACT.phone,
  },
  {
    label: "LinkedIn",
    value: "potheesh-vignesh-k",
    href: CONTACT.linkedin,
    Icon: LinkedinIcon,
    external: true,
  },
  {
    label: "GitHub",
    value: "vickyPotheesh2004",
    href: CONTACT.github,
    Icon: GithubIcon,
    external: true,
  },
];

/**
 * The contact block, shared by the home page section and the /contact route so
 * the two can never drift apart.
 */
export function ContactBlock() {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <div>
        <SubHeading hint="Every channel below is real">Direct contact</SubHeading>

        <ul className="mt-5 grid gap-px border border-border bg-[var(--rule)]">
          {CHANNELS.map(({ label, value, href, Icon, copy, external }) => (
            <li key={label} className="bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Icon aria-hidden className="size-4 shrink-0 text-accent" />
                <span className="mono-label">{label}</span>
                {copy && <CopyButton value={copy} className="ml-auto" />}
              </div>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-2.5 block break-words text-[0.9375rem] text-foreground-soft transition-colors hover:text-accent"
              >
                {value}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-start gap-3 border border-border bg-surface-2 p-4">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="mono-label">Based in</p>
            <p className="mt-1.5 text-sm text-foreground-soft">
              {SITE.location.display}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-2">
              Working remotely with clients and teams in any timezone.
            </p>
          </div>
        </div>
      </div>

      <div>
        <SubHeading hint="Goes straight to my inbox">
          Start a conversation
        </SubHeading>
        <div className="mt-5">
          <ContactForm services={SERVICE_TITLES} />
        </div>
      </div>
    </div>
  );
}
