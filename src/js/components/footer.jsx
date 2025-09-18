import { memo } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

const Footer = (props) => {
  const { isReadOnly } = props;

  return (
    <footer>
      {!isReadOnly && (
        <nav className="social-nav">
          <FormattedMessage
            id="zbib.footer.follow"
            defaultMessage="Stay in touch! Follow <link>@zotero</link> on Twitter."
            values={{
              link: (chunk) => <a href="https://twitter.com/zotero">{chunk}</a>, //eslint-disable-line react/display-name
            }}
          />
        </nav>
      )}
      <small className="copyright">
        <ul>
          <li>© 2018–2025 Zotero</li>
          {isReadOnly && (
            <li>
              <a href="https://twitter.com/zotero">@zotero</a>
            </li>
          )}
          <li>
            <a href="/faq#privacy">Privacy</a>
          </li>
        </ul>
      </small>
    </footer>
  );
};

Footer.propTypes = {
  isReadOnly: PropTypes.bool,
};

export default memo(Footer);
