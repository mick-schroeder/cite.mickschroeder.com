import { useCallback, useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from 'web-common/components';
import { usePrevious } from 'web-common/hooks';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Input from './form/input';
import Brand from './brand';

const canCancel = typeof(AbortController) === 'function';

const CiteTools = ({ identifier, isTranslating, onEditorOpen, onTranslationCancel, onTranslationRequest }) => {
	const inputRef = useRef(null);
	const [entry, setEntry] = useState(identifier);
	const prevIdentifier = usePrevious(identifier);
	const wasTranslating = usePrevious(isTranslating)
	const intl = useIntl();
	const prompt = intl.formatMessage({ id: 'zbib.citePrompt', defaultMessage: 'Enter a URL, PubMed ID (PMID), ISBN, DOI, arXiv ID, or title..."' });

	const handleChange = useCallback(newValue => {
		setEntry(newValue);
	}, []);

	const handleCiteOrCancel = useCallback(() => {
		if(isTranslating) {
			onTranslationCancel();
		} else if(entry.length > 0 && !isTranslating) {
			onTranslationRequest(entry);
		}
	}, [entry, isTranslating, onTranslationCancel, onTranslationRequest]);

	const handlePaste = useCallback((ev) => {
		const clipboardData = ev.clipboardData || window.clipboardData;
		const pastedData = clipboardData.getData('Text');
		const isMultiLineData = pastedData.split('\n').filter(line => line.trim().length > 0).length > 1;

		if (!isMultiLineData) {
			return;
		}

		ev.preventDefault();
		setEntry(pastedData);
		onTranslationRequest(pastedData, null, false, true);

	}, [onTranslationRequest]);

	useEffect(() => {
		if(typeof(prevIdentifier !== 'undefined') && identifier !== prevIdentifier) {
			setEntry(identifier);
		}
	}, [identifier, prevIdentifier]);

	useEffect(() => {
		if(wasTranslating && !isTranslating) {
			inputRef.current.focus();
		}
	}, [isTranslating, wasTranslating]);

	return (
		
		<div className="cite-tools">
			<Card>
  <CardHeader>
    <CardTitle><Brand/></CardTitle>
    <CardDescription>Free and open source software that automatically suggests citations and helps write a bibliography for you.</CardDescription>
    <CardAction><Button onClick={ onEditorOpen }
				className="btn-sm btn-outline-secondary"
			>
				<FormattedMessage id="zbib.manualEntry" defaultMessage="Manual Entry" />
			</Button></CardAction>
  </CardHeader>
  <CardContent>
    	<Input
					aria-label={ prompt }
					autoFocus
					className="form-control form-control-lg id-input"
					isBusy={ isTranslating }
					isReadOnly={ isTranslating }
					onBlur={ () => true /* do not commit on blur */ }
					onChange={ handleChange }
					onCommit={ handleCiteOrCancel }
					onPaste={ handlePaste }
					placeholder={ prompt }
					ref = { inputRef }
					tabIndex={ 0 }
					type="search"
					value={ entry }
				/>
  </CardContent>
  <CardFooter>
    <Button
					className="btn-lg btn-secondary"
					onClick={ handleCiteOrCancel }
				>
					{ (isTranslating && canCancel) ?
						<FormattedMessage id="zbib.general.cancel" defaultMessage="Cancel" /> :
						<FormattedMessage id="zbib.general.cite" defaultMessage="Suggest Citation" />
					}
				</Button>
  </CardFooter>
</Card>
			<div className="id-input-container">
			</div>
							<div className="id-input-container">

				
			</div>
			
		</div>
	);
}

CiteTools.propTypes = {
	identifier: PropTypes.string,
	isTranslating: PropTypes.bool,
	onEditorOpen: PropTypes.func.isRequired,
	onTranslationCancel: PropTypes.func.isRequired,
	onTranslationRequest: PropTypes.func.isRequired,
}


export default memo(CiteTools);
