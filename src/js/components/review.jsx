import { Fragment, memo, useCallback, useId, useRef } from 'react';
import PropTypes from 'prop-types';
//import { Button } from 'web-common/components';
import { Button } from './ui/button';
import { formatBib, formatFallback } from 'web-common/cite';
import { FormattedMessage } from 'react-intl';
import { useFocusManager } from 'web-common/hooks';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
const Review = ({ isTranslating, itemUnderReview, onReviewEdit, onReviewDelete, onReviewDismiss, styleHasBibliography }) => {
	const { bibliographyItems, bibliographyMeta } = itemUnderReview || {};
	const id = useId();
	const html = itemUnderReview ?
		styleHasBibliography ? formatBib(bibliographyItems, bibliographyMeta) : formatFallback(bibliographyItems) :
		'';
	const toolbarRef = useRef(null);
	const { focusNext, focusPrev, receiveFocus, receiveBlur } = useFocusManager(toolbarRef);

	const handleKeyDown = useCallback(ev => {
		if(ev.key == 'ArrowLeft') {
			focusPrev(ev, { useCurrentTarget: false });
		} else if(ev.key == 'ArrowRight') {
			focusNext(ev, { useCurrentTarget: false });
		}
	}, [focusNext, focusPrev]);

	const resetFocus = useCallback(() => {
		document.querySelector('.id-input').focus();
	}, []);

	const handleReviewDismiss = useCallback(ev => {
		resetFocus();
		onReviewDismiss(ev);
	}, [onReviewDismiss, resetFocus]);

	const handleReviewDelete = useCallback(ev => {
		resetFocus();
		onReviewDelete(ev);
	}, [onReviewDelete, resetFocus]);

	const handleReviewEdit = useCallback(ev => {
		resetFocus();
		onReviewEdit(ev);
	}, [onReviewEdit, resetFocus]);

	return (
        <section
			aria-labelledby={ id }
			className="pt-10"
		>
			{ isTranslating ? (
					<h2 id={ id }>
						<FormattedMessage id="zbib.review.newItem" defaultMessage="New item…" />
					</h2>
			) : (
			<Fragment>
				<Card>
  <CardHeader>
    <CardTitle><FormattedMessage id="zbib.review.title" defaultMessage="Review Citation" /></CardTitle>
    <CardDescription><h2 className="sr-only" id={ id }>
					<FormattedMessage id="zbib.review.newItem" defaultMessage="New item…" />
				</h2></CardDescription>
    <CardAction>	<Button
							tabIndex={-2}
							className=""
							onClick={handleReviewDismiss }
							variant="outline"
						>
							<FormattedMessage id="zbib.general.close" defaultMessage="Close" />
						</Button></CardAction>
  </CardHeader>
  <CardContent>
    <div className="background-background p-6 rounded-lg border shadow-md" dangerouslySetInnerHTML={ { __html: html } } />
  </CardContent>
  <CardFooter>
    <div className="container">
					
					<div
						className="flex gap-2 justify-center"
						role="toolbar"
						tabIndex={ 0 }
						ref={ toolbarRef }
						onKeyDown={ handleKeyDown }
						onFocus={ receiveFocus }
						onBlur={ receiveBlur }
					>
					
						<Button
							tabIndex={-2}
							onClick={ handleReviewDelete }
							variant="destructive"
						>
							<FormattedMessage id="zbib.general.delete" defaultMessage="Delete" />
						</Button>
						<Button
							tabIndex={-2}
							onClick={ handleReviewEdit }
						>
							<FormattedMessage id="zbib.general.edit" defaultMessage="Edit" />
						</Button>
						<Button
							tabIndex={-2}
							onClick={ handleReviewDelete }
							variant="secondary"
						>
							<FormattedMessage id="zbib.review.copyFilename" defaultMessage="Copy Filename" />
						</Button>
						<Button
							tabIndex={-2}
							onClick={ handleReviewDelete }
							variant="secondary"
						>
							<FormattedMessage id="zbib.review.copyCitation" defaultMessage="Copy Citation" />
						</Button>
					</div>
				</div>
  </CardFooter>
</Card>
				
				
			</Fragment>
			)}
		</section>
    );
}

Review.propTypes = {
	isTranslating: PropTypes.bool,
	itemUnderReview: PropTypes.object,
	onReviewDelete: PropTypes.func.isRequired,
	onReviewDismiss: PropTypes.func.isRequired,
	onReviewEdit: PropTypes.func.isRequired,
	styleHasBibliography: PropTypes.bool,
}

export default memo(Review);
