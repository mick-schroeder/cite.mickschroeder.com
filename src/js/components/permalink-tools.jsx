import copy from "copy-to-clipboard";
import cx from "classnames";
import PropTypes from "prop-types";
import { Fragment, useCallback, useState, memo } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { LoaderCircle } from "lucide-react";

const PermalinkTools = ({ bibliography, isSafari, onSave, permalink }) => {
  const [isSavingPermalink, setIsSavingPermalink] = useState(false);
  const [isRecentlyCopied, setIsRecentlyCopied] = useState(false);
  const intl = useIntl();

  const handleCreateLink = useCallback(async () => {
    if (!permalink) {
      setIsSavingPermalink(true);
      await onSave();
      setIsSavingPermalink(false);
    }
  }, [onSave, permalink]);

  const handleCopy = useCallback(() => {
    if (copy(permalink) && !isRecentlyCopied) {
      setIsRecentlyCopied(true);
      setTimeout(() => {
        setIsRecentlyCopied(false);
      }, 1000);
    }
  }, [isRecentlyCopied, permalink]);

  return (
    <div className={cx("permalink-tools", { loading: isSavingPermalink })}>
      {isSavingPermalink ? (
        <LoaderCircle className="h-4 w-4 text-primary animate-spin" />
      ) : permalink ? (
        <div className="btn-wrap">
          <ShadcnButton
            variant="secondary"
            size="lg"
            className={cx("w-full", {
              "bg-green-500 text-white": isRecentlyCopied,
            })}
            data-clipboard-text={permalink}
            onClick={handleCopy}
          >
            {isRecentlyCopied
              ? intl.formatMessage({
                  id: "zbib.permalink.copyFeedback",
                  defaultMessage: "Link copied",
                })
              : intl.formatMessage({
                  id: "zbib.permalink.copyURL",
                  defaultMessage: "Copy link",
                })}
          </ShadcnButton>
          <a className="btn btn-lg btn-block btn-secondary" href={permalink}>
            <FormattedMessage id="zbib.permalink.view" defaultMessage="Open" />
          </a>
        </div>
      ) : (
        <Fragment>
          {isSafari && (
            <div className="safari-warning">
              <p>
                <strong>
                  <FormattedMessage
                    id="zbib.permalink.safari.warning"
                    defaultMessage="Safari may clear local data for sites you haven’t opened in a week, which can remove your saved bibliography."
                  />
                </strong>
              </p>
              <p>
                <FormattedMessage
                  id="zbib.permalink.safari.recommendation"
                  defaultMessage="To preserve your work, create a permalink copy."
                />
              </p>
            </div>
          )}
          <ShadcnButton
            disabled={bibliography.items.length === 0}
            variant="outline"
            size="lg"
            className="min-w-[8rem]"
            onClick={handleCreateLink}
          >
            <FormattedMessage
              id="zbib.permalink.create"
              defaultMessage="Create permalink"
            />
          </ShadcnButton>
        </Fragment>
      )}
    </div>
  );
};

PermalinkTools.propTypes = {
  bibliography: PropTypes.object,
  isSafari: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  permalink: PropTypes.string,
};

export default memo(PermalinkTools);
