import {addLocaleData} from 'react-intl';
import {detectLocale} from '../lib/detect-locale';
import {localeData, isRtl} from '../lib/l10n';
import messages from '../../translations/msgs';

addLocaleData(localeData);

const UPDATE_LOCALES = 'UPDATE_LOCALES';
const SELECT_LOCALE = 'SELECT_LOCALE';
const initialLocale = detectLocale(Object.keys(messages));
const initialState = {
    isRtl: false,
    locale: initialLocale,
    messagesByLocale: messages,
    messages: messages[initialLocale]
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SELECT_LOCALE:
            return Object.assign({}, state, {
                isRtl: isRtl(action.locale),
                locale: action.locale,
                messagesByLocale: state.messagesByLocale,
                messages: state.messagesByLocale[action.locale]
            });
        case UPDATE_LOCALES:
            return Object.assign({}, state, {
                isRtl: state.isRtl,
                locale: state.locale,
                messagesByLocale: action.messagesByLocale,
                messages: action.messagesByLocale[state.locale]
            });
        default:
            return state;
    }
};

const selectLocale = function (locale) {
    return {
        type: SELECT_LOCALE,
        locale: locale
    };
};

const setLocales = function (localesMessages) {
    return {
        type: UPDATE_LOCALES,
        messagesByLocale: localesMessages
    };
};
const initLocale = function (currentState, locale) {
    if (currentState.messagesByLocale.hasOwnProperty(locale)) {
        return Object.assign(
            {},
            currentState,
            {
                isRtl: isRtl(locale),
                locale: locale,
                messagesByLocale: currentState.messagesByLocale,
                messages: currentState.messagesByLocale[locale]
            }
        );
    }
    // don't change locale if it's not in the current messages
    return currentState;
};
export {
    reducer as default,
    initialState as localesInitialState,
    initLocale,
    selectLocale,
    setLocales
};
