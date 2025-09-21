import { memo } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

const Footer = (props) => {
  const { isReadOnly } = props;

  return (
    <footer className="mt-10 w-full border-t bg-muted/30 py-6 text-sm text-muted-foreground dark:bg-muted/10">
      <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="space-y-1">
          <p>
            Forked from ZoteroBib © 2018 Corporation for Digital Scholarship
          </p>
          <p>© 2020-{new Date().getFullYear()} Mick Schroeder, LLC</p>
          <p>
            <a
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Use &amp; Privacy Policy
            </a>
          </p>
        </div>
        <div className="space-y-1 md:text-right">
          <p>License: GNU AGPL</p>
          <p className="text-xs leading-snug max-w-md">
            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU Affero General Public License as
            published by the Free Software Foundation. This program is
            distributed in the hope that it will be useful, but WITHOUT ANY
            WARRANTY; without even the implied warranty of MERCHANTABILITY or
            FITNESS FOR A PARTICULAR PURPOSE.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  isReadOnly: PropTypes.bool,
};

export default memo(Footer);
