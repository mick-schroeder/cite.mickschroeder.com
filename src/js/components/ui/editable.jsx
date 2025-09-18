import { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Input from '../form/input';
import TextAreaInput from '../form/text-area';
import Select from '../form/select';
import { noop, pick } from 'web-common/utils';


const EditableContent = memo((props) => {
	const { display, id, input, inputComponent, labelId, options, title, contentClassName } = props;
	const value = props.value || (input && input.props.value);
	const placeholder = props.placeholder || (input && input.props.placeholder);
	const hasValue = !!(value || input && input.props.value);
	const isSelect = inputComponent === Select || input && input.type == Select;

	const className = {
		'editable-content': true,
		'placeholder': !hasValue
	};
	const displayValue = !hasValue ? placeholder :
		display ? display :
			(isSelect && options) ? options.find(e => e.value == value)?.label ?? value : value;

	return (
		<div
			{...pick(props, p => p.startsWith('aria-'))}
			role="textbox"
			aria-readonly="true"
			aria-labelledby={labelId}
			id={id}
			title={title}
			className={cx(className, contentClassName)}
		>
			{displayValue}
		</div>
	);
});

EditableContent.displayName = 'EditableContent';

EditableContent.propTypes = {
	contentId: PropTypes.string,
	title: PropTypes.string,
	display: PropTypes.string,
	input: PropTypes.element,
	inputComponent: PropTypes.elementType,
	options: PropTypes.array,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	contentClassName: PropTypes.string,
};

const Editable = props => {
	const {
		children,
		input,
		isBusy,
		isDisabled,
		inputComponent = Input,
	isSelect,
	isTextArea,
	tabIndex = 0,
	onClick = noop,
	onFocus = noop,
	className: classNameProp,
	contentClassName,
	controlClassName,
	...rest
	} = props;

	const isActive = (props.isActive || isBusy) && !isDisabled;
	// input type auto-detection doesn't work if element is nested (which it can be, see
	// BoxFieldInput). This causes #440. TODO: drop auto-detection and always use explicit prop
	// to define textarea/select editables
	const className = {
		'editable': true,
		'editing': isActive,
		'textarea': inputComponent === TextAreaInput || (input && input.type === TextAreaInput) || isTextArea,
		'select': inputComponent === Select || (input && input.type === Select) || isSelect,
	};
	const hasChildren = typeof children !== 'undefined';
	const InputComponent = inputComponent;
	const InputElement = input;
	const forwardedProps = { ...rest };
	delete forwardedProps.contentClassName;
	delete forwardedProps.controlClassName;
	delete forwardedProps.className;

	return (
        <div
			{...pick(props, p => p.startsWith('aria-'))}
			tabIndex={ isDisabled ? null : isActive ? null : tabIndex }
			onClick={ onClick }
			onFocus={ onFocus }
			className={ cx(className, classNameProp, { 'disabled': isDisabled }) }
			{ ...pick(rest, p => p.startsWith('data-')) }
		>
			{ isActive ?
				InputElement ? InputElement : <InputComponent
					className={ cx(className, 'editable-control', controlClassName) }
					{ ...forwardedProps }
				/> : <Fragment>
						{
						hasChildren ?
							children :
							<EditableContent { ...forwardedProps } contentClassName={ contentClassName } />
						}
				</Fragment>
			}
		</div>
    );
}

Editable.propTypes = {
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
	className: PropTypes.string,
	contentClassName: PropTypes.string,
	controlClassName: PropTypes.string,
	input: PropTypes.element,
	inputComponent: PropTypes.elementType,
	isActive: PropTypes.bool,
	isBusy: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isReadOnly: PropTypes.bool,
	isSelect: PropTypes.bool,
	isTextArea: PropTypes.bool,
	onClick: PropTypes.func,
	onFocus: PropTypes.func,
	tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default memo(Editable);
