import cx from "classnames";
import PropTypes from "prop-types";
import { Children, forwardRef, memo } from "react";
import { noop, pick } from "web-common/utils";

const Field = memo(
  forwardRef((props, ref) => {
    const {
      children,
      className,
      dragHandle = null,
      onClick = noop,
      onKeyDown = noop,
      tabIndex,
    } = props;
    const [label, value] = Children.toArray(children);

    return (
      <li
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={cx("flex flex-col gap-1 p-3 text-sm", className)}
        ref={ref}
        {...pick(props, (p) => p.startsWith("data-") || p.startsWith("aria-"))}
      >
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground">{value}</div>
        {dragHandle}
      </li>
    );
  }),
);

Field.displayName = "Field";

Field.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  dragHandle: PropTypes.element,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default Field;
