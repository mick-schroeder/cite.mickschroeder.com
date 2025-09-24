import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
} from "react";
import copy from "copy-to-clipboard";
import SmoothScroll from "smooth-scroll";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";
import { useIntl } from "react-intl";
import { usePrevious } from "web-common/hooks";
import { pick, omit } from "web-common/utils";
import {
  CiteprocWrapper,
  fetchAndParseIndependentStyle,
  formatBib,
  formatFallback,
  getBibliographyFormatParameters,
} from "web-common/cite";
import { configureZoteroShim } from "web-common/zotero";

import {
  buildCitationFilename,
  calcOffset,
  dedupMultipleChoiceItems,
  ensureNoBlankItems,
  fetchFromPermalink,
  fetchSchema,
  getMetaFromSchema,
  getOneTimeBibliographyOrFallback,
  getExpandedCitationStyles,
  getItemsCSL,
  isDuplicate,
  isLikeUrl,
  parseIdentifier,
  processMultipleChoiceItems,
  processSentenceCaseAPAItems,
  retrieveStylesData,
  saveToPermalink,
  validateItem,
  validateUrl,
} from "../utils";
import { coreCitationStyles } from "../../../data/citation-styles-data.json";
import defaults from "../constants/defaults";
import exportFormats from "../constants/export-formats";
import ZoteroBib from "../zotero-translation-client.js";
import ZBib from "./zbib";
import { useUserTypeDetector } from "../hooks";
import supportedLocales from "../../../data/supported-locales.json";
import renamedStyles from "../../../data/renamed-styles.json";

const defaultItem = {
  version: 0,
  itemType: "book",
  tags: [],
  creators: [],
};

var msgId = 0;
const getNextMessageId = () =>
  ++msgId < Number.MAX_SAFE_INTEGER ? msgId : (msgId = 0);

const CONFIRM_CURRENT_STYLE = "CONFIRM_CURRENT_STYLE";
const ERROR_FETCH_STYLE = "ERROR_FETCH_STYLE";
const RECEIVE_FETCH_STYLE = "RECEIVE_FETCH_STYLE";
const REQUEST_FETCH_STYLE = "REQUEST_FETCH_STYLE";
const BEGIN_BUILD_BIBLIOGRAPHY = "BEGIN_BUILD_BIBLIOGRAPHY";
const COMPLETE_BUILD_BIBLIOGRAPHY = "COMPLETE_BUILD_BIBLIOGRAPHY";
const COMPLETE_REFRESH_BIBLIOGRAPHY = "COMPLETE_REFRESH_BIBLIOGRAPHY";
const BIBLIOGRAPHY_SOURCE_REPLACED = "BIBLIOGRAPHY_SOURCE_REPLACED";
const BIBLIOGRAPHY_SOURCE_CHANGED = "BIBLIOGRAPHY_SOURCE_CHANGED";
const CLEAR_MESSAGE = "CLEAR_MESSAGE";
const REPLACE_MESSAGE = "REPLACE_MESSAGE";
const POST_MESSAGE = "POST_MESSAGE";
const CLEAR_ALL_MESSAGES = "CLEAR_ALL_MESSAGES";
const REQUEST_SCHEMA = "REQUEST_SCHEMA";
const RECEIVE_SCHEMA = "RECEIVE_SCHEMA";
const ERROR_SCHEMA = "ERROR_SCHEMA";
const REQUEST_FETCH_INCOMING_STYLE = "REQUEST_FETCH_INCOMING_STYLE";
const RECEIVE_FETCH_INCOMING_STYLE = "RECEIVE_FETCH_INCOMING_STYLE";
const ERROR_FETCH_INCOMING_STYLE = "ERROR_FETCH_INCOMING_STYLE";
const REJECT_FETCH_INCOMING_STYLE = "REJECT_FETCH_INCOMING_STYLE";
const TRANSLATION_RECEIVED = "TRANSLATION_RECEIVED";
const TRANSLATION_PROCESSED = "TRANSLATION_PROCESSED";

const fetchAndSelectStyle = async (dispatch, styleName, opts = {}) => {
  dispatch({ type: REQUEST_FETCH_STYLE, styleName });
  try {
    const styleData = await fetchAndParseIndependentStyle(styleName);
    if (opts.store) {
      localStorage.setItem(
        "schroeder-cite-citation-style",
        styleData.citationStyleName ?? styleName,
      );
    }
    dispatch({
      type: RECEIVE_FETCH_STYLE,
      ...styleData,
      ...opts,
    });
  } catch (error) {
    dispatch({ type: ERROR_FETCH_STYLE, styleName, error });
  }
};

const maybeFetchIncomingStyle = async (
  dispatch,
  styleName,
  isSameAsCurrent,
) => {
  dispatch({ type: REQUEST_FETCH_INCOMING_STYLE, styleName });
  if (isSameAsCurrent) {
    dispatch({ type: REJECT_FETCH_INCOMING_STYLE, styleName });
    return;
  }
  try {
    const styleData = await fetchAndParseIndependentStyle(styleName);
    dispatch({
      type: RECEIVE_FETCH_INCOMING_STYLE,
      ...styleData,
    });
  } catch (error) {
    dispatch({ type: ERROR_FETCH_INCOMING_STYLE, styleName, error });
  }
};

const configureZoteroSchema = async (dispatch, intl, apiAuthorityPart) => {
  dispatch({ type: REQUEST_SCHEMA });
  try {
    const schema = await fetchSchema(apiAuthorityPart);
    configureZoteroShim(schema, intl);
    const meta = getMetaFromSchema(schema, intl.locale);
    dispatch({ type: RECEIVE_SCHEMA, schema, meta });
  } catch (error) {
    console.error(error);
    dispatch({ type: ERROR_SCHEMA, error });
  }
};

const confirmStyle = (dispatch) => dispatch({ type: CONFIRM_CURRENT_STYLE });

const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_FETCH_INCOMING_STYLE:
      return {
        ...state,
        incomingStyle: {
          isFetching: true,
        },
      };
    case REJECT_FETCH_INCOMING_STYLE:
      return {
        ...state,
        incomingStyle: {
          name: action.styleName,
          isFetching: false,
        },
      };
    case RECEIVE_FETCH_INCOMING_STYLE:
      return {
        ...state,
        incomingStyle: {
          name: action.styleProps.citationStyleName,
          isFetching: false,
          xml: action.parentStyleXml ?? action.styleXml,
          isDependent: !!action.styleProps.parentStyleName,
          ...pick(action.styleProps, [
            "styleHasBibliography",
            "isNumericStyle",
            "isNoteStyle",
            "isSortedStyle",
            "isUppercaseSubtitlesStyle",
            "isSentenceCaseStyle",
            "title",
            "titleShort",
            "id",
          ]),
        },
      };
    case ERROR_FETCH_INCOMING_STYLE:
      return {
        ...state,
        incomingStyle: {
          ...state.incomingStyle,
          isError: true,
          isFetching: false,
        },
      };
    case REQUEST_FETCH_STYLE:
      return { ...state, isFetching: true };
    case ERROR_FETCH_STYLE:
      return { ...state, isFetching: false };
    case RECEIVE_FETCH_STYLE:
      return {
        ...state,
        selectedStyle: {
          // TODO: migrate root-level props to selectedStyle
          // xml: action.parentStyleXml ?? action.styleXml,
          // isDependent: !!action.styleProps.parentStyleName,
          ...pick(action.styleProps, [
            "styleHasBibliography",
            "isNumericStyle",
            "isNoteStyle",
            "isSortedStyle",
            "isUppercaseSubtitlesStyle",
            "isSentenceCaseStyle",
            "title",
            "titleShort",
          ]),
        },
        isFetching: false,
        bibliographyNeedsRebuild: true,
        selected: action.styleName, // in case of dependant style, this is the name of the parent style
        xml: action.parentStyleXml ?? action.styleXml,
        isDependent: !!action.styleProps.parentStyleName,
        isConfirmed:
          typeof action.isConfirmed === "boolean"
            ? action.isConfirmed
            : !action.styleProps.isSentenceCaseStyle,
        localeOverride: action.styleProps.parentStyleName
          ? action.styleProps.defaultLocale
          : null,
        ...pick(action.styleProps, [
          "styleHasBibliography",
          "isNumericStyle",
          "isNoteStyle",
          "isSortedStyle",
          "isUppercaseSubtitlesStyle",
          "isSentenceCaseStyle",
        ]),
      };
    case REQUEST_SCHEMA:
      return { ...state, isSchemaReady: false };
    case RECEIVE_SCHEMA:
      return {
        ...state,
        meta: action.meta,
        isSchemaReady: true,
      };
    case CONFIRM_CURRENT_STYLE:
      return {
        ...state,
        isConfirmed: true,
      };
    case BEGIN_BUILD_BIBLIOGRAPHY:
      return {
        ...state,
        isCiteprocReady: false,
      };
    case COMPLETE_BUILD_BIBLIOGRAPHY:
      return {
        ...state,
        bibliography: pick(action, ["items", "meta", "lookup"]),
        isCiteprocReady: true,
        bibliographyNeedsRebuild: false,
        bibliographyNeedsRefresh: false,
      };
    case COMPLETE_REFRESH_BIBLIOGRAPHY:
      return {
        ...state,
        bibliography: {
          ...state.bibliography,
          ...pick(action, ["items", "lookup"]),
        },
        bibliographyNeedsRefresh: false,
      };
    case BIBLIOGRAPHY_SOURCE_REPLACED:
      return {
        ...state,
        isCiteprocReady: false,
        bibliographyNeedsRebuild: true,
      };
    case BIBLIOGRAPHY_SOURCE_CHANGED:
      return {
        ...state,
        bibliographyNeedsRefresh: true,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((m) =>
          "id" in action ? m.id !== action.id : m.kind !== action.kind,
        ),
      };
    case REPLACE_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages.filter((m) => m.kind !== action.kind),
          action.message,
        ],
      };
    case POST_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case CLEAR_ALL_MESSAGES:
      return { ...state, messages: [] };
    case TRANSLATION_RECEIVED:
      return {
        ...state,
        translation: omit(action, "type"),
      };
    case TRANSLATION_PROCESSED:
      return {
        ...state,
        translation: undefined,
      };
  }
  return state;
};

const BibWebContainer = (props) => {
  const remoteId = window.location.pathname.match(/\/([0-9a-fA-f]{32})/)?.[1];
  const citeproc = useRef(null);
  const bib = useRef(null);
  const abortController = useRef(null);
  const copyDataInclude = useRef(null);
  const revertCitationStyle = useRef(null);
  const lastDeletedItem = useRef(null);
  const duplicate = useRef(null);
  const initialCitationsCount = useRef(null);
  const copySingleTimeout = useRef(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [activeDialog, setActiveDialog] = useState(null);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const wasDataReady = usePrevious(isDataReady);
  const isReadOnly = isPrintMode || !!remoteId;
  const hydrateItemsCount = props.hydrateItemsCount;
  const config = useMemo(
    () => ({ ...defaults, ...props.config }),
    [props.config],
  );
  const { keyboard, mouse, touch } = useUserTypeDetector();
  const intl = useIntl();
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (bib.current === null) {
    bib.current = new ZoteroBib(config);
    bib.current.reloadItems();
    initialCitationsCount.current = bib.current.items.length;
  }

  // isHydrated is true during hydration render. It is used throughout app to pretend we're ready
  // (without any data) so that rendered components (almost) match static markup (otherwise we
  // would be showing spinners etc.). Once app is hydrated, we operate normally.
  const isHydrated = useRef(typeof props.hydrateItemsCount !== "undefined");

  if (isHydrated.current && !isReadOnly) {
    throw new Error(
      `BibWebContainer bootstrapped incorrectly. RemoteID must be present to hydrate. Path: ${window.location.pathname}`,
    );
  }

  const [state, dispatch] = useReducer(reducer, {
    bibliography: { items: [], meta: null, lookup: {} },
    bibliographyNeedsRebuild: false,
    bibliographyNeedsRefresh: false,
    incomingStyle: { isFetching: false },
    isCiteprocReady: false,
    isConfirmed: undefined,
    isDependent: false,
    isFetching: false,
    isNoteStyle: undefined,
    isNumericStyle: undefined,
    isSchemaReady: false,
    isSentenceCaseStyle: undefined,
    isSortedStyle: undefined,
    isUppercaseSubtitlesStyle: undefined,
    localeOverride: null,
    messages: [],
    meta: {},
    selected: undefined,
    styleHasBibliography: undefined,
    translation: undefined,
    xml: undefined,
  });

  const prevCitationStyle = usePrevious(state.selected);
  const [isStylesDataLoading, setIsStylesDataLoading] = useState(false);
  const [stylesData, setStylesData] = useState(null);
  const [copyCitationState, setCopyCitationState] = useState({
    citationKey: null,
    inTextHtml: null,
    inTextPlain: null,
    modifiers: {},
  });
  const [copySingleState, setCopySingleState] = useState({
    citationKey: null,
    copied: false,
  });
  const [title, setTitle] = useState(
    props.title ||
      (remoteId ? "" : localStorage.getItem("schroeder-cite-title") || ""),
  );
  const prevTitle = usePrevious(title);
  const [identifier, setIdentifier] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingMore, setIsTranslatingMore] = useState(false);
  const [itemUnderReview, setItemUnderReview] = useState(null);
  const [multipleItems, setMultipleItems] = useState(null);
  const [itemToConfirm, setItemToConfirm] = useState(null);
  const [moreItemsLink, setMoreItemsLink] = useState(null);
  const [multipleChoiceItems, setMultipleChoiceItems] = useState(null);
  const [editorItem, setEditorItem] = useState(null);
  const [permalink, setPermalink] = useState(null);
  const [isQueryHandled, setIsQueryHandled] = useState(
    window.location.pathname !== "/import",
  );

  const wasSentenceCaseStyle = usePrevious(state.isSentenceCaseStyle);
  const useLegacy = useRef(true);
  const isStyleReady = state.selected && state.isConfirmed && !state.isFetching;
  const isIncomingStyleReady =
    state.incomingStyle && !state.incomingStyle.isFetching;
  const prevIncomingStyleName = usePrevious(state.incomingStyle?.name);

  const isReady =
    isStyleReady &&
    state.isCiteprocReady &&
    isDataReady &&
    isQueryHandled &&
    state.isSchemaReady &&
    !state.bibliographyNeedsRebuild;

  const [citationStyles, setCitationStyles] = useState([
    ...coreCitationStyles.map((cs) => ({
      ...cs,
      isDependent: 0,
      parent: null,
      isCore: true,
    })),
    ...(JSON.parse(
      localStorage.getItem("schroeder-cite-extra-citation-styles"),
    ) || []),
  ]);
  citationStyles.sort((a, b) =>
    a.title.toUpperCase().localeCompare(b.title.toUpperCase()),
  );

  const localCitationsCount = remoteId
    ? initialCitationsCount.current
    : bib.current.items.length;

  const bibliographyRendered = useMemo(() => {
    return state.styleHasBibliography && state.bibliography.meta
      ? formatBib(state.bibliography.items, state.bibliography.meta)
      : formatFallback(state.bibliography.items);
  }, [
    state.bibliography.items,
    state.bibliography.meta,
    state.styleHasBibliography,
  ]);

  const bibliographyRenderedNodes = useMemo(() => {
    const div = document.createElement("div");
    div.innerHTML = bibliographyRendered;
    div.querySelectorAll("a").forEach((link) => {
      link.setAttribute("rel", "nofollow");
    });
    return div.firstChild.children;
  }, [bibliographyRendered]);

  const buildBibliography = useCallback(async () => {
    dispatch({ type: BEGIN_BUILD_BIBLIOGRAPHY });

    //TODO: if citeproc.current use setStyle on CiteprocWrapper, once it supports localeOverride
    citeproc.current = await CiteprocWrapper.new(state.xml, {
      format: "html",
      formatOptions: { linkAnchors: isReadOnly },
      localeOverride: state.localeOverride,
      supportedLocales,
      skipErrors: isReadOnly,
      useCiteprocJS: useLegacy.current,
    });

    const t0 = performance.now();
    citeproc.current.includeUncited("All");
    citeproc.current.insertReferences(ensureNoBlankItems(bib.current.itemsCSL));

    let items, meta;
    const lookup = bib.current.itemsRaw.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});

    if (state.styleHasBibliography) {
      citeproc.current.initClusters([]);
      items = citeproc.current.makeBibliography();
      meta = citeproc.current.bibliographyMeta();
      const t1 = performance.now();
      console.log(
        `Engine: ${useLegacy.current ? "JS" : "RS"}; ${bib.current.itemsRaw.length} items; Bibliography generation took ${(t1 - t0).toFixed(2)} milliseconds.`,
      );
    } else {
      // init every single item as a separate cluster for fallback rendering
      citeproc.current.initClusters(
        bib.current.itemsRaw.map((item) => ({
          id: item.key,
          cites: [{ id: item.key }],
        })),
      );
      citeproc.current.setClusterOrder(
        bib.current.itemsRaw.map((item) => ({ id: item.key })),
      );
      const render = citeproc.current.fullRender();
      const t1 = performance.now();
      console.log(
        `Engine: ${useLegacy.current ? "JS" : "RS"}; ${bib.current.itemsRaw.length} items; Bibliography generation took ${(t1 - t0).toFixed(2)} milliseconds.`,
      );
      items = bib.current.itemsRaw.map((item) => ({
        id: item.key,
        value: render.allClusters[item.key],
      }));
      meta = null;
    }
    dispatch({ type: COMPLETE_BUILD_BIBLIOGRAPHY, items, meta, lookup });
  }, [isReadOnly, state.xml, state.localeOverride, state.styleHasBibliography]);

  const updateBibliography = useCallback(() => {
    const t0 = performance.now();
    const diff = citeproc.current.batchedUpdates();
    const t1 = performance.now();
    console.log(
      `Engine: ${useLegacy.current ? "JS" : "RS"}; Bibliography update took ${(t1 - t0).toFixed(2)} milliseconds.`,
    );

    if (bib.current.itemsRaw.length === 0) {
      dispatch({ type: COMPLETE_REFRESH_BIBLIOGRAPHY, items: [], lookup: {} });
      return;
    }

    const lookup = bib.current.itemsRaw.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});
    let items;

    if (diff.bibliography && state.styleHasBibliography) {
      if (diff.bibliography.entryIds) {
        items = diff.bibliography.entryIds.map((entryId) => ({
          id: Array.isArray(entryId) ? entryId[0] : entryId,
          value:
            entryId in diff.bibliography.updatedEntries
              ? diff.bibliography.updatedEntries[entryId]
              : state.bibliography.items.find(
                  (bibItem) => bibItem.id === entryId,
                ).value,
        }));
      } else {
        items = state.bibliography.items.map((bibItem) => {
          return bibItem.id in diff.bibliography.updatedEntries
            ? {
                id: bibItem.id,
                value: diff.bibliography.updatedEntries[bibItem.id],
              }
            : bibItem;
        });
      }
    } else if (!state.styleHasBibliography) {
      const newBibliographyItems = [];
      diff.clusters.forEach(([id, value]) => {
        const existingEntry = state.bibliography.items.find(
          (bibItem) => bibItem.id === id,
        );
        if (existingEntry) {
          existingEntry.value = value;
        } else {
          newBibliographyItems.push({ id, value });
        }
      });

      items = bib.current.itemsRaw.map((item) => {
        const updatedEntry = diff.clusters.find(([id]) => id === item.key);
        return updatedEntry
          ? { id: updatedEntry[0], value: updatedEntry[1] }
          : state.bibliography.items.find((bibItem) => bibItem.id === item.key);
      });
    } else {
      // updateBibliography called but diff is empty so no action required
      return;
    }

    dispatch({ type: COMPLETE_REFRESH_BIBLIOGRAPHY, lookup, items });
  }, [state.styleHasBibliography, state.bibliography]);

  const addItem = useCallback(
    (item, showFirstCitationMessage = true, index = null) => {
      duplicate.current = isDuplicate(item, bib.current.itemsRaw);
      if (duplicate.current) {
        const message = {
          action: "Show Duplicate",
          id: getNextMessageId(),
          kind: "DUPLICATE",
          message: "Possible duplicate already exists in the bibliography",
        };
        dispatch({ type: REPLACE_MESSAGE, kind: "DUPLICATE", message });
      }

      if (state.isSentenceCaseStyle) {
        bib.current.addItem(
          processSentenceCaseAPAItems([item], state.meta.baseMappings)[0],
        );
      } else {
        bib.current.addItem(item);
      }

      if (index !== null && bib.current.itemsRaw[index]) {
        handleReorderCitations(item.key, bib.current.itemsRaw[index].key, true);
      }

      if (
        showFirstCitationMessage &&
        !localStorage.getItem("zotero-bib-translated")
      ) {
        localStorage.setItem("zotero-bib-translated", "true");
        displayFirstCitationMessage();
      }

      //TODO: optimise in bib
      const itemCSL = bib.current.itemsCSL.find((icsl) => icsl.id === item.key);

      citeproc.current.insertReference(ensureNoBlankItems([itemCSL])[0]);
      if (!state.styleHasBibliography) {
        citeproc.current.insertCluster({
          id: itemCSL.id,
          cites: [{ id: itemCSL.id }],
        });
        citeproc.current.setClusterOrder(
          bib.current.itemsRaw.map((item) => ({ id: item.key })),
        );
      }
    },
    [
      displayFirstCitationMessage,
      handleReorderCitations,
      state.isSentenceCaseStyle,
      state.meta.baseMappings,
      state.styleHasBibliography,
    ],
  );

  const deleteItem = useCallback(
    (itemId) => {
      const item = bib.current.itemsRaw.find((item) => item.key == itemId);
      if (bib.current.removeItem(item)) {
        citeproc.current.removeReference(itemId);

        if (!state.styleHasBibliography) {
          citeproc.current.removeCluster(itemId);
          citeproc.current.setClusterOrder(
            bib.current.itemsRaw.map((item) => ({ id: item.key })),
          );
        }
      }
    },
    [state.styleHasBibliography],
  );

  const displayFirstCitationMessage = useCallback(() => {
    const message = {
      action: "Read More",
      id: getNextMessageId(),
      kind: "FIRST_CITATION",
      message:
        "Your first citation has been added. Citations are stored locally in your browser.",
      href: "/faq#where-is-my-bibliography-stored",
    };
    dispatch({ type: REPLACE_MESSAGE, kind: "WELCOME_MESSAGE", message });
  }, []);

  const displayWelcomeMessage = useCallback(() => {
    const message = {
      action: "Accept",
      id: getNextMessageId(),
      kind: "WELCOME_MESSAGE",
      message:
        "Mick Schroeder's Citation Generator uses cookies for Google Analytics and AdSense; by continuing to use it, you consent to this use.",
    };
    dispatch({ type: POST_MESSAGE, message });
  }, []);

  const installCitationStyle = useCallback(
    async (styleName) => {
      const stylesData = await retrieveStylesData(config.stylesURL);
      const newStyleMeta = stylesData.find((sd) => sd.name === styleName);
      setCitationStyles(
        getExpandedCitationStyles(citationStyles, newStyleMeta),
      );
    },
    [citationStyles, config.stylesURL],
  );

  const fetchRemoteBibliography = useCallback(async () => {
    try {
      const remoteData = await fetchFromPermalink(
        `${config.storeURL}/${remoteId}`,
      );
      if (remoteData && "items" in remoteData) {
        if (remoteData.citationStyle) {
          if (remoteData.citationStyle in renamedStyles) {
            console.warn(
              `Using renamed citation style ${remoteData.citationStyle} to ${renamedStyles[remoteData.citationStyle]}`,
            );
            remoteData.citationStyle = renamedStyles[remoteData.citationStyle];
          }
          await fetchAndSelectStyle(dispatch, remoteData.citationStyle, {
            isConfirmed: true,
          });

          var citationStyleMeta = citationStyles.find(
            (cs) => cs.name === remoteData.citationStyle,
          );
          if (!citationStyleMeta) {
            await installCitationStyle(remoteData.citationStyle);
          }
        }

        bib.current = new ZoteroBib({
          ...config,
          initialItems: remoteData.items,
          persist: false,
        });

        setTitle(remoteData?.title ?? "");
        setIsDataReady(true);
      }
    } catch (e) {
      window.history.pushState(null, null, "/");
      handleError("Failed to load citations by id", e);
    }
  }, [citationStyles, config, handleError, installCitationStyle, remoteId]);

  const getCopyData = useCallback(
    async (format, itemsCSL) => {
      itemsCSL = itemsCSL || bib.current.itemsCSL;
      const { bibliographyItems, bibliographyMeta } =
        await getOneTimeBibliographyOrFallback(
          itemsCSL,
          state.xml,
          state.styleHasBibliography,
          useLegacy.current,
          { format, skipErrors: true },
        );

      if (bibliographyItems) {
        const copyData =
          format === "html"
            ? state.styleHasBibliography
              ? formatBib(bibliographyItems, bibliographyMeta)
              : formatFallback(bibliographyItems)
            : bibliographyItems.map((i) => i.value).join("\n");

        if (exportFormats[format].include) {
          copyDataInclude.current = [
            {
              mime: exportFormats[format].mime,
              data: copyData,
            },
            {
              mime: exportFormats[exportFormats[format].include].mime,
              data: await getCopyData(exportFormats[format].include),
            },
          ];
        }
        return copyData;
      }

      return "";
    },
    [state.xml, state.styleHasBibliography],
  );

  const handleDownloadFile = useCallback(
    async (format) => {
      var fileContents,
        separator,
        bibStyle,
        preamble = "";

      if (format === "ris") {
        try {
          fileContents = await bib.current.exportItems("ris");
        } catch (e) {
          handleError(e.message);
          return;
        }
      } else if (format === "bibtex") {
        try {
          fileContents = await bib.current.exportItems("bibtex");
        } catch (e) {
          handleError(e.message);
          return;
        }
      } else {
        const { bibliographyItems, bibliographyMeta } =
          await getOneTimeBibliographyOrFallback(
            bib.current.itemsCSL,
            state.xml,
            state.styleHasBibliography,
            useLegacy.current,
            { format, skipErrors: true },
          );

        if (format === "rtf") {
          bibStyle = getBibliographyFormatParameters(bibliographyMeta);
          separator = "\\\r\n";
          preamble = `${bibStyle.tabStops.length ? "\\tx" + bibStyle.tabStops.join(" \\tx") + " " : ""}\\li${bibStyle.indent} \\fi${bibStyle.firstLineIndent} \\sl${bibStyle.lineSpacing} \\slmult1 \\sa${bibStyle.entrySpacing} `;
        }
        fileContents = `{\\rtf ${bibliographyMeta?.formatMeta?.markupPre || ""}${preamble}${bibliographyItems.map((i) => i.value).join(separator)}${bibliographyMeta?.formatMeta?.markupPost || ""}}`;
      }

      const fileName = `citations.${exportFormats[format].extension}`;
      try {
        const file = new File([fileContents], fileName, {
          type: exportFormats[format].mime,
        });
        saveAs(file);
      } catch (_) {
        // Old Edge & Safari, see #237
        const blob = new Blob([fileContents], {
          type: exportFormats[format].mime,
        });
        saveAs(blob, fileName);
      }
    },
    [handleError, state.xml, state.styleHasBibliography],
  );

  const handleError = useCallback((errorMessage, errorData) => {
    const message = {
      id: getNextMessageId(),
      kind: "ERROR",
      message: errorMessage,
    };
    dispatch({ type: POST_MESSAGE, message });
    if (errorData) {
      console.error(errorData); //eslint-disable-line no-console
    }
  }, []);

  const handleCitationStyleChanged = useCallback(
    async (newCitationStyle) => {
      dispatch({ type: CLEAR_ALL_MESSAGES });
      setItemUnderReview(null);
      if (newCitationStyle === "install") {
        setActiveDialog("STYLE_INSTALLER");
        setIsStylesDataLoading(true);
        try {
          setStylesData(await retrieveStylesData(config.stylesURL));
          setIsStylesDataLoading(false);
        } catch (e) {
          handleError(e.message, e);
          setActiveDialog(null);
          setIsStylesDataLoading(false);
        }
      } else {
        fetchAndSelectStyle(dispatch, newCitationStyle);
        localStorage.setItem("schroeder-cite-citation-style", newCitationStyle);
      }
    },
    [config.stylesURL, handleError],
  );

  const handleCitationCopyDialogOpen = useCallback((itemId) => {
    dispatch({ type: CLEAR_ALL_MESSAGES });
    setItemUnderReview(null);
    setActiveDialog("COPY_CITATION");
    setCopyCitationState((state) => ({ ...state, citationKey: itemId }));
  }, []);

  const handleCitationCopyDialogClose = useCallback(() => {
    setActiveDialog(null);
    setCopyCitationState({
      citationKey: null,
      inTextHtml: null,
      modifiers: {},
    });
  }, []);

  const handleCitationCopy = useCallback(() => {
    copyDataInclude.current = [
      { mime: "text/plain", data: copyCitationState.inTextPlain },
      { mime: "text/html", data: copyCitationState.inTextHtml },
    ];

    return copy(copyCitationState.inTextPlain);
  }, [copyCitationState.inTextHtml, copyCitationState.inTextPlain]);

  const handleCopySingle = useCallback(
    async (citationKey) => {
      if (copySingleTimeout.current) {
        clearTimeout(copySingleTimeout.current);
        copySingleTimeout.current = null;
        setCopySingleState({ citationKey: null, copied: false });
      }

      try {
        const bibliographyHtml = await getCopyData(
          "html",
          getItemsCSL([state.bibliography.lookup[citationKey]]),
        );
        const bibliographyPlain = await getCopyData(
          "plain",
          getItemsCSL([state.bibliography.lookup[citationKey]]),
        );
        copyDataInclude.current = [
          { mime: "text/plain", data: bibliographyPlain },
          { mime: "text/html", data: bibliographyHtml },
        ];

        if (copy(bibliographyPlain)) {
          setCopySingleState({ citationKey, copied: true });
          copySingleTimeout.current = setTimeout(() => {
            setCopySingleState({ citationKey: null, copied: false });
          }, 1000);
        }
      } catch (_) {
        setCopySingleState({ citationKey: null, copied: false });
      }
    },
    [getCopyData, state.bibliography.lookup],
  );


  const handleCopyToClipboard = useCallback((ev) => {
    if (copyDataInclude.current) {
      copyDataInclude.current.forEach((copyDataFormat) => {
        ev.clipboardData.setData(copyDataFormat.mime, copyDataFormat.data);
      });
      ev.preventDefault();
      copyDataInclude.current = null;
    }
  }, []);

  const handleCitationModifierChange = useCallback((citationCopyModifiers) => {
    setCopyCitationState((state) => ({
      ...state,
      modifiers: citationCopyModifiers,
    }));
  }, []);

  const handleConfirmAddCancel = useCallback(() => {
    setActiveDialog(null);
    setItemToConfirm(null);
  }, []);

  const handleConfirmAddConfirm = useCallback(
    async (useIncomingStyle) => {
      addItem(itemToConfirm.item);

      const { xml, styleHasBibliography } = useIncomingStyle
        ? state.incomingStyle
        : state;
      setItemUnderReview({
        item: itemToConfirm.item,
        ...(await getOneTimeBibliographyOrFallback(
          getItemsCSL([itemToConfirm.item]),
          xml,
          styleHasBibliography,
          useLegacy.current,
        )),
      });
      setActiveDialog(null);
      setItemToConfirm(null);
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
      if (useIncomingStyle) {
        fetchAndSelectStyle(dispatch, state.incomingStyle.name, {
          store: true,
        });
      }
    },
    [addItem, itemToConfirm, state],
  );

  const handleDeleteEntry = useCallback(
    (itemId) => {
      const index = bib.current.itemsRaw.findIndex(
        (item) => item.key == itemId,
      );
      const item = bib.current.itemsRaw[index];
      lastDeletedItem.current = {
        item,
        index: index === bib.current.itemsRaw.length - 1 ? null : index,
      };
      setItemUnderReview(null);
      deleteItem(itemId);
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
      const message = {
        id: getNextMessageId(),
        action: "Undo",
        kind: "UNDO_DELETE",
        message: "Item Deleted",
      };
      dispatch({ type: REPLACE_MESSAGE, kind: "UNDO_DELETE", message });
    },
    [deleteItem],
  );

  const handleDeleteCitations = useCallback(() => {
    bib.current.clearItems();
    citeproc.current.resetReferences([]);
    if (!state.styleHasBibliography) {
      citeproc.current.initClusters([]);
    }
    dispatch({ type: CLEAR_ALL_MESSAGES });
    setItemUnderReview(null);
    setTitle("");
    dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
  }, [state.styleHasBibliography]);

  const handleReorderCitations = useCallback(
    (srcItemKey, targetItemKey, placeBefore = false) => {
      const reorderedItems = [...bib.current.itemsRaw];
      const srcItemIndex = reorderedItems.findIndex(
        (i) => i.key === srcItemKey,
      );
      const srcItem = reorderedItems.splice(srcItemIndex, 1).pop();
      const targetItemIndex = reorderedItems.findIndex(
        (i) => i.key === targetItemKey,
      );
      const effectiveTargetItemIndex = targetItemIndex + (placeBefore ? 0 : 1);
      reorderedItems.splice(effectiveTargetItemIndex, 0, srcItem);

      bib.current = new ZoteroBib({
        ...config,
        initialItems: reorderedItems,
        override: true,
      });
      citeproc.current.resetReferences(
        ensureNoBlankItems(bib.current.itemsCSL),
      );
      if (!state.styleHasBibliography) {
        citeproc.current.initClusters(
          bib.current.itemsRaw.map((item) => ({
            id: item.key,
            cites: [{ id: item.key }],
          })),
        );
        citeproc.current.setClusterOrder(
          bib.current.itemsRaw.map((item) => ({ id: item.key })),
        );
      }

      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
    },
    [config, state.styleHasBibliography],
  );

  const handleDismiss = useCallback(
    (id) => {
      const message = state.messages.find((m) => m.id === id);
      if (message) {
        if (message.kind === "UNDO_DELETE") {
          lastDeletedItem.current = null;
        }
        dispatch({ type: CLEAR_MESSAGE, id });
      }
    },
    [state.messages],
  );

  const handleGetStartedClick = useCallback((ev) => {
    const target = document.querySelector(".zotero-bib-container");
    new SmoothScroll().animateScroll(target, ev.currentTarget, {
      speed: 1000,
      speedAsDuration: true,
    });
    document.querySelector(".id-input").focus();
  }, []);

  const handleHelpClick = useCallback((ev) => {
    const target = document.querySelector("#help");
    new SmoothScroll().animateScroll(target, ev.currentTarget, {
      speed: 1000,
      speedAsDuration: true,
      offset: calcOffset(),
    });
  }, []);
  const handleAboutClick = useCallback((ev) => {
    const target = document.querySelector("#about");
    new SmoothScroll().animateScroll(target, ev.currentTarget, {
      speed: 1000,
      speedAsDuration: true,
      offset: calcOffset(),
    });
  }, []);
  const handleExamplesClick = useCallback((ev) => {
    const target = document.querySelector("#examples");
    new SmoothScroll().animateScroll(target, ev.currentTarget, {
      speed: 1000,
      speedAsDuration: true,
      offset: calcOffset(),
    });
  }, []);

  const handleItemCreated = useCallback(
    (item) => {
      addItem(item, false);
      setEditorItem({ ...item });
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
    },
    [addItem],
  );

  const handleItemUpdate = useCallback(
    async (itemKey, patch) => {
      const index = bib.current.itemsRaw.findIndex(
        (item) => item.key === itemKey,
      );

      let updatedItem = {
        ...bib.current.itemsRaw[index],
        ...patch,
      };

      validateItem(
        updatedItem,
        state.meta.itemTypeFields?.[updatedItem?.itemType],
        state.meta.itemTypeCreatorTypes?.[updatedItem?.itemType],
      );

      if (state.isSentenceCaseStyle) {
        const itemsMetaData =
          JSON.parse(localStorage.getItem("schroeder-cite-items-metadata")) ||
          {};

        if (!(itemKey in itemsMetaData)) {
          itemsMetaData[itemKey] = {};
        }

        itemsMetaData[itemKey]["apaEditedKeys"] = [
          ...new Set([
            ...(itemsMetaData[itemKey]["apaEditedKeys"] || []),
            ...Object.keys(patch),
          ]),
        ];
        localStorage.setItem(
          "schroeder-cite-items-metadata",
          JSON.stringify(itemsMetaData),
        );
      }
      bib.current.updateItem(index, updatedItem);
      setEditorItem({ ...updatedItem });

      citeproc.current.resetReferences(
        ensureNoBlankItems(bib.current.itemsCSL),
      );
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });

      // if edited item is itemUnderReview, update it as well
      if (itemUnderReview && itemUnderReview.key === itemKey) {
        setItemUnderReview(updatedItem);
      }
    },
    [handleError, itemUnderReview, state.isSentenceCaseStyle, state.meta],
  );

  const handleMultipleChoiceCancel = useCallback(() => {
    setActiveDialog(null);
    setMultipleChoiceItems(null);
  }, []);

  const handleMultipleChoiceMore = useCallback(async () => {
    setIsTranslatingMore(true);
    try {
      let { result, items, next } = await bib.current.translateIdentifier(
        identifier,
        {
          endpoint: moreItemsLink,
          add: false,
        },
      );

      switch (result) {
        case ZoteroBib.COMPLETE:
        case ZoteroBib.MULTIPLE_CHOICES:
          setIsTranslatingMore(false);
          setActiveDialog("MULTIPLE_CHOICE_DIALOG");
          setMoreItemsLink(next);
          setMultipleChoiceItems(
            dedupMultipleChoiceItems([
              ...multipleChoiceItems,
              ...(await processMultipleChoiceItems(
                items,
                state.meta.itemTypes,
              )),
            ]),
          );
          break;
        case ZoteroBib.FAILED:
          handleError("An error occurred while fetching more items.");
          setIsTranslatingMore(false);
          break;
      }
    } catch (e) {
      handleError("An error occurred while fetching more items.", e);
      setIsTranslatingMore(false);
    }
  }, [handleError, identifier, moreItemsLink, multipleChoiceItems, state.meta]);

  const handleMultipleItemsCancel = useCallback(() => {
    setActiveDialog(null);
    setMultipleItems(null);
  }, []);

  const handleMultipleItemsSelect = useCallback(
    async (keys) => {
      const items = multipleItems.items.filter((i) => keys.includes(i.key));
      items.forEach((i) => addItem(i));
      setActiveDialog(null);
      setMultipleItems(null);
      setItemUnderReview(null);
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
    },
    [addItem, multipleItems],
  );

  const handleOpenEditor = useCallback(
    (itemId = null) => {
      if (itemUnderReview && itemId && itemId != itemUnderReview.key) {
        setItemUnderReview(null);
      }

      dispatch({ type: CLEAR_ALL_MESSAGES });
      setEditorItem({
        ...(bib.current.itemsRaw.find((i) => i.key === itemId) || defaultItem),
      });
      setActiveDialog("EDITOR");
    },
    [itemUnderReview],
  );

  const handleCloseEditor = useCallback(
    (hasCreatedItem = false) => {
      setEditorItem(null);
      setActiveDialog(null);

      if (hasCreatedItem) {
        if (!localStorage.getItem("zotero-bib-translated")) {
          localStorage.setItem("zotero-bib-translated", "true");
          displayFirstCitationMessage();
        }
      }
    },
    [displayFirstCitationMessage],
  );

  const handleOverride = useCallback(() => {
    const localBib = new ZoteroBib(config);
    localBib.clearItems();

    bib.current = new ZoteroBib({
      ...config,
      initialItems: bib.current.itemsRaw,
    });

    localStorage.setItem("schroeder-cite-citation-style", state.selected);
    localStorage.setItem(
      "schroeder-cite-extra-citation-styles",
      JSON.stringify(citationStyles.filter((cs) => !cs.isCore)),
    );
    localStorage.setItem("schroeder-cite-title", title);

    isHydrated.current = false;

    citeproc.current.recreateEngine({ formatOptions: { linkAnchors: false } });
    history.replaceState(null, null, "/");
    dispatch({ type: BIBLIOGRAPHY_SOURCE_REPLACED });
  }, [state.selected, citationStyles, config, title]);

  const handleCancelPrintMode = useCallback(() => {
    setIsPrintMode(false);
  }, []);

  const handleReadMoreClick = useCallback((event) => {
    const target = document.querySelector(".zbib-illustration");
    new SmoothScroll().animateScroll(target, event.currentTarget, {
      header: ".message",
      offset: calcOffset(),
      speed: 1000,
      speedAsDuration: true,
    });
    dispatch({ type: CLEAR_MESSAGE, kind: "WELCOME_MESSAGE" });
  }, []);

  const handleShowDuplicate = useCallback((event) => {
    if (duplicate.current) {
      setActiveDialog(null);
      const target = document.querySelector(
        `[data-key="${duplicate.current.key}"]`,
      );
      new SmoothScroll().animateScroll(target, event.currentTarget, {
        header: ".message",
        offset: calcOffset(),
        speed: 1000,
        speedAsDuration: true,
      });
      duplicate.current = null;
    }
    dispatch({ type: CLEAR_MESSAGE, kind: "DUPLICATE" });
  }, []);

  const handleStyleInstallerCancel = () => {
    setActiveDialog(null);
  };

  const handleReviewDelete = useCallback(() => {
    handleDeleteEntry(itemUnderReview.item.key);
  }, [handleDeleteEntry, itemUnderReview]);

  const handleReviewDismiss = useCallback(() => {
    setItemUnderReview(null);
  }, []);

  const handleReviewEdit = useCallback(() => {
    handleOpenEditor(itemUnderReview.item.key);
  }, [handleOpenEditor, itemUnderReview]);

  const handleSave = useCallback(async () => {
    try {
      const key = await saveToPermalink(config.storeURL, {
        title: title,
        citationStyle: state.selected,
        items: bib.current.itemsRaw,
      });
      setPermalink(`${window.location.origin}/${key}`);
    } catch (e) {
      setPermalink(null);
      window.history.pushState(null, null, "/");
      handleError("Failed to upload bibliography", e);
    }
  }, [state.selected, config, handleError, title]);

  const handleScroll = useCallback(() => {
    if (!state.messages.find((m) => m.kind === "WELCOME_MESSAGE")) {
      return;
    }
    const target = document.querySelector(".zbib-illustration");
    const isScrolledToIllustration = window.pageYOffset > target.offsetTop;
    if (isScrolledToIllustration) {
      dispatch({ type: CLEAR_MESSAGE, kind: "WELCOME_MESSAGE " });
    }
  }, [state.messages]);

  const handleKeyDown = useCallback((ev) => {
    if (ev.key === "Escape" && ev.target.tagName !== "INPUT") {
      dispatch({ type: CLEAR_ALL_MESSAGES });
    }
  }, []);

  const handleStyleInstallerDelete = useCallback(
    (deleteStyleName) => {
      const newCitationStyles = citationStyles.filter(
        (cs) => cs.name !== deleteStyleName,
      );
      setCitationStyles(newCitationStyles);
      localStorage.setItem(
        "schroeder-cite-extra-citation-styles",
        JSON.stringify(newCitationStyles.filter((cs) => !cs.isCore)),
      );
    },
    [citationStyles],
  );

  const handleStyleInstallerSelect = useCallback(
    (newStyleMeta) => {
      const newCitationStyles = getExpandedCitationStyles(
        citationStyles,
        newStyleMeta,
      );
      setCitationStyles(newCitationStyles);

      fetchAndSelectStyle(dispatch, newStyleMeta.name);
      localStorage.setItem(
        "schroeder-cite-extra-citation-styles",
        JSON.stringify(newCitationStyles.filter((cs) => !cs.isCore)),
      );
      localStorage.setItem("schroeder-cite-citation-style", newStyleMeta.name);
    },
    [citationStyles],
  );

  const handleStyleSwitchConfirm = useCallback(() => {
    const processedItems = processSentenceCaseAPAItems(
      bib.current.itemsRaw,
      state.meta.baseMappings,
    );
    for (const [index, item] of processedItems.entries()) {
      bib.current.updateItem(index, item);
    }
    confirmStyle(dispatch);
    setActiveDialog(null);
    revertCitationStyle.current = null;
  }, [state.meta.baseMappings]);

  const handleStyleSwitchCancel = useCallback(() => {
    if (revertCitationStyle.current) {
      fetchAndSelectStyle(dispatch, revertCitationStyle.current, {
        isConfirmed: true,
      });
      localStorage.setItem(
        "schroeder-cite-citation-style",
        revertCitationStyle.current,
      );
    }
    setActiveDialog(null);
    revertCitationStyle.current = null;
  }, []);

  const handleTitleChange = useCallback((title) => {
    dispatch({ type: CLEAR_ALL_MESSAGES });
    setItemUnderReview(null);
    setPermalink(null);
    setTitle(title);
  }, []);

  const handleTranslateIdentifier = useCallback(
    async (
      identifier,
      multipleSelectedItems = null,
      shouldConfirm = false,
      shouldImport = false,
      shouldUseIncomingStyle = false,
    ) => {
      if (!shouldImport) {
        identifier = parseIdentifier(identifier);
      }

      dispatch({ type: CLEAR_ALL_MESSAGES });
      setIdentifier(identifier);
      setIsTranslating(true);
      setItemUnderReview(null);
      setPermalink(null);

      const opts = { add: false };

      if (typeof AbortController === "function") {
        abortController.current = new AbortController();
        opts.init = { signal: abortController.current.signal };
      }

      let isUrl =
        !!multipleSelectedItems || (!shouldImport && isLikeUrl(identifier));
      if (identifier || isUrl) {
        try {
          var translationResponse;
          if (isUrl) {
            let url = validateUrl(identifier);
            if (url) {
              setIdentifier(url);
            }
            if (multipleSelectedItems) {
              translationResponse = await bib.current.translateUrlItems(
                url,
                multipleSelectedItems,
                opts,
              );
            } else {
              translationResponse = await bib.current.translateUrl(url, opts);
            }
          } else if (shouldImport) {
            translationResponse = await bib.current.translateImport(
              identifier,
              opts,
            );
          } else {
            translationResponse = await bib.current.translateIdentifier(
              identifier,
              opts,
            );
          }

          dispatch({
            type: TRANSLATION_RECEIVED,
            translationResponse,
            identifier,
            shouldConfirm,
            shouldImport,
            shouldUseIncomingStyle,
            isUrl,
          });
        } catch (e) {
          if (
            e instanceof DOMException &&
            e.message === "The user aborted a request."
          ) {
            return;
          }
          handleError("An error occurred while citing this source.", e);
          setIsTranslating(false);
        }
      } else {
        handleError(
          "Value entered doesn’t appear to be a valid URL or identifier",
        );
        setIsTranslating(false);
      }
    },
    [handleError],
  );

  const processTranslation = useCallback(async () => {
    const {
      shouldUseIncomingStyle,
      shouldConfirm,
      translationResponse,
      isUrl,
    } = state.translation;
    const { xml, styleHasBibliography } = shouldUseIncomingStyle
      ? state.incomingStyle
      : state;

    switch (translationResponse.result) {
      case ZoteroBib.COMPLETE:
        if (translationResponse.items.length === 0) {
          dispatch({
            type: POST_MESSAGE,
            message: {
              id: getNextMessageId(),
              kind: "INFO",
              message: "No results found",
            },
          });
          setIsTranslating(false);
          return;
        }
        var rootItems = translationResponse.items.filter(
          (item) => !item.parentItem,
        );
        rootItems.forEach((item) =>
          validateItem(
            item,
            state.meta.itemTypeFields?.[item?.itemType],
            state.meta.itemTypeCreatorTypes?.[item?.itemType],
          ),
        );

        if (rootItems.length > 1) {
          const multipleItems = {
            items: rootItems,
            ...(await getOneTimeBibliographyOrFallback(
              getItemsCSL(rootItems),
              state.xml,
              state.styleHasBibliography,
              useLegacy.current,
            )),
          };

          setIdentifier("");
          setIsTranslating(false);
          setActiveDialog("MULTIPLE_ITEMS_DIALOG");
          setMultipleItems(multipleItems);
          return;
        }

        if (shouldConfirm) {
          const itemToConfirm = {
            item: translationResponse.items[0],
          };
          itemToConfirm.inCurrentStyle = await getOneTimeBibliographyOrFallback(
            getItemsCSL([translationResponse.items[0]]),
            state.xml,
            state.styleHasBibliography,
            useLegacy.current,
          );

          if (
            state.incomingStyle.name !== state.selected &&
            state.incomingStyle.xml
          ) {
            itemToConfirm.inIncomingStyle =
              await getOneTimeBibliographyOrFallback(
                getItemsCSL([translationResponse.items[0]]),
                state.incomingStyle.xml,
                state.incomingStyle.styleHasBibliography,
                useLegacy.current,
              );
          }

          setIdentifier("");
          setIsTranslating(false);
          setActiveDialog("CONFIRM_ADD_DIALOG");
          setItemToConfirm(itemToConfirm);
          return;
        }

        addItem(translationResponse.items[0]);
        setIdentifier("");
        setIsTranslating(false);
        dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
        setItemUnderReview({
          item: translationResponse.items[0],
          ...(await getOneTimeBibliographyOrFallback(
            getItemsCSL([translationResponse.items[0]]),
            xml,
            styleHasBibliography,
            useLegacy.current,
          )),
        });

        break;
      case ZoteroBib.MULTIPLE_CHOICES:
        setIsTranslating(false);
        setActiveDialog("MULTIPLE_CHOICE_DIALOG");
        setMoreItemsLink(translationResponse.next);
        setMultipleChoiceItems(
          dedupMultipleChoiceItems(
            await processMultipleChoiceItems(
              translationResponse.items,
              state.meta.itemTypes,
              isUrl,
            ),
          ),
        );
        break;
      case ZoteroBib.FAILED:
        handleError("An error occurred while citing this source.");
        setIsTranslating(false);
        break;
    }
  }, [addItem, handleError, state]);

  const handleTranslationCancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setIsTranslating(false);
    }
  }, []);

  const handleMultipleChoiceSelect = useCallback(
    async (selectedItem) => {
      setActiveDialog(null);
      setMultipleChoiceItems(null);

      if (selectedItem.source === "url") {
        return await handleTranslateIdentifier(identifier, {
          [selectedItem.key]: selectedItem.value.title,
        });
      } else {
        return await handleTranslateIdentifier(selectedItem.key);
      }
    },
    [handleTranslateIdentifier, identifier],
  );

  const handleUndoDelete = useCallback(() => {
    if (lastDeletedItem.current) {
      const { item, index } = lastDeletedItem.current;
      addItem(item, false, index);
      dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
      dispatch({ type: CLEAR_MESSAGE, kind: "UNDO_DELETE" });
      lastDeletedItem.current = null;
    }
  }, [addItem]);

  const handleVisibilityChange = useCallback(() => {
    if (!isReadOnly && document.visibilityState === "visible") {
      const storageCitationStyle = localStorage.getItem(
        "schroeder-cite-citation-style",
      );
      bib.current.reloadItems();
      citeproc.current.resetReferences(
        ensureNoBlankItems(bib.current.itemsCSL),
      );
      if (!storageCitationStyle || storageCitationStyle === state.selected) {
        dispatch({ type: BIBLIOGRAPHY_SOURCE_CHANGED });
      } else {
        fetchAndSelectStyle(dispatch, storageCitationStyle);
      }
    }
  }, [state.selected, isReadOnly]);

  const handleBeforePrint = useCallback(() => {
    setIsPrintMode(true);
  }, []);

  const handleAfterPrint = useCallback(() => {
    setIsPrintMode(false);
  }, []);

  const handleSaveToZoteroShow = useCallback(() => {
    setActiveDialog("SAVE_TO_ZOTERO");
  }, []);

  const handleSaveToZoteroHide = useCallback(() => {
    setActiveDialog(null);
  }, []);

  useEffect(() => {
    if (state.translation && isReady) {
      processTranslation();
      dispatch({ type: TRANSLATION_PROCESSED });
    }
  }, [processTranslation, state.translation, isReady]);

  useEffect(() => {
    if (!state.isCiteprocReady || !copyCitationState.citationKey) {
      return;
    }

    setTimeout(async () => {
      const cites = [
        { id: copyCitationState.citationKey, ...copyCitationState.modifiers },
      ];
      const positions = [{}];
      const inTextHtml = citeproc.current.previewCitationCluster(
        cites,
        positions,
        "html",
      );
      const inTextPlain = citeproc.current.previewCitationCluster(
        cites,
        positions,
        "plain",
      );

      setCopyCitationState((state) => ({ ...state, inTextHtml, inTextPlain }));
    }, 0);
  }, [
    copyCitationState.citationKey,
    copyCitationState.modifiers,
    getCopyData,
    state.bibliography.lookup,
    state.isCiteprocReady,
  ]);

  useEffect(() => {
    if (
      state.bibliographyNeedsRebuild &&
      isStyleReady &&
      state.isConfirmed &&
      isDataReady &&
      state.isSchemaReady
    ) {
      buildBibliography();
      setPermalink(null);
    }
  }, [
    buildBibliography,
    state.bibliographyNeedsRebuild,
    isStyleReady,
    state.isConfirmed,
    isDataReady,
    state.isSchemaReady,
  ]);

  useEffect(() => {
    if (typeof wasDataReady !== "undefined" && isDataReady !== wasDataReady) {
      dispatch({ type: BIBLIOGRAPHY_SOURCE_REPLACED });
    }
  }, [isDataReady, wasDataReady]);

  useEffect(() => {
    if (state.bibliographyNeedsRefresh) {
      updateBibliography();
      setPermalink(null);
    }
  }, [updateBibliography, state.bibliographyNeedsRefresh]);

  useEffect(() => {
    if (
      typeof prevCitationStyle !== "undefined" &&
      state.selected !== prevCitationStyle
    ) {
      revertCitationStyle.current = prevCitationStyle;
    }
  }, [state.selected, prevCitationStyle]);

  useEffect(() => {
    if (state.isConfirmed === false) {
      setActiveDialog("CONFIRM_SENTENCE_CASE_STYLE");
    }
  }, [state.isConfirmed, state.isSentenceCaseStyle, wasSentenceCaseStyle]);

  useEffect(() => {
    if (
      !remoteId &&
      !isReadOnly &&
      !localStorage.getItem("schroeder-cite-visited")
    ) {
      localStorage.setItem("schroeder-cite-visited", "true");
      displayWelcomeMessage();
    }
  }, [displayWelcomeMessage, isReadOnly, remoteId]);

  useEffect(() => {
    if (
      title !== prevTitle &&
      typeof prevTitle !== "undefined" &&
      !isReadOnly
    ) {
      localStorage.setItem("schroeder-cite-title", title);
    }
  }, [isReadOnly, title, prevTitle]);

  useEffect(() => {
    if (
      isDataReady &&
      isStyleReady &&
      isIncomingStyleReady &&
      state.isCiteprocReady &&
      !isQueryHandled &&
      window.location.pathname === "/import"
    ) {
      window.history.replaceState(null, null, "/");
      setIsQueryHandled(true);
      const shouldConfirm = state.bibliography.items.length > 0;
      (async () => {
        if (!shouldConfirm) {
          await fetchAndSelectStyle(dispatch, state.incomingStyle.name, {
            isConfirmed: true,
            store: true,
          });
        }
        await handleTranslateIdentifier(
          identifier,
          null,
          shouldConfirm,
          false,
          !shouldConfirm,
        );
      })();
    }
  }, [
    handleTranslateIdentifier,
    identifier,
    state.isCiteprocReady,
    isDataReady,
    isStyleReady,
    isQueryHandled,
    isIncomingStyleReady,
    state.bibliography,
    state.incomingStyle,
  ]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => document.removeEventListener("beforeprint", handleBeforePrint);
  }, [handleBeforePrint]);

  useEffect(() => {
    window.addEventListener("afterprint", handleAfterPrint);
    return () => document.removeEventListener("afterprint", handleAfterPrint);
  }, [handleAfterPrint]);

  useEffect(() => {
    if (
      state.incomingStyle?.name !== prevIncomingStyleName &&
      state.incomingStyle?.name !== state.selected
    ) {
      installCitationStyle(state.incomingStyle.name);
    }
  }, [
    state.incomingStyle,
    state.selected,
    prevIncomingStyleName,
    installCitationStyle,
  ]);

  useEffect(() => {
    document.addEventListener("copy", handleCopyToClipboard, true);

    const params = new URLSearchParams(location.search);
    //citeproc-rs is opt-in, i.e. if truthy then useLegacy = false, defaults to true
    useLegacy.current =
      !params.get("use_experimental_citeproc") ||
      ["false", "0"].includes(params.get("use_experimental_citeproc"));

    if (remoteId) {
      configureZoteroSchema(dispatch, intl, config.apiAuthorityPart);
      fetchRemoteBibliography();
    } else {
      const prefilledIdentifier = params.get("q") || "";
      const incomingCitationStyle = params.get("style") || "";
      const localCitationStyle =
        localStorage.getItem("schroeder-cite-citation-style") ||
        coreCitationStyles.find((cs) => cs.isDefault).name;

      setIdentifier(prefilledIdentifier);
      setIsDataReady(true);
      configureZoteroSchema(dispatch, intl, config.apiAuthorityPart);
      fetchAndSelectStyle(dispatch, localCitationStyle, { isConfirmed: true });
      // for arrivals via /import we display incoming citation in current and incoming citation styles
      if (!isQueryHandled && incomingCitationStyle) {
        maybeFetchIncomingStyle(
          dispatch,
          incomingCitationStyle,
          incomingCitationStyle === localCitationStyle,
        );
      }
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.classList.toggle("keyboard", keyboard);
  }, [keyboard]);

  useEffect(() => {
    document.documentElement.classList.toggle("mouse", mouse);
  }, [mouse]);

  useEffect(() => {
    document.documentElement.classList.toggle("touch", touch);
  }, [touch]);

  return (
    <ZBib
      getCopyData={getCopyData}
      bibliography={state.bibliography}
      bibliographyRendered={bibliographyRendered}
      bibliographyRenderedNodes={bibliographyRenderedNodes}
      copyCitationState={copyCitationState}
      copySingleState={copySingleState}
      citationStyle={state.selected}
      citationStyles={citationStyles}
      editorItem={editorItem}
      hydrateItemsCount={hydrateItemsCount}
      identifier={identifier}
      incomingStyle={state.incomingStyle}
      selectedStyle={state.selectedStyle}
      isNoteStyle={state.isNoteStyle}
      isNumericStyle={state.isNumericStyle}
      isReadOnly={isReadOnly}
      isHydrated={isHydrated.current}
      isReady={isReady}
      isPrintMode={isPrintMode}
      isSafari={isSafari}
      isSortedStyle={state.isSortedStyle}
      isStylesDataLoading={isStylesDataLoading}
      isTranslating={isTranslating}
      isTranslatingMore={isTranslatingMore}
      itemToConfirm={itemToConfirm}
      itemUnderReview={itemUnderReview}
      localCitationsCount={localCitationsCount}
      messages={state.messages}
      meta={state.meta}
      moreItemsLink={moreItemsLink}
      multipleChoiceItems={multipleChoiceItems}
      multipleItems={multipleItems}
      activeDialog={activeDialog}
      onCitationCopyDialogOpen={handleCitationCopyDialogOpen}
      onCitationCopy={handleCitationCopy}
      onCitationCopyDialogClose={handleCitationCopyDialogClose}
      onCitationModifierChange={handleCitationModifierChange}
      onCopySingle={handleCopySingle}
      onConfirmAddCancel={handleConfirmAddCancel}
      onConfirmAddConfirm={handleConfirmAddConfirm}
      onDeleteCitations={handleDeleteCitations}
      onDeleteEntry={handleDeleteEntry}
      onDismiss={handleDismiss}
      onDownloadFile={handleDownloadFile}
      onEditorClose={handleCloseEditor}
      onEditorOpen={handleOpenEditor}
      onError={handleError}
      onGetStartedClick={handleGetStartedClick}
      onItemCreated={handleItemCreated}
      onItemUpdate={handleItemUpdate}
      onMultipleChoiceCancel={handleMultipleChoiceCancel}
      onMultipleChoiceMore={handleMultipleChoiceMore}
      onMultipleChoiceSelect={handleMultipleChoiceSelect}
      onMultipleItemsCancel={handleMultipleItemsCancel}
      onMultipleItemsSelect={handleMultipleItemsSelect}
      onReorderCitations={handleReorderCitations}
      onReviewDelete={handleReviewDelete}
      onReviewDismiss={handleReviewDismiss}
      onReviewEdit={handleReviewEdit}
      onSave={handleSave}
      onShowDuplicate={handleShowDuplicate}
      onStyleInstallerCancel={handleStyleInstallerCancel}
      onStyleInstallerDelete={handleStyleInstallerDelete}
      onStyleInstallerSelect={handleStyleInstallerSelect}
      onTitleChanged={handleTitleChange}
      onHelpClick={handleHelpClick}
      onAboutClick={handleAboutClick}
      onExamplesClick={handleExamplesClick}
      onCancelPrintMode={handleCancelPrintMode}
      onReadMore={handleReadMoreClick}
      onStyleSwitchCancel={handleStyleSwitchCancel}
      onStyleSwitchConfirm={handleStyleSwitchConfirm}
      onTranslationCancel={handleTranslationCancel}
      onTranslationRequest={handleTranslateIdentifier}
      onCitationStyleChanged={handleCitationStyleChanged}
      onOverride={handleOverride}
      onUndoDelete={handleUndoDelete}
      onSaveToZoteroShow={handleSaveToZoteroShow}
      onSaveToZoteroHide={handleSaveToZoteroHide}
      permalink={permalink}
      stylesData={stylesData}
      styleHasBibliography={state.styleHasBibliography}
      title={title}
    />
  );
};

BibWebContainer.propTypes = {
  config: PropTypes.object,
  hydrateItemsCount: PropTypes.number,
  title: PropTypes.string,
};

export default memo(BibWebContainer);
