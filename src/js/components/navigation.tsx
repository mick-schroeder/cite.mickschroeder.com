import { memo, useCallback, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { useFocusManager } from "web-common/hooks";
import { Button as ShadcnButton } from "./ui/button";
import { Smile } from "lucide-react";

type NavigationProps = {
  onAboutClick: () => void;
  onHelpClick: () => void;
  onExamplesClick: () => void;
};

const Navigation = ({ onAboutClick, onHelpClick, onExamplesClick }: NavigationProps) => {
  const intl = useIntl();
  const navLabel = intl.formatMessage({
    id: "zbib.navLabel",
    defaultMessage: "Site Navigation",
  });

  const navRef = useRef<HTMLElement | null>(null);
  const { focusNext, focusPrev, receiveFocus, receiveBlur } = useFocusManager(navRef);

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === "ArrowRight") {
        focusNext(ev, { useCurrentTarget: false });
      } else if (ev.key === "ArrowLeft") {
        focusPrev(ev, { useCurrentTarget: false });
      }
    },
    [focusNext, focusPrev],
  );

  return (
    <nav
      className="w-full px-4 md:px-6 py-2 mb-4 md:mb-6"
      aria-label={navLabel}
      tabIndex={0}
      ref={navRef as unknown as React.RefObject<HTMLDivElement>}
      onFocus={receiveFocus}
      onBlur={receiveBlur}
      onKeyDown={handleKeyDown}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-3">
        <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1 justify-center md:justify-start min-w-0 text-center md:text-left">
          <a
            href="/"
            className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <img
              src="/static/images/icon-cite-round.svg"
              className="h-7 w-7 shrink-0"
              alt=""
              aria-hidden="true"
            />
            <span className="text-lg md:text-xl font-black tracking-tight text-foreground">
              <FormattedMessage id="zbib.brand" defaultMessage="Mick Schroeder's Citation Generator" />
            </span>
          </a>
        </div>

        <div className="flex justify-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-1 flex-wrap justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild tabIndex={-2}>
                  <button
                    type="button"
                    onClick={onAboutClick}
                    className="px-3 py-1.5 rounded-md text-sm hover:underline"
                  >
                    <FormattedMessage id="zbib.about" defaultMessage="About" />
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild tabIndex={-2}>
                  <button
                    type="button"
                    onClick={onHelpClick}
                    className="px-3 py-1.5 rounded-md text-sm hover:underline"
                  >
                    <FormattedMessage id="zbib.help" defaultMessage="Help" />
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild tabIndex={-2}>
                  <button
                    type="button"
                    onClick={onExamplesClick}
                    className="px-3 py-1.5 rounded-md text-sm hover:underline"
                  >
                    <FormattedMessage id="zbib.examples" defaultMessage="Examples" />
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild tabIndex={-2}>
                  <a href="/faq" className="px-3 py-1.5 rounded-md text-sm hover:underline">
                    FAQ
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
          <ShadcnButton asChild variant="secondary" size="sm" className="h-8 px-2">
            <a
              href="https://www.mickschroeder.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={intl.formatMessage({ id: "zbib.social.site", defaultMessage: "Personal website" })}
            >
             <span className="px-2">mickschroeder.com</span>
            </a>
          </ShadcnButton>
          <ShadcnButton asChild variant="secondary" size="sm" className="h-8 px-2">
            <a
                href="https://www.linkedin.com/in/schroedermick/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
            >
                <img
                src="/static/images/linkedin.svg"
                alt="LinkedIn"
                className="h-4 w-4 dark:invert"
                />
            </a>
            </ShadcnButton>

            <ShadcnButton asChild variant="secondary" size="sm" className="h-8 px-2">
            <a
                href="https://github.com/mick-schroeder/cite.mickschroeder.com"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
            >
                <img
                src="/static/images/github.svg"
                alt="GitHub"
                className="h-4 w-4 dark:invert"
                />
            </a>
            </ShadcnButton>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navigation);
