import cx from 'classnames';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useRef, useState, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spinner } from 'web-common/components';
import { pick } from 'web-common/utils'
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
import Bibliography from './bibliography';
import Confirmation from './confirmation';
import DeleteAllButton from './delete-all-button';
import Editable from './ui/editable';
import PlaceholderBibliography from './placeholder-bibliography';
import ExportTools from './export-tools';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';

const BibliographySection = props => {
	const { isPrintMode, isReadOnly, isReady, isHydrated, localCitationsCount, onOverride,
	onCancelPrintMode, onTitleChanged, title } = props;
	const shouldOverrideWhenReady = useRef(false);
	const [isConfirmingOverride, setIsConfirmingOverride] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const wasReady = usePrevious(isReady);
	const intl = useIntl();

	const handleTitleEdit = useCallback(() => {
		setIsEditingTitle(true);
	}, []);

	const handleTitleCommit = useCallback((newValue, hasChanged) => {
		if(hasChanged) {
			onTitleChanged(newValue);
		}
		setIsEditingTitle(false);
	}, [onTitleChanged]);

	const handleTitleCancel = useCallback(() => {
		setIsEditingTitle(false);
	}, []);

	const handleOverride = useCallback(() => {
		if(isReady) {
			onOverride();
		} else if(isHydrated) {
			shouldOverrideWhenReady.current = true;
		}
	}, [isReady, isHydrated, onOverride]);


	const handleEditBibliography = useCallback(() => {
		if(isPrintMode) {
			onCancelPrintMode();
		} else {
			if(localCitationsCount > 0) {
				setIsConfirmingOverride(true);
			} else {
				handleOverride();
			}
		}
	}, [isPrintMode, handleOverride, localCitationsCount, onCancelPrintMode]);

	const handleCancel = useCallback(() => {
		setIsConfirmingOverride(false);
	}, []);

	useEffect(() => {
		if(isReady && !wasReady && shouldOverrideWhenReady.current) {
			shouldOverrideWhenReady.current = false;
			onOverride();
		}
	}, [isReady, wasReady, onOverride]);

	return (
        <section
			aria-label="Bibliography"
			className={ cx('section', 'section-bibliography',
				{ 'loading': !isReady && !isHydrated, 'empty': !isReadOnly && localCitationsCount === 0 })
			}
		>			<div className="container" suppressHydrationWarning={ true }>

			<Card>
  <CardContent>

				{ (!isReadOnly && localCitationsCount === 0) ? (
					<Fragment>
						<img className="empty-bibliography" src="static/images/empty-bibliography.svg" width="320" height="200" role="presentation" />
						<h2 className="empty-title scroll-m-20 text-3xl font-semibold tracking-tight text-center">
							<FormattedMessage
								wrapRichTextChunksInFragment={ true }
								id="zbib.bibliography.emptyTitle"
								defaultMessage='<i>Y</i>our bibliography is empty.'
								values={ {
									i: chunks => <span style={{ 'letterSpacing': '-0.092em' }}>{chunks}</span>, //eslint-disable-line react/display-name
								}}
							/>
						</h2>
						<p className="lead empty-lead text-lg text-muted-foreground">
							<FormattedMessage
								wrapRichTextChunksInFragment={ true }
								id="zbib.bibliography.emptyLead"
								defaultMessage='<i>T</i>o add a source, paste or type its URL, ISBN, DOI, PMID, arXiv ID, or title into the search box above'
								values={ {
									i: chunks => <span style={{ 'letterSpacing': '-0.111em' }}>{chunks}</span>, //eslint-disable-line react/display-name
								}}
							/>
						</p>
					</Fragment>
				) : (
					<Fragment>
						{
							isReadOnly ? (
								title && (
									<h1 className="h2 bibliography-title pb-2 text-3xl font-semibold tracking-tight">
										{ title }
									</h1>
								)
							) : (
								<h2 className="bibliography-title h2 pb-2 text-3xl font-semibold tracking-tight flex justify-center">
									<div className="flex items-center gap-2 bg-background/80 px-4 py-2 shadow-sm rounded-md max-w-3xl w-full focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
										<Editable
											aria-label="Bibliography Title"
											placeholder="Bibliography"
											value={ title || '' }
											isActive={ isEditingTitle }
											onCommit={ handleTitleCommit }
											onCancel={ handleTitleCancel }
											onClick={ handleTitleEdit }
											onFocus={ handleTitleEdit }
											tabIndex={ isEditingTitle ? null : 0 }
											className="flex-1 min-w-0"
											contentClassName="text-3xl font-semibold tracking-tight text-foreground"
											controlClassName="h-10 border-none bg-transparent px-0 text-3xl font-semibold tracking-tight outline-none focus:outline-none focus:ring-0"
											autoFocus
											selectOnFocus
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={ handleTitleEdit }
											className="text-muted-foreground hover:text-foreground"
										>
											<Pencil className="size-5" aria-hidden="true" />
											<span className="sr-only">{ intl.formatMessage({ id: 'zbib.bibliography.editTitle', defaultMessage: 'Edit bibliography title' }) }</span>
										</Button>
									</div>
								</h2>
							)
						}
						{/* {
							!isReadOnly && <StyleSelector { ...pick(props, ['citationStyle', 'citationStyles', 'onCitationStyleChanged']) } />
						} */}
						{ (isHydrated && !isReady) ? (
							<PlaceholderBibliography itemCount={ props.hydrateItemsCount } />
						) : isReady ? (
							<Bibliography { ...pick(props, ['bibliographyRendered',
								'bibliographyRenderedNodes', 'copySingleState',
								'onCopySingle', 'isNoteStyle', 'isNumericStyle',
								'hydrateItemsCount', 'isSortedStyle', 'isReadOnly', 'bibliography',
								'onCitationCopyDialogOpen', 'onDeleteEntry', 'onEditorOpen',
								'onReorderCitations', 'styleHasBibliography'])} />
						) : (
							<div className="spinner-container">
								<Spinner />
							</div>
						) }
						<ExportTools
								itemCount={isHydrated ? props.hydrateItemsCount : props.bibliography.items.length}
							{...pick(props, ['getCopyData', 'onDownloadFile', 'isHydrated',
								'isReadOnly', 'isReady', 'onSaveToZoteroShow'])}
						/>
						{
							!isReadOnly && (isReady || isHydrated) && (
								<DeleteAllButton
									bibliographyCount={ props.bibliography.items.length }
									{ ...pick(props, ['onDeleteCitations']) }
								/>
							)
						}
						<Confirmation
							isOpen={ isReadOnly && isConfirmingOverride }
							onConfirm={ handleOverride }
							onCancel={ handleCancel }
							title={intl.formatMessage({ id: 'zbib.confirmOverride.title', defaultMessage: 'Clear existing bibliography?' })}
							confirmLabel="Continue"
							>
								<p>
									<FormattedMessage
										id="zbib.confirmOverride.prompt"
										defaultMessage="There is an existing bibliography with {localCitationsCount, plural,
											one {# entry}
											other {# entries}
											} in the editor. If you continue, the existing bibliography will be replaced with this one."
										values={ { localCitationsCount } }
									/>
								</p>
						</Confirmation>
					</Fragment>
				)
			}
			{ ((isReady || isHydrated) && isReadOnly) && (
				<Button
					onClick={ handleEditBibliography }
					className="btn-sm btn-outline-secondary btn-edit-bibliography">
					<FormattedMessage id="zbib.bibliography.edit" defaultMessage="Edit Bibliography" />
				</Button>
			) }
			  </CardContent>
</Card>
			</div>
		</section>
    );
}


BibliographySection.propTypes = {
    bibliography: PropTypes.object,
    hydrateItemsCount: PropTypes.number,
    isHydrated: PropTypes.bool,
    isPrintMode: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isReady: PropTypes.bool,
    localCitationsCount: PropTypes.number,
    onCancelPrintMode: PropTypes.func.isRequired,
    onOverride: PropTypes.func.isRequired,
    onTitleChanged: PropTypes.func.isRequired,
    title: PropTypes.string
}

export default memo(BibliographySection);
