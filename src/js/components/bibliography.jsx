import cx from "classnames";
import PropTypes from "prop-types";
import { Fragment, useCallback, useRef, useState, memo } from "react";
import { useIntl, FormattedMessage } from "react-intl";
// Removed web-common Dropdown imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { isTriggerEvent, pick } from "web-common/utils";
import { useFocusManager } from "web-common/hooks";
import { Button as ShadcnButton } from "./ui/button";
import { Quote, Copy, Check, Trash2, Grip, MoreVertical } from "lucide-react";

import { useDnd } from "../hooks";

const BIB_ITEM = "BIB_ITEM";

const BibliographyItem = memo((props) => {
  const {
    allowReorder,
    copySingleState,
    isDropdownOpen,
    formattedItem,
    isError,
    isFirst,
    isLast,
    isNoteStyle,
    isNumericStyle,
    onCopyCitationDialogOpen,
    onCopySingle,
    onDeleteCitation,
    onDelayedCloseDropdown,
    onEditCitationClick,
    onReorderCitations,
    onSelectCitation,
    onToggleDropdown,
    rawItem,
  } = props;
  const listItemRef = useRef(null);
  const containerRef = useRef(null);
  const { focusNext, focusPrev, receiveBlur, receiveFocus } = useFocusManager(
    listItemRef,
    { targetTabIndex: -3, isFocusable: true, isCarousel: false },
  );
  const intl = useIntl();
  const isCopied =
    copySingleState.copied && copySingleState.citationKey === rawItem.key;

  const onComplete = useCallback(
    (targetNode, above, current) => {
      const targetKey = targetNode.closest("[data-key]").dataset.key;

      onReorderCitations(current.key, targetKey, above);
    },
    [onReorderCitations],
  );

  const handleMoveTop = useCallback(
    (ev) => {
      ev.stopPropagation();
      const srcNode = ev.currentTarget.closest("[data-key]");
      const topNode = srcNode.parentNode.querySelector(
        "[data-key]:first-child",
      );
      onReorderCitations(srcNode.dataset.key, topNode.dataset.key, true);
    },
    [onReorderCitations],
  );

  const handleMoveUp = useCallback(
    (ev) => {
      ev.stopPropagation();
      const srcNode = ev.currentTarget.closest("[data-key]");
      const prevNode = srcNode.previousElementSibling;
      onReorderCitations(srcNode.dataset.key, prevNode.dataset.key, true);
    },
    [onReorderCitations],
  );

  const handleMovedown = useCallback(
    (ev) => {
      ev.stopPropagation();
      const srcNode = ev.currentTarget.closest("[data-key]");
      const nextNode = srcNode.nextElementSibling;
      onReorderCitations(srcNode.dataset.key, nextNode.dataset.key, false);
    },
    [onReorderCitations],
  );

  const handleCopySingleClick = useCallback(
    (ev) => {
      listItemRef.current?.focus();
      ev.stopPropagation();
      ev.preventDefault();
      onDelayedCloseDropdown();
      onCopySingle(ev.currentTarget.closest("[data-key]")?.dataset.key);
    },
    [onCopySingle, onDelayedCloseDropdown],
  );

  const handleCopyCitationClick = useCallback(
    (ev) => {
      ev.currentTarget.closest("[data-key]")?.focus();
      onCopyCitationDialogOpen(ev);
    },
    [onCopyCitationDialogOpen],
  );

  const handleEditCitationClick = useCallback(
    (ev) => {
      ev.currentTarget.closest("[data-key]")?.focus();
      onEditCitationClick(ev);
    },
    [onEditCitationClick],
  );

  const handleDeleteCitationClick = useCallback(
    (ev) => {
      const bibItemEl = ev.currentTarget.closest("[data-key]");
      const otherBibItemEl =
        bibItemEl.previousElementSibling || bibItemEl.nextElementSibling;
      onDeleteCitation(ev);
      if (otherBibItemEl) {
        otherBibItemEl.focus();
      }
    },
    [onDeleteCitation],
  );

  const handleKeyDown = useCallback(
    (ev) => {
      if (isTriggerEvent(ev)) {
        onSelectCitation(ev);
      } else if (ev.key === "ArrowRight") {
        focusNext(ev, { useCurrentTarget: false });
        ev.stopPropagation();
      } else if (ev.key === "ArrowLeft") {
        focusPrev(ev, { useCurrentTarget: false });
        ev.stopPropagation();
      }
    },
    [focusNext, focusPrev, onSelectCitation],
  );

  const getData = useCallback(
    (ev) => ({ key: ev.currentTarget.closest("[data-key]").dataset.key }),
    [],
  );

  const { onDrag, onHover, onDrop } = useDnd({
    type: BIB_ITEM,
    data: getData,
    ref: containerRef,
    ghostContainerSelector: ".zotero-bib-container",
    midpointOffset: 12,
    onComplete,
  });

  const copyText = isNoteStyle
    ? intl.formatMessage({
        id: "zbib.citation.copyNote",
        defaultMessage: "Copy Note",
      })
    : intl.formatMessage({
        id: "zbib.citation.copyCitation",
        defaultMessage: "Copy Citation",
      });

  return (
    <li
      aria-label="Citation"
      key={rawItem.key}
      data-dnd-candidate
      data-key={rawItem.key}
      className={cx("citation-container min-h-[72px]", { error: isError })}
      onClick={onSelectCitation}
      tabIndex={-2}
      onKeyDown={handleKeyDown}
      onMouseOver={onHover}
      onMouseOut={onHover}
      onMouseMove={onHover}
      onMouseUp={onDrop}
      ref={listItemRef}
      onFocus={receiveFocus}
      onBlur={receiveBlur}
    >
      <div
        className="citation border-t px-3 py-3 flex items-start md:items-center gap-3"
        ref={containerRef}
      >
        {allowReorder && (
          <div
            className="w-6 shrink-0"
            onMouseDown={onDrag}
            onTouchStart={onDrag}
          >
            <Grip className="h-6 w-6 text-primary" />
          </div>
        )}
        <div
          data-container-key={rawItem.key}
          className="csl-entry-container flex-1 min-w-0 pr-2"
          dangerouslySetInnerHTML={{ __html: formattedItem }}
        />
        <div className="hidden md:grid md:grid-cols-1">
          {!isNumericStyle && (
            <>
              <ShadcnButton
                variant="outline"
                size="sm"
                title={copyText}
                className="btn-copy"
                onClick={handleCopyCitationClick}
                tabIndex={-3}
              >
                <Quote className="h-4 w-4 text-muted-foreground" />
              </ShadcnButton>
              <ShadcnButton
                variant="outline"
                size="sm"
                title={intl.formatMessage({
                  id: "zbib.citation.copyBibliographyEntry",
                  defaultMessage: "Copy Bibliography Entry",
                })}
                disabled={copySingleState.citationKey === rawItem.key}
                className={cx("btn-copy", { success: isCopied })}
                onClick={handleCopySingleClick}
                tabIndex={-3}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </ShadcnButton>
            </>
          )}
          <ShadcnButton
            variant="outline"
            size="sm"
            title={intl.formatMessage({
              id: "zbib.citation.deleteEntry",
              defaultMessage: "Delete Entry",
            })}
            onClick={onDeleteCitation}
            tabIndex={-3}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </ShadcnButton>
        </div>
        <div className=" ml-auto">
          <DropdownMenu
            open={isDropdownOpen}
            onOpenChange={(open) =>
              onToggleDropdown({
                currentTarget: {
                  closest: () => ({ dataset: { key: rawItem.key } }),
                },
                stopPropagation: () => {},
              })
            }
          >
            <DropdownMenuTrigger asChild>
              <ShadcnButton
                variant="ghost"
                size="icon"
                className="btn-icon dropdown-toggle"
                title="Options"
                tabIndex={-3}
              >
                <MoreVertical className="h-7 w-7 text-primary" />
              </ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Options">
              {!isNumericStyle && (
                <Fragment>
                  <DropdownMenuItem
                    onClick={handleCopyCitationClick}
                    className="btn"
                  >
                    {copyText}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleCopySingleClick}
                    className={cx("btn clipboard-trigger", {
                      success: isCopied,
                    })}
                  >
                    <span
                      className={cx("inline-feedback", { active: isCopied })}
                    >
                      <span className="default-text" aria-hidden={isCopied}>
                        <FormattedMessage
                          id="zbib.citation.copyBibliographyEntry"
                          defaultMessage="Copy Bibliography Entry"
                        />
                      </span>
                    </span>
                  </DropdownMenuItem>
                </Fragment>
              )}
              <DropdownMenuItem
                onClick={handleEditCitationClick}
                className="btn"
              >
                <FormattedMessage
                  id="zbib.general.edit"
                  defaultMessage="Edit"
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteCitationClick}
                className="btn"
              >
                <FormattedMessage
                  id="zbib.general.delete"
                  defaultMessage="Delete"
                />
              </DropdownMenuItem>
              {allowReorder && (
                <Fragment>
                  <DropdownMenuSeparator />
                  {!isFirst && (
                    <DropdownMenuItem onClick={handleMoveTop} className="btn">
                      <FormattedMessage
                        id="zbib.citation.moveToTop"
                        defaultMessage="Move to Top"
                      />
                    </DropdownMenuItem>
                  )}
                  {!isFirst && (
                    <DropdownMenuItem onClick={handleMoveUp} className="btn">
                      <FormattedMessage
                        id="zbib.citation.moveUp"
                        defaultMessage="Move Up"
                      />
                    </DropdownMenuItem>
                  )}
                  {!isLast && (
                    <DropdownMenuItem onClick={handleMovedown} className="btn">
                      <FormattedMessage
                        id="zbib.citation.moveDown"
                        defaultMessage="Move Down"
                      />
                    </DropdownMenuItem>
                  )}
                </Fragment>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <script type="application/vnd.zotero.data+json">
          {JSON.stringify(rawItem)}
        </script>
      </div>
    </li>
  );
});

BibliographyItem.displayName = "BibliographyItem";

BibliographyItem.propTypes = {
  allowReorder: PropTypes.bool,
  copySingleState: PropTypes.object,
  dropdownsOpen: PropTypes.array,
  formattedItem: PropTypes.string,
  isDropdownOpen: PropTypes.bool,
  isError: PropTypes.bool,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isNoteStyle: PropTypes.bool,
  isNumericStyle: PropTypes.bool,
  onCopyCitationDialogOpen: PropTypes.func,
  onCopySingle: PropTypes.func,
  onDelayedCloseDropdown: PropTypes.func,
  onDeleteCitation: PropTypes.func,
  onEditCitationClick: PropTypes.func,
  onReorderCitations: PropTypes.func,
  onSelectCitation: PropTypes.func,
  onToggleDropdown: PropTypes.func,
  rawItem: PropTypes.object,
};

const Bibliography = (props) => {
  const dropdownTimer = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const listRef = useRef(null);
  const { focusNext, focusPrev, receiveBlur, receiveFocus } =
    useFocusManager(listRef);

  const {
    bibliography,
    bibliographyRendered,
    bibliographyRenderedNodes,
    isReadOnly,
    isSortedStyle,
    onCitationCopyDialogOpen,
    onDeleteEntry,
    onEditorOpen,
    styleHasBibliography,
  } = props;

  const handleSelectCitation = useCallback(
    (ev) => {
      const itemId = ev.currentTarget.closest("[data-key]").dataset.key;
      const selection = window.getSelection();

      // ignore keydown events on buttons
      if (ev.type === "keydown" && ev.currentTarget !== ev.target) {
        return;
      }

      // ignore click event fired when selecting text
      if (ev.type === "click" && selection.toString().length) {
        try {
          if (
            ev.target.closest(".citation") ===
            selection.anchorNode.parentNode.closest(".citation")
          ) {
            return;
          }
        } catch (_) {
          // selection.anchorNode.parentNode might fail in which case we open the editor
        }
      }
      if (!isReadOnly && itemId && isTriggerEvent(ev)) {
        onEditorOpen(itemId);
      }
    },
    [isReadOnly, onEditorOpen],
  );

  const handleEditCitationClick = useCallback(
    (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      setDropdownOpen(null);
      const itemId = ev.currentTarget.closest("[data-key]").dataset.key;
      onEditorOpen(itemId);
    },
    [onEditorOpen],
  );

  const handleDeleteCitation = useCallback(
    (ev) => {
      ev.stopPropagation();
      onDeleteEntry(ev.currentTarget.closest("[data-key]").dataset.key);
    },
    [onDeleteEntry],
  );

  const handleToggleDropdown = useCallback(
    (ev) => {
      ev.stopPropagation();
      clearTimeout(dropdownTimer.current);
      const itemId = ev.currentTarget?.closest?.("[data-key]")?.dataset.key;

      if (!itemId) {
        setDropdownOpen(null);
        return;
      }

      const isDropdownOpen = dropdownOpen === itemId;
      setDropdownOpen(isDropdownOpen ? null : itemId);
    },
    [dropdownOpen],
  );

  const handleDelayedCloseDropdown = useCallback(() => {
    clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => {
      setDropdownOpen(null);
    }, 950);
  }, []);

  const handleCopyCitationDialogOpen = useCallback(
    (ev) => {
      ev.stopPropagation();
      onCitationCopyDialogOpen(
        ev.currentTarget.closest("[data-key]").dataset.key,
      );
    },
    [onCitationCopyDialogOpen],
  );

  const handleListKeyDown = useCallback(
    (ev) => {
      if (ev.key === "ArrowDown") {
        focusNext(ev, { useCurrentTarget: false });
      } else if (ev.key === "ArrowUp") {
        focusPrev(ev, { useCurrentTarget: false });
      }
    },
    [focusNext, focusPrev],
  );

  if (bibliography.items.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {isReadOnly ? (
        <Fragment>
          <div
            suppressHydrationWarning={true}
            className="bibliography read-only"
            dangerouslySetInnerHTML={{ __html: bibliographyRendered }}
          />
          {bibliography.items.map((renderedItem) => (
            <script
              suppressHydrationWarning={true}
              key={renderedItem.id}
              type="application/vnd.zotero.data+json"
            >
              {JSON.stringify(bibliography.lookup[renderedItem.id])}
            </script>
          ))}
        </Fragment>
      ) : (
        <ul
          aria-label="Bibliography"
          className="bibliography"
          key="bibliography"
          ref={listRef}
          onFocus={receiveFocus}
          onBlur={receiveBlur}
          onKeyDown={handleListKeyDown}
          tabIndex={0}
        >
          {bibliography.items.map((renderedItem, index) => (
            <BibliographyItem
              {...pick(props, [
                "copySingleState",
                "isNoteStyle",
                "isNumericStyle",
                "onCopySingle",
                "onReorderCitations",
              ])}
              isDropdownOpen={dropdownOpen === renderedItem.id}
              formattedItem={
                bibliographyRenderedNodes?.[index]?.innerHTML ||
                renderedItem.value
              }
              key={renderedItem.id}
              onCopyCitationDialogOpen={handleCopyCitationDialogOpen}
              onDeleteCitation={handleDeleteCitation}
              onEditCitationClick={handleEditCitationClick}
              onSelectCitation={handleSelectCitation}
              onToggleDropdown={handleToggleDropdown}
              onDelayedCloseDropdown={handleDelayedCloseDropdown}
              rawItem={bibliography.lookup[renderedItem.id]}
              allowReorder={
                (!styleHasBibliography || !isSortedStyle) &&
                bibliography.items.length > 1
              }
              isFirst={index === 0}
              isLast={index === bibliography.items.length - 1}
              isError={bibliographyRenderedNodes?.[index]?.classList.contains(
                "csl-error",
              )}
            />
          ))}
        </ul>
      )}
    </Fragment>
  );
};

Bibliography.propTypes = {
  bibliography: PropTypes.object,
  bibliographyRendered: PropTypes.string,
  bibliographyRenderedNodes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(HTMLCollection),
  ]),
  isNoteStyle: PropTypes.bool,
  isNumericStyle: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isSortedStyle: PropTypes.bool,
  onCitationCopyDialogOpen: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onReorderCitations: PropTypes.func,
  styleHasBibliography: PropTypes.bool,
};

export default memo(Bibliography);
