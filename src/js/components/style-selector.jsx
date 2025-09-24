import { useCallback, memo } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useIntl } from "react-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { citationStylesCount } from "../../../data/citation-styles-data.json";

const StyleSelector = ({
  className,
  citationStyle,
  citationStyles,
  onCitationStyleChanged,
}) => {
  const handleMoreStylesTrigger = useCallback(
    () => onCitationStyleChanged("install"),
    [onCitationStyleChanged],
  );
  const intl = useIntl();

  const selected = citationStyles.find((cs) => cs.name === citationStyle);
  const countRounded = Math.floor(citationStylesCount / 1000) * 1000;
  const otherStylesLabel = intl.formatMessage(
    {
      id: "zbib.styleSelector.otherStyles",
      defaultMessage:
        "{citationStylesCount, plural, other {#+ other styles} } available…",
    },
    { citationStylesCount: countRounded },
  );
  const ariaLabel = intl.formatMessage({
    id: "zbib.styleSelector.label",
    defaultMessage: "Citation Style",
  });
  const handleChange = (val) => {
    if (val === "install") return handleMoreStylesTrigger();
    onCitationStyleChanged(val);
  };

  return (
    <div className={cx("style-selector", className)}>
      <Select value={citationStyle} onValueChange={handleChange}>
        <SelectTrigger aria-label={ariaLabel} className="w-full">
          <SelectValue placeholder={selected ? selected.title : ariaLabel} />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {citationStyles.map((cs) => (
            <SelectItem key={cs.name} value={cs.name}>
              {cs.title}
            </SelectItem>
          ))}
          <div className="my-1 border-t" />
          <SelectItem value="install">{otherStylesLabel}</SelectItem>
        </SelectContent>
      </Select>
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
