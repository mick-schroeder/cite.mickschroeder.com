import cx from "classnames";
import PropTypes from "prop-types";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Select as UISelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import { usePrevious } from "web-common/hooks";
import { pick } from "web-common/utils";

const SelectInput = forwardRef((props, ref) => {
  const {
    autoFocus,
    className,
    clearable,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
    placeholder,
    tabIndex,
    inputGroupClassName,
    isBusy,
    value: initialValue,
    options,
    onBlur,
    onCancel,
    onCommit,
    onChange,
    onFocus,
    useNative,
    ...rest
  } = props;

  const [value, setValue] = useState(initialValue);
  const prevInitialValue = usePrevious(initialValue);
  const input = useRef(null);

  const groupClassName = cx(
    "relative inline-flex items-center gap-2",
    { busy: isBusy },
    inputGroupClassName,
  );

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (input.current && typeof input.current.focus === "function") {
        input.current.focus();
      }
    },
  }));

  const handleBlur = useCallback(
    (ev) => {
      if (onBlur) onBlur(ev);
      if (onCancel) onCancel(value !== initialValue, ev);
    },
    [initialValue, onCancel, onBlur, value],
  );

  const handleKeyDown = useCallback(
    (ev) => {
      if (ev.key === "Escape" && onCancel) onCancel();
    },
    [onCancel],
  );

  const handleChange = useCallback(
    (newValue, ev) => {
      newValue =
        newValue !== null || (newValue === null && clearable)
          ? newValue
          : initialValue;

      setValue(newValue);

      if (onChange(newValue)) {
        if (!ev) {
          const source = input.current;
          ev = { type: "change", currentTarget: source, target: source };
        }
        onCommit(newValue, newValue !== initialValue, ev);
      }
    },
    [clearable, initialValue, onChange, onCommit],
  );

  const handleNativeChange = useCallback(
    (ev) => handleChange(ev.target.value, ev),
    [handleChange],
  );

  const commonProps = {
    disabled: isDisabled,
    onBlur: handleBlur,
    onFocus,
    readOnly: isReadOnly,
    required: isRequired,
    id,
    tabIndex,
  };

  useEffect(() => {
    if (initialValue !== prevInitialValue && initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue, value, prevInitialValue]);

  return (
    <div className={groupClassName}>
      {useNative ? (
        <div className="native-select-wrap">
          <select
            {...commonProps}
            {...{ autoFocus, placeholder }}
            onKeyDown={handleKeyDown}
            onChange={handleNativeChange}
            ref={input}
            {...pick(rest, (p) => p.startsWith("data-"))}
            value={value ?? ""}
          >
            {(clearable ? [{ value: "", label: placeholder || "—" }] : [])
              .concat(options)
              .map(({ value: v, label }) => (
                <option key={String(v)} value={v}>
                  {label}
                </option>
              ))}
          </select>
          <div
            className={
              className ||
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            }
          >
            {(options.find((o) => o.value === value) || options[0] || {}).label}
          </div>
        </div>
      ) : (
        <UISelect
          value={value ?? ""}
          onValueChange={(v) => handleChange(v)}
          disabled={isDisabled}
        >
          <SelectTrigger
            className={
              className ||
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            }
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={onFocus}
            id={id}
            ref={input}
            tabIndex={tabIndex}
            {...pick(rest, (p) => p.startsWith("data-"))}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {clearable ? (
              <SelectItem key="__clear__" value="">
                {placeholder || "—"}
              </SelectItem>
            ) : null}
            {options.map(({ value: optVal, label }) => (
              <SelectItem key={String(optVal)} value={optVal}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </UISelect>
      )}
      {isBusy ? (
        <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
      ) : null}
    </div>
  );
});

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  id: PropTypes.string,
  inputGroupClassName: PropTypes.string,
  isBusy: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  tabIndex: PropTypes.number,
  useNative: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

export default memo(SelectInput);
