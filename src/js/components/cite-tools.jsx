import { useCallback, useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { usePrevious } from 'web-common/hooks';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import Brand from './brand';
import StyleSelector from './style-selector';

const canCancel = typeof(AbortController) === 'function';

const CiteTools = ({ identifier, isTranslating, onEditorOpen, onTranslationCancel, onTranslationRequest, citationStyle, citationStyles, onCitationStyleChanged }) => {
	const inputRef = useRef(null);
	const [entry, setEntry] = useState(identifier);
	const prevIdentifier = usePrevious(identifier);
	const wasTranslating = usePrevious(isTranslating);
	const intl = useIntl();
	const prompt = intl.formatMessage({ id: 'zbib.citePrompt', defaultMessage: 'Enter a URL, PubMed ID (PMID), ISBN, DOI, arXiv ID, or title..."' });

	const styleOptions = Array.isArray(citationStyles) ? citationStyles : [];
	const handleStyleChange = onCitationStyleChanged ?? (() => {});
	const selectedStyle = citationStyle ?? '';

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
			inputRef.current?.focus();
		}
	}, [isTranslating, wasTranslating]);

	const actionVariant = isTranslating ? (canCancel ? 'destructive' : 'loading') : 'default';
	const isActionDisabled = isTranslating ? !canCancel : entry.length === 0;

	const handleInputChange = useCallback((event) => {
		handleChange(event.target.value);
	}, [handleChange]);

	const handleInputKeyDown = useCallback((event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleCiteOrCancel();
		} else if (event.key === 'Escape' && isTranslating && canCancel) {
			event.preventDefault();
			onTranslationCancel();
		}
	}, [canCancel, handleCiteOrCancel, isTranslating, onTranslationCancel]);

	return (
		<div className="cite-tools">
			<Card>
				<CardHeader className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
					<div className="text-left">
						<CardTitle>
							<Brand />
						</CardTitle>
						<CardDescription>
							<FormattedMessage id="zbib.brand.description" defaultMessage="Free and open-source software that automatically suggests citations and helps write a bibliography for you." />
						</CardDescription>
					</div>
					<CardAction className="mt-auto">
						<Button variant="outline" size="sm" onClick={ onEditorOpen }>
							<FormattedMessage id="zbib.manualEntry" defaultMessage="Manual Entry" />
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<StyleSelector
							className="min-w-[220px]"
							citationStyle={ selectedStyle }
							citationStyles={ styleOptions }
							onCitationStyleChanged={ onCitationStyleChanged }
						/>
							<div className="flex w-full flex-col gap-2 text-left">
					
						<label
						
						className="text-sm font-medium text-muted-foreground"
					>
						{ intl.formatMessage({
							id: 'zbib.enterQuery',
							defaultMessage: 'Enter Query',
						}) }
					</label>
						<div className="relative">
							<input
								aria-label={ prompt }
								autoFocus
								className="h-11 w-full rounded-md border border-input bg-background px-4 pr-12 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
								disabled={ isTranslating && !canCancel }
								onChange={ handleInputChange }
								onKeyDown={ handleInputKeyDown }
								onPaste={ handlePaste }
								placeholder={ prompt }
								readOnly={ isTranslating }
								aria-busy={ isTranslating }
								ref={ inputRef }
								tabIndex={ 0 }
								type="search"
								value={ entry }
							/>
							{ isTranslating ? (
								<Loader2 className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden="true" />
							) : null }
						</div></div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button
						variant={ actionVariant }
						size="lg"
						className="w-auto"
						disabled={ isActionDisabled }
						onClick={ handleCiteOrCancel }
						aria-busy={ isTranslating && !canCancel }
					>
						{ (isTranslating && canCancel) ? (
							<FormattedMessage id="zbib.general.cancel" defaultMessage="Cancel" />
						) : (
							<FormattedMessage id="zbib.general.cite" defaultMessage="Suggest Citation" />
						) }
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

CiteTools.propTypes = {
	identifier: PropTypes.string,
	isTranslating: PropTypes.bool,
	onEditorOpen: PropTypes.func.isRequired,
	onTranslationCancel: PropTypes.func.isRequired,
	onTranslationRequest: PropTypes.func.isRequired,
	citationStyle: PropTypes.string,
	citationStyles: PropTypes.array,
	onCitationStyleChanged: PropTypes.func,
}


export default memo(CiteTools);
