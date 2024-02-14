/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type KeyProps, type RefProps, type SlotProps } from '@dark-engine/core';
import { type EventHandler } from './events';
import { type CSSProperties } from './dom';

export declare namespace DarkJSX {
  type KeyAttributes = KeyProps;

  type RefAttributes<T> = RefProps<T>;

  type SlotAttributes = SlotProps;

  type Booleanish = boolean | 'true' | 'false';

  type CrossOrigin = 'anonymous' | 'use-credentials' | '';

  type HTMLAttributeReferrerPolicy =
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

  type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top';

  type HTMLInputTypeAttribute =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';

  type AriaRole =
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'button'
    | 'cell'
    | 'checkbox'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'feed'
    | 'figure'
    | 'form'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem';

  interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant': string;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic': Booleanish;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    /**
     * Defines a string value that labels the current element, which is intended to be converted into Braille.
     * @see aria-label.
     */
    'aria-braillelabel': string;
    /**
     * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
     * @see aria-roledescription.
     */
    'aria-brailleroledescription': string;
    'aria-busy': Booleanish;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked': boolean | 'false' | 'mixed' | 'true';
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount': number;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex': number;
    /**
     * Defines a human readable text alternative of aria-colindex.
     * @see aria-rowindextext.
     */
    'aria-colindextext': string;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan': number;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls': string;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current': boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    'aria-describedby': string;
    /**
     * Defines a string value that describes or annotates the current element.
     * @see related aria-describedby.
     */
    'aria-description': string;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    'aria-details': string;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    'aria-disabled': Booleanish;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    'aria-dropeffect': 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    'aria-errormessage': string;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded': Booleanish;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto': string;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed': Booleanish;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup': boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden': Booleanish;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid': boolean | 'false' | 'true' | 'grammar' | 'spelling';
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    'aria-keyshortcuts': string;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    'aria-label': string;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    'aria-labelledby': string;
    /** Defines the hierarchical level of an element within a structure. */
    'aria-level': number;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live': 'off' | 'assertive' | 'polite';
    /** Indicates whether an element is modal when displayed. */
    'aria-modal': Booleanish;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline': Booleanish;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable': Booleanish;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    'aria-orientation': 'horizontal' | 'vertical';
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    'aria-owns': string;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    'aria-placeholder': string;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    'aria-posinset': number;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed': boolean | 'false' | 'mixed' | 'true';
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly': Booleanish;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant':
      | 'additions'
      | 'additions removals'
      | 'additions text'
      | 'all'
      | 'removals'
      | 'removals additions'
      | 'removals text'
      | 'text'
      | 'text additions'
      | 'text removals';
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required': Booleanish;
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription': string;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount': number;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex': number;
    /**
     * Defines a human readable text alternative of aria-rowindex.
     * @see aria-colindextext.
     */
    'aria-rowindextext': string;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan': number;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected': Booleanish;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize': number;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort': 'none' | 'ascending' | 'descending' | 'other';
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax': number;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin': number;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow': number;
    'aria-valuetext': string;
  }

  type HTMLAttributes = {
    accesskey: string;
    autofocus: boolean;
    class: string;
    className: string;
    contenteditable: Booleanish | 'inherit' | 'plaintext-only';
    contextmenu: string;
    dir: string;
    draggable: Booleanish;
    hidden: boolean;
    id: string;
    lang: string;
    nonce: string;
    spellcheck: Booleanish;
    style: string | CSSProperties;
    tabindex: number;
    title: string;
    translate: 'yes' | 'no';
    radioGroup: string;
    role: AriaRole;
    about: string;
    content: string;
    datatype: string;
    inlist: any;
    prefix: string;
    property: string;
    rel: string;
    resource: string;
    rev: string;
    typeof: string;
    vocab: string;
    autocapitalize: string;
    autocorrect: string;
    autosave: string;
    color: string;
    itemprop: string;
    itemscope: boolean;
    itemtype: string;
    itemid: string;
    itemref: string;
    results: number;
    security: string;
    unselectable: 'on' | 'off';
    is: string;
  };

  type EventHandlers<T> = {
    onCopy: EventHandler<ClipboardEvent, T>;
    onCut: EventHandler<ClipboardEvent, T>;
    onPaste: EventHandler<ClipboardEvent, T>;
    onCompositionEnd: EventHandler<CompositionEvent, T>;
    onCompositionStart: EventHandler<CompositionEvent, T>;
    onCompositionUpdate: EventHandler<CompositionEvent, T>;
    onFocus: EventHandler<FocusEvent, T>;
    onBlur: EventHandler<FocusEvent, T>;
    onChange: EventHandler<InputEvent, T>;
    onBeforeInput: EventHandler<InputEvent, T>;
    onInput: EventHandler<InputEvent, T>;
    onReset: EventHandler<InputEvent, T>;
    onSubmit: EventHandler<InputEvent, T>;
    onInvalid: EventHandler<InputEvent, T>;
    onLoad: EventHandler<Event, T>;
    onError: EventHandler<Event, T>;
    onKeyDown: EventHandler<KeyboardEvent, T>;
    onKeyUp: EventHandler<KeyboardEvent, T>;
    onAbort: EventHandler<Event, T>;
    onCanPlay: EventHandler<Event, T>;
    onCanPlayThrough: EventHandler<Event, T>;
    onDurationChange: EventHandler<Event, T>;
    onEmptied: EventHandler<Event, T>;
    onEncrypted: EventHandler<Event, T>;
    onEnded: EventHandler<Event, T>;
    onLoadedData: EventHandler<Event, T>;
    onLoadedMetadata: EventHandler<Event, T>;
    onLoadStart: EventHandler<Event, T>;
    onPause: EventHandler<Event, T>;
    onPlay: EventHandler<Event, T>;
    onPlaying: EventHandler<Event, T>;
    onProgress: EventHandler<Event, T>;
    onRateChange: EventHandler<Event, T>;
    onResize: EventHandler<Event, T>;
    onSeeked: EventHandler<Event, T>;
    onSeeking: EventHandler<Event, T>;
    onStalled: EventHandler<Event, T>;
    onSuspend: EventHandler<Event, T>;
    onTimeUpdate: EventHandler<Event, T>;
    onVolumeChange: EventHandler<Event, T>;
    onWaiting: EventHandler<Event, T>;
    onAuxClick: EventHandler<MouseEvent, T>;
    onClick: EventHandler<MouseEvent, T>;
    onContextMenu: EventHandler<MouseEvent, T>;
    onDoubleClick: EventHandler<MouseEvent, T>;
    onDrag: EventHandler<DragEvent, T>;
    onDragEnd: EventHandler<DragEvent, T>;
    onDragEnter: EventHandler<DragEvent, T>;
    onDragExit: EventHandler<DragEvent, T>;
    onDragLeave: EventHandler<DragEvent, T>;
    onDragOver: EventHandler<DragEvent, T>;
    onDragStart: EventHandler<DragEvent, T>;
    onDrop: EventHandler<DragEvent, T>;
    onMouseDown: EventHandler<MouseEvent, T>;
    onMouseEnter: EventHandler<MouseEvent, T>;
    onMouseLeave: EventHandler<MouseEvent, T>;
    onMouseMove: EventHandler<MouseEvent, T>;
    onMouseOut: EventHandler<MouseEvent, T>;
    onMouseOver: EventHandler<MouseEvent, T>;
    onMouseUp: EventHandler<MouseEvent, T>;
    onSelect: EventHandler<Event, T>;
    onTouchCancel: EventHandler<TouchEvent, T>;
    onTouchEnd: EventHandler<TouchEvent, T>;
    onTouchMove: EventHandler<TouchEvent, T>;
    onTouchStart: EventHandler<TouchEvent, T>;
    onPointerDown: EventHandler<PointerEvent, T>;
    onPointerMove: EventHandler<PointerEvent, T>;
    onPointerUp: EventHandler<PointerEvent, T>;
    onPointerCancel: EventHandler<PointerEvent, T>;
    onPointerEnter: EventHandler<PointerEvent, T>;
    onPointerLeave: EventHandler<PointerEvent, T>;
    onPointerOver: EventHandler<PointerEvent, T>;
    onPointerOut: EventHandler<PointerEvent, T>;
    onScroll: EventHandler<UIEvent, T>;
    onWheel: EventHandler<WheelEvent, T>;
    onAnimationStart: EventHandler<AnimationEvent, T>;
    onAnimationEnd: EventHandler<AnimationEvent, T>;
    onAnimationIteration: EventHandler<AnimationEvent, T>;
    onAnimationCancel: EventHandler<AnimationEvent, T>;
    onTransitioStart: EventHandler<TransitionEvent, T>;
    onTransitionEnd: EventHandler<TransitionEvent, T>;
    onTransitionCancel: EventHandler<TransitionEvent, T>;
  };

  type HTMLAnchorProps<T> = {
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    target?: HTMLAttributeAnchorTarget;
    type?: string;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
  } & HTMLProps<T>;

  type HTMLAudioProps<T> = HTMLMediaProps<T>;

  type HTMLAreaProps<T> = {
    alt?: string;
    coords?: string;
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    shape?: string;
    target?: string;
  } & HTMLProps<T>;

  type HTMLBaseProps<T> = {
    href?: string;
    target?: string;
  } & HTMLProps<T>;

  type HTMLBlockquoteProps<T> = {
    cite?: string;
  } & HTMLProps<T>;

  type HTMLButtonProps<T> = {
    disabled?: boolean;
    form?: string;
    formaction?: string;
    formenctype?: string;
    formmethod?: string;
    formnovalidate?: boolean;
    formtarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLCanvasProps<T> = {
    height?: number | string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLColProps<T> = {
    span?: number;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLColgroupProps<T> = {
    span?: number;
  } & HTMLProps<T>;

  type HTMLDataProps<T> = {
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLDetailsProps<T> = {
    open?: boolean;
    onToggle?: EventHandler<Event, T>;
    name?: string;
  } & HTMLProps<T>;

  type HTMLDelProps<T> = {
    cite?: string;
    dateTime?: string;
  } & HTMLProps<T>;

  type HTMLDialogProps<T> = {
    onCancel?: EventHandler<Event, T>;
    onClose?: EventHandler<Event, T>;
    open?: boolean;
  } & HTMLProps<T>;

  type HTMLEmbedProps<T> = {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLFieldsetProps<T> = {
    disabled?: boolean;
    form?: string;
    name?: string;
  } & HTMLProps<T>;

  type HTMLFormProps<T> = {
    acceptcharset?: string;
    action?: string;
    autocomplete?: string;
    enctype?: string;
    method?: string;
    name?: string;
    novalidate?: boolean;
    target?: string;
  } & HTMLProps<T>;

  type HTMLHtmlProps<T> = {
    manifest?: string;
  } & HTMLProps<T>;

  type HTMLIframeProps<T> = {
    allow?: string;
    allowfullscreen?: boolean;
    allowtransparency?: boolean;
    frameborder?: number | string;
    height?: number | string;
    loading?: 'eager' | 'lazy';
    marginheight?: number;
    marginwidth?: number;
    name?: string;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    src?: string;
    srcdoc?: string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLImgProps<T> = {
    alt?: string;
    crossorigin?: CrossOrigin;
    decoding?: 'async' | 'auto' | 'sync';
    height?: number | string;
    loading?: 'eager' | 'lazy';
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    sizes?: string;
    src?: string;
    srcset?: string;
    usemap?: string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLInsProps<T> = {
    cite?: string;
    datetime?: string;
  } & HTMLProps<T>;

  type HTMLInputProps<T> = {
    accept?: string;
    alt?: string;
    autocomplete?: string;
    capture?: boolean | 'user' | 'environment';
    checked?: boolean;
    disabled?: boolean;
    enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    form?: string;
    formaction?: string;
    formenctype?: string;
    formmethod?: string;
    formnovalidate?: boolean;
    formtarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxlength?: number;
    min?: number | string;
    minlength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: HTMLInputTypeAttribute;
    value?: string | number | boolean;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLKeygenProps<T> = {
    challenge?: string;
    disabled?: boolean;
    form?: string;
    keytype?: string;
    keyparams?: string;
    name?: string;
  } & HTMLProps<T>;

  type HTMLLabelProps<T> = {
    form?: string;
    for?: string;
  } & HTMLProps<T>;

  type HTMLLiProps<T> = {
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLLinkProps<T> = {
    _as?: string;
    crossorigin?: CrossOrigin;
    fetchpriority?: 'high' | 'low' | 'auto';
    href?: string;
    hreflang?: string;
    integrity?: string;
    media?: string;
    imagesrcset?: string;
    imagesizes?: string;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    sizes?: string;
    type?: string;
    charset?: string;
  } & HTMLProps<T>;

  type HTMLMapProps<T> = {
    name?: string;
  } & HTMLProps<T>;

  type HTMLMenuProps<T> = {
    type?: string;
  } & HTMLProps<T>;

  type HTMLMediaProps<T> = {
    autoplay?: boolean;
    controls?: boolean;
    controlslist?: string;
    crossorigin?: CrossOrigin;
    loop?: boolean;
    mediagroup?: string;
    muted?: boolean;
    playsinline?: boolean;
    preload?: string;
    src?: string;
  } & HTMLProps<T>;

  type HTMLMetaProps<T> = {
    charSet?: string;
    httpequiv?: string;
    name?: string;
    media?: string;
    content?: string;
  } & HTMLProps<T>;

  type HTMLMeterProps<T> = {
    form?: string;
    high?: number;
    low?: number;
    max?: number | string;
    min?: number | string;
    optimum?: number;
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLQuoteProps<T> = {
    cite?: string;
  } & HTMLProps<T>;

  type HTMLObjectProps<T> = {
    classid?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    usemap?: string;
    width?: number | string;
    wmode?: string;
  } & HTMLProps<T>;

  type HTMLOlProps<T> = {
    reversed?: boolean;
    start?: number;
    type?: '1' | 'a' | 'A' | 'i' | 'I';
  } & HTMLProps<T>;

  type HTMLOptgroupProps<T> = {
    disabled?: boolean;
    label?: string;
  } & HTMLProps<T>;

  type HTMLOptionProps<T> = {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLOutputProps<T> = {
    form?: string;
    for?: string;
    name?: string;
  } & HTMLProps<T>;

  type HTMLParamProps<T> = {
    name?: string;
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLProgressProps<T> = {
    max?: number | string;
    value?: string | number;
  } & HTMLProps<T>;

  type HTMLSlotProps<T> = {
    name?: string;
  } & HTMLProps<T>;

  type HTMLScriptProps<T> = {
    async?: boolean;
    charset?: string;
    crossorigin?: CrossOrigin;
    defer?: boolean;
    integrity?: string;
    nomodule?: boolean;
    referrerpolicy?: HTMLAttributeReferrerPolicy;
    src?: string;
    type?: string;
  } & HTMLProps<T>;

  type HTMLSelectProps<T> = {
    autocomplete?: string;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | number;
    onChange?: EventHandler<InputEvent, T>;
  } & HTMLProps<T>;

  type HTMLSourceProps<T> = {
    height?: number | string;
    media?: string;
    sizes?: string;
    src?: string;
    srcset?: string;
    type?: string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLStyleProps<T> = {
    media?: string;
    scoped?: boolean;
    type?: string;
  } & HTMLProps<T>;

  type HTMLTableProps<T> = {
    align?: 'left' | 'center' | 'right';
    bgcolor?: string;
    border?: number;
    cellpadding?: number | string;
    cellspacing?: number | string;
    frame?: boolean;
    rules?: 'none' | 'groups' | 'rows' | 'columns' | 'all';
    summary?: string;
    width?: number | string;
  } & HTMLProps<T>;

  type HTMLTextareaProps<T> = {
    autocomplete?: string;
    cols?: number;
    dirname?: string;
    disabled?: boolean;
    form?: string;
    maxlength?: number;
    minlength?: number;
    name?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | number;
    wrap?: string;
  } & HTMLProps<T>;

  type HTMLTdProps<T> = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char';
    colspan?: number;
    headers?: string;
    rowspan?: number;
    scope?: string;
    abbr?: string;
    height?: number | string;
    width?: number | string;
    valign?: 'top' | 'middle' | 'bottom' | 'baseline';
  } & HTMLProps<T>;

  type HTMLThProps<T> = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char';
    colspan?: number;
    headers?: string;
    rowspan?: number;
    scope?: string;
    abbr?: string;
  } & HTMLProps<T>;

  type HTMLTimeProps<T> = {
    datetime?: string;
  } & HTMLProps<T>;

  type HTMLTrackProps<T> = {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srclang?: string;
  } & HTMLProps<T>;

  type HTMLVideoProps<T> = {
    height?: number | string;
    playsinline?: boolean;
    poster?: string;
    width?: number | string;
    disablePictureInPicture?: boolean;
    disableRemotePlayback?: boolean;
  } & HTMLMediaProps<T>;

  type SVGAttributes = {
    class: string;
    className: string;
    color: string;
    height: number | string;
    id: string;
    lang: string;
    max: number | string;
    media: string;
    method: string;
    min: number | string;
    name: string;
    style: string | CSSProperties;
    target: string;
    type: string;
    width: number | string;
    role: AriaRole;
    tabindex: number;
    crossorigin: CrossOrigin;
    'accent-height': number | string;
    accumulate: 'none' | 'sum';
    additive: 'replace' | 'sum';
    'alignment-baseline':
      | 'auto'
      | 'baseline'
      | 'before-edge'
      | 'text-before-edge'
      | 'middle'
      | 'central'
      | 'after-edge'
      | 'text-after-edge'
      | 'ideographic'
      | 'alphabetic'
      | 'hanging'
      | 'mathematical'
      | 'inherit';
    alphabetic: number | string;
    amplitude: number | string;
    'arabic-form': 'initial' | 'medial' | 'terminal' | 'isolated';
    ascent: number | string;
    attributeName: string;
    attributeType: string;
    'auto-reverse': Booleanish;
    azimuth: number | string;
    baseFrequency: number | string;
    'baseline-shift': number | string;
    baseProfile: number | string;
    bbox: number | string;
    begin: number | string;
    bias: number | string;
    by: number | string;
    'calc-mode': number | string;
    'cap-height': number | string;
    clip: number | string;
    'clip-path': string;
    'clip-path-units': number | string;
    'clip-rule': number | string;
    'color-interpolation': number | string;
    'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
    'color-profile': number | string;
    'color-rendering': number | string;
    contentScriptType: number | string;
    contentStyleType: number | string;
    cursor: number | string;
    cx: number | string;
    cy: number | string;
    d: string;
    decelerate: number | string;
    descent: number | string;
    diffuseConstant: number | string;
    direction: number | string;
    display: number | string;
    divisor: number | string;
    'dominant-baseline': number | string;
    dur: number | string;
    dx: number | string;
    dy: number | string;
    edgeMode: number | string;
    elevation: number | string;
    'enable-background': number | string;
    end: number | string;
    exponent: number | string;
    externalResourcesRequired: Booleanish;
    fill: string;
    'fill-opacity': number | string;
    'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
    filter: string;
    'filter-res': number | string;
    'filter-units': number | string;
    'flood-color': number | string;
    'flood-opacity': number | string;
    focusable: Booleanish | 'auto';
    'font-family': string;
    'font-size': number | string;
    'font-size-adjust': number | string;
    'font-stretch': number | string;
    'font-style': number | string;
    'font-variant': number | string;
    'font-weight': number | string;
    format: number | string;
    fr: number | string;
    from: number | string;
    fx: number | string;
    fy: number | string;
    g1: number | string;
    g2: number | string;
    'glyph-name': number | string;
    'glyph-orientation-horizontal': number | string;
    'glyph-orientation-vertical': number | string;
    glyphRef: number | string;
    gradientTransform: string;
    gradientUnits: string;
    hanging: number | string;
    'horiz-adv-x': number | string;
    'horiz-origin-x': number | string;
    href: string;
    ideographic: number | string;
    'image-rendering': number | string;
    in2: number | string;
    in: string;
    intercept: number | string;
    k1: number | string;
    k2: number | string;
    k3: number | string;
    k4: number | string;
    k: number | string;
    kernelMatrix: number | string;
    kernelUnitLength: number | string;
    kerning: number | string;
    keyPoints: number | string;
    keySplines: number | string;
    keyTimes: number | string;
    lengthAdjust: number | string;
    'letter-spacing': number | string;
    'lighting-color': number | string;
    limitingConeAngle: number | string;
    local: number | string;
    'marker-end': string;
    'marker-height': number | string;
    'marker-mid': string;
    'marker-start': string;
    'marker-units': number | string;
    'marker-width': number | string;
    mask: string;
    maskContentUnits: number | string;
    maskUnits: number | string;
    mathematical: number | string;
    mode: number | string;
    numOctaves: number | string;
    offset: number | string;
    opacity: number | string;
    operator: number | string;
    order: number | string;
    orient: number | string;
    orientation: number | string;
    origin: number | string;
    overflow: number | string;
    'overline-position': number | string;
    'overline-thickness': number | string;
    'paint-order': number | string;
    'panose-1': number | string;
    path: string;
    pathLength: number | string;
    patternContentUnits: string;
    patternTransform: number | string;
    patternUnits: string;
    'pointer-events': number | string;
    points: string;
    pointsAtX: number | string;
    pointsAtY: number | string;
    pointsAtZ: number | string;
    preserveAlpha: Booleanish;
    preserveAspectRatio: string;
    primitiveUnits: number | string;
    r: number | string;
    radius: number | string;
    refX: number | string;
    refY: number | string;
    'rendering-intent': number | string;
    repeatCount: number | string;
    repeatDur: number | string;
    requiredExtensions: number | string;
    requiredFeatures: number | string;
    restart: number | string;
    result: string;
    rotate: number | string;
    rx: number | string;
    ry: number | string;
    scale: number | string;
    seed: number | string;
    'shape-rendering': number | string;
    slope: number | string;
    spacing: number | string;
    specularConstant: number | string;
    specularExponent: number | string;
    speed: number | string;
    spreadMethod: string;
    startOffset: number | string;
    stdDeviation: number | string;
    stemh: number | string;
    stemv: number | string;
    stitchTiles: number | string;
    'stop-color': string;
    'stop-opacity': number | string;
    'strikethrough-position': number | string;
    'strikethrough-thickness': number | string;
    string: number | string;
    stroke: string;
    'stroke-dasharray': string | number;
    'stroke-dashoffset': string | number;
    'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
    'stroke-linejoin': 'miter' | 'round' | 'bevel' | 'inherit';
    'stroke-miterlimit': number | string;
    'stroke-opacity': number | string;
    'stroke-width': number | string;
    surfaceScale: number | string;
    systemLanguage: number | string;
    tableValues: number | string;
    targetX: number | string;
    targetY: number | string;
    'text-anchor': string;
    'text-decoration': number | string;
    textLength: number | string;
    'text-rendering': number | string;
    to: number | string;
    transform: string;
    u1: number | string;
    u2: number | string;
    'underline-position': number | string;
    'underline-thickness': number | string;
    unicode: number | string;
    unicodeBidi: number | string;
    'unicode-range ': number | string;
    'units-per-em': number | string;
    'v-alphabetic': number | string;
    values: string;
    'vector-effect': number | string;
    version: string;
    vertAdvY: number | string;
    vertOriginX: number | string;
    vertOriginY: number | string;
    vIdeographic: number | string;
    viewBox: string;
    viewTarget: number | string;
    visibility: number | string;
    widths: number | string;
    'word-spacing': number | string;
    'writing-mode': number | string;
    x1: number | string;
    x2: number | string;
    x: number | string;
    xChannelSelector: string;
    xmlns: string;
    'x-height': number | string;
    y1: number | string;
    y2: number | string;
    y: number | string;
    yChannelSelector: string;
    z: number | string;
    zoomAndPan: string;
  };

  interface HTMLProps<T>
    extends Partial<
      KeyAttributes & RefAttributes<T> & SlotAttributes & HTMLAttributes & AriaAttributes & EventHandlers<T>
    > {}

  interface SVGProps<T>
    extends Partial<
      KeyAttributes & RefAttributes<T> & SlotAttributes & SVGAttributes & AriaAttributes & EventHandlers<T>
    > {}

  type NonStrictAttributes<T extends object> = {
    [K in keyof T]: { [n: string]: unknown } & T[K];
  };

  type HTMLTags = {
    a: HTMLAnchorProps<HTMLAnchorElement>;
    abbr: HTMLProps<HTMLElement>;
    address: HTMLProps<HTMLElement>;
    area: HTMLAreaProps<HTMLAreaElement>;
    article: HTMLProps<HTMLElement>;
    aside: HTMLProps<HTMLElement>;
    audio: HTMLAudioProps<HTMLAudioElement>;
    b: HTMLProps<HTMLElement>;
    base: HTMLBaseProps<HTMLBaseElement>;
    bdi: HTMLProps<HTMLElement>;
    bdo: HTMLProps<HTMLElement>;
    big: HTMLProps<HTMLElement>;
    blockquote: HTMLBlockquoteProps<HTMLQuoteElement>;
    body: HTMLProps<HTMLBodyElement>;
    br: HTMLProps<HTMLBRElement>;
    button: HTMLButtonProps<HTMLButtonElement>;
    canvas: HTMLCanvasProps<HTMLCanvasElement>;
    caption: HTMLProps<HTMLElement>;
    center: HTMLProps<HTMLElement>;
    cite: HTMLProps<HTMLElement>;
    code: HTMLProps<HTMLElement>;
    col: HTMLColProps<HTMLTableColElement>;
    colgroup: HTMLColgroupProps<HTMLTableColElement>;
    data: HTMLDataProps<HTMLDataElement>;
    datalist: HTMLProps<HTMLDataListElement>;
    dd: HTMLProps<HTMLElement>;
    del: HTMLDelProps<HTMLModElement>;
    details: HTMLDetailsProps<HTMLDetailsElement>;
    dfn: HTMLProps<HTMLElement>;
    dialog: HTMLDialogProps<HTMLDialogElement>;
    div: HTMLProps<HTMLDivElement>;
    dl: HTMLProps<HTMLDListElement>;
    dt: HTMLProps<HTMLDListElement>;
    em: HTMLProps<HTMLElement>;
    embed: HTMLEmbedProps<HTMLEmbedElement>;
    fieldset: HTMLFieldsetProps<HTMLFieldSetElement>;
    figcaption: HTMLProps<HTMLElement>;
    figure: HTMLProps<HTMLElement>;
    footer: HTMLProps<HTMLElement>;
    form: HTMLFormProps<HTMLFormElement>;
    h1: HTMLProps<HTMLHeadingElement>;
    h2: HTMLProps<HTMLHeadingElement>;
    h3: HTMLProps<HTMLHeadingElement>;
    h4: HTMLProps<HTMLHeadingElement>;
    h5: HTMLProps<HTMLHeadingElement>;
    h6: HTMLProps<HTMLHeadingElement>;
    head: HTMLProps<HTMLHeadElement>;
    header: HTMLProps<HTMLElement>;
    hgroup: HTMLProps<HTMLElement>;
    hr: HTMLProps<HTMLHRElement>;
    html: HTMLHtmlProps<HTMLHtmlElement>;
    i: HTMLProps<HTMLElement>;
    iframe: HTMLIframeProps<HTMLIFrameElement>;
    img: HTMLImgProps<HTMLImageElement>;
    input: HTMLInputProps<HTMLInputElement>;
    ins: HTMLInsProps<HTMLModElement>;
    kbd: HTMLProps<HTMLElement>;
    label: HTMLLabelProps<HTMLLabelElement>;
    legend: HTMLProps<HTMLLegendElement>;
    li: HTMLLiProps<HTMLLIElement>;
    link: HTMLLinkProps<HTMLLinkElement>;
    main: HTMLProps<HTMLElement>;
    map: HTMLMapProps<HTMLMapElement>;
    mark: HTMLProps<HTMLElement>;
    menu: HTMLMenuProps<HTMLElement>;
    meta: HTMLMetaProps<HTMLMetaElement>;
    meter: HTMLMeterProps<HTMLMeterElement>;
    nav: HTMLProps<HTMLElement>;
    noscript: HTMLProps<HTMLElement>;
    object: HTMLObjectProps<HTMLObjectElement>;
    ol: HTMLOlProps<HTMLOListElement>;
    optgroup: HTMLOptgroupProps<HTMLOptGroupElement>;
    option: HTMLOptionProps<HTMLOptionElement>;
    output: HTMLOutputProps<HTMLOutputElement>;
    p: HTMLProps<HTMLParagraphElement>;
    param: HTMLParamProps<HTMLParamElement>;
    picture: HTMLProps<HTMLElement>;
    pre: HTMLProps<HTMLPreElement>;
    progress: HTMLProgressProps<HTMLProgressElement>;
    q: HTMLQuoteProps<HTMLQuoteElement>;
    rp: HTMLProps<HTMLElement>;
    rt: HTMLProps<HTMLElement>;
    ruby: HTMLProps<HTMLElement>;
    s: HTMLProps<HTMLElement>;
    samp: HTMLProps<HTMLElement>;
    script: HTMLScriptProps<HTMLScriptElement>;
    section: HTMLProps<HTMLElement>;
    select: HTMLSelectProps<HTMLSelectElement>;
    small: HTMLProps<HTMLElement>;
    source: HTMLSourceProps<HTMLSourceElement>;
    span: HTMLProps<HTMLSpanElement>;
    strong: HTMLProps<HTMLElement>;
    style: HTMLStyleProps<HTMLStyleElement>;
    sub: HTMLProps<HTMLElement>;
    summary: HTMLProps<HTMLElement>;
    sup: HTMLProps<HTMLElement>;
    table: HTMLTableProps<HTMLTableElement>;
    tbody: HTMLProps<HTMLTableSectionElement>;
    td: HTMLTdProps<HTMLTableCellElement>;
    template: HTMLProps<HTMLTemplateElement>;
    textarea: HTMLTextareaProps<HTMLTextAreaElement>;
    tfoot: HTMLProps<HTMLTableSectionElement>;
    th: HTMLThProps<HTMLTableCellElement>;
    thead: HTMLProps<HTMLTableSectionElement>;
    time: HTMLTimeProps<HTMLTimeElement>;
    title: HTMLProps<HTMLTitleElement>;
    tr: HTMLProps<HTMLTableRowElement>;
    track: HTMLTrackProps<HTMLTrackElement>;
    u: HTMLProps<HTMLElement>;
    ul: HTMLProps<HTMLUListElement>;
    var: HTMLProps<HTMLElement>;
    video: HTMLVideoProps<HTMLVideoElement>;
    wbr: HTMLProps<HTMLElement>;
  };

  type SVGTags = {
    animate: SVGProps<SVGElement>;
    animateMotion: SVGProps<SVGElement>;
    animateTransform: SVGProps<SVGElement>;
    circle: SVGProps<SVGCircleElement>;
    clipPath: SVGProps<SVGClipPathElement>;
    defs: SVGProps<SVGDefsElement>;
    desc: SVGProps<SVGDescElement>;
    ellipse: SVGProps<SVGEllipseElement>;
    feBlend: SVGProps<SVGFEBlendElement>;
    feColorMatrix: SVGProps<SVGFEColorMatrixElement>;
    feComponentTransfer: SVGProps<SVGFEComponentTransferElement>;
    feComposite: SVGProps<SVGFECompositeElement>;
    feConvolveMatrix: SVGProps<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: SVGProps<SVGFEDiffuseLightingElement>;
    feDisplacementMap: SVGProps<SVGFEDisplacementMapElement>;
    feDistantLight: SVGProps<SVGFEDistantLightElement>;
    feDropShadow: SVGProps<SVGFEDropShadowElement>;
    feFlood: SVGProps<SVGFEFloodElement>;
    feFuncA: SVGProps<SVGFEFuncAElement>;
    feFuncB: SVGProps<SVGFEFuncBElement>;
    feFuncG: SVGProps<SVGFEFuncGElement>;
    feFuncR: SVGProps<SVGFEFuncRElement>;
    feGaussianBlur: SVGProps<SVGFEGaussianBlurElement>;
    feImage: SVGProps<SVGFEImageElement>;
    feMerge: SVGProps<SVGFEMergeElement>;
    feMergeNode: SVGProps<SVGFEMergeNodeElement>;
    feMorphology: SVGProps<SVGFEMorphologyElement>;
    feOffset: SVGProps<SVGFEOffsetElement>;
    fePointLight: SVGProps<SVGFEPointLightElement>;
    feSpecularLighting: SVGProps<SVGFESpecularLightingElement>;
    feSpotLight: SVGProps<SVGFESpotLightElement>;
    feTile: SVGProps<SVGFETileElement>;
    feTurbulence: SVGProps<SVGFETurbulenceElement>;
    filter: SVGProps<SVGFilterElement>;
    foreignObject: SVGProps<SVGForeignObjectElement>;
    g: SVGProps<SVGGElement>;
    image: SVGProps<SVGImageElement>;
    line: SVGProps<SVGLineElement>;
    linearGradient: SVGProps<SVGLinearGradientElement>;
    marker: SVGProps<SVGMarkerElement>;
    mask: SVGProps<SVGMaskElement>;
    metadata: SVGProps<SVGMetadataElement>;
    mpath: SVGProps<SVGElement>;
    path: SVGProps<SVGPathElement>;
    pattern: SVGProps<SVGPatternElement>;
    polygon: SVGProps<SVGPolygonElement>;
    polyline: SVGProps<SVGPolylineElement>;
    radialGradient: SVGProps<SVGRadialGradientElement>;
    rect: SVGProps<SVGRectElement>;
    stop: SVGProps<SVGStopElement>;
    svg: SVGProps<SVGSVGElement>;
    switch: SVGProps<SVGSwitchElement>;
    symbol: SVGProps<SVGSymbolElement>;
    text: SVGProps<SVGTextElement>;
    textPath: SVGProps<SVGTextPathElement>;
    tspan: SVGProps<SVGTSpanElement>;
    use: SVGProps<SVGUseElement>;
    view: SVGProps<SVGViewElement>;
  };
}

type Elements = DarkJSX.NonStrictAttributes<DarkJSX.HTMLTags & DarkJSX.SVGTags>;

declare global {
  namespace JSX {
    // @ts-ignore
    interface IntrinsicElements extends Elements {
      // @ts-ignore
      [name: string]: any;
    }
  }
}

export type HTMLTags = DarkJSX.HTMLTags;
export type SVGTags = DarkJSX.SVGTags;
