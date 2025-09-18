import { useCallback, memo, useId } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useIntl } from "react-intl";
import { ChevronDown } from "lucide-react";

import { citationStylesCount } from "../../../data/citation-styles-data.json";

const StyleSelector = ({
  className,
  citationStyle,
  citationStyles,
  onCitationStyleChanged,
}) => {
  const intl = useIntl();
  const selectId = useId();
  const styleOptions = Array.isArray(citationStyles) ? citationStyles : [];
  const selectedStyle = citationStyle ?? styleOptions[0]?.name ?? "";

  const handleChange = useCallback(
    (event) => {
      const { value } = event.target;

      if (!value) {
        return;
      }

      if (value === "install") {
        onCitationStyleChanged?.("install");
        return;
      }

      onCitationStyleChanged?.(value);
    },
    [onCitationStyleChanged],
  );

  const totalStyles = Math.floor(citationStylesCount / 1000) * 1000;

  return (
    <div
      className={cx(
        "style-selector flex w-full flex-col gap-2 text-left",
        className,
      )}
    >
      <label
        id={`${selectId}-label`}
        htmlFor={selectId}
        className="text-sm font-medium text-muted-foreground"
      >
        {intl.formatMessage({
          id: "zbib.styleSelector.label",
          defaultMessage: "Citation Style",
        })}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-labelledby={`${selectId}-label`}
          className="peer h-9 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm leading-none text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedStyle}
          onChange={handleChange}
        >
          {styleOptions.map(({ name, title }) => (
            <option key={name} value={name}>
              {title}
            </option>
          ))}
          <option value="install">
            {intl.formatMessage(
              {
                id: "zbib.styleSelector.otherStyles",
                defaultMessage:
                  "{citationStylesCount, plural, other {#+ other styles} } available…",
              },
              { citationStylesCount: totalStyles },
            )}
          </option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus-visible:text-ring"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

StyleSelector.propTypes = {
  className: PropTypes.string,
  citationStyle: PropTypes.string,
  citationStyles: PropTypes.array,
  onCitationStyleChanged: PropTypes.func,
};

export default memo(StyleSelector);
