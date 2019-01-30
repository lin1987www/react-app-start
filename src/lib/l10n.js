import en from 'react-intl/locale-data/en';
import am from 'react-intl/locale-data/am';
import ar from 'react-intl/locale-data/ar';
import az from 'react-intl/locale-data/az'; // also parent for Abkahz
import ca from 'react-intl/locale-data/ca';
import cs from 'react-intl/locale-data/cs';
import cy from 'react-intl/locale-data/cy';
import da from 'react-intl/locale-data/da';
import de from 'react-intl/locale-data/de';
import el from 'react-intl/locale-data/el';
import es from 'react-intl/locale-data/es';
import et from 'react-intl/locale-data/et';
import eu from 'react-intl/locale-data/eu';
import fi from 'react-intl/locale-data/fi';
import fr from 'react-intl/locale-data/fr';
import ga from 'react-intl/locale-data/ga';
import gd from 'react-intl/locale-data/gd';
import gl from 'react-intl/locale-data/gl';
import he from 'react-intl/locale-data/he';
import hu from 'react-intl/locale-data/hu';
import id from 'react-intl/locale-data/id';
import is from 'react-intl/locale-data/is';
import it from 'react-intl/locale-data/it';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import lt from 'react-intl/locale-data/lt';
import lv from 'react-intl/locale-data/lv';
import nl from 'react-intl/locale-data/nl';
import nb from 'react-intl/locale-data/nb';
import nn from 'react-intl/locale-data/nn';
import pl from 'react-intl/locale-data/pl';
import pt from 'react-intl/locale-data/pt';
import ro from 'react-intl/locale-data/ro';
import ru from 'react-intl/locale-data/ru';
import sl from 'react-intl/locale-data/sl';
import sk from 'react-intl/locale-data/sk';
import sr from 'react-intl/locale-data/sr';
import sv from 'react-intl/locale-data/sv';
import th from 'react-intl/locale-data/th';
import tr from 'react-intl/locale-data/tr';
import uk from 'react-intl/locale-data/uk';
import vi from 'react-intl/locale-data/vi';
import zh from 'react-intl/locale-data/zh';

let localeData = [].concat(
    en,
    am,
    ar,
    az, // parent for Abkahz
    ca,
    cs,
    cy,
    da,
    de,
    el,
    es,
    et,
    eu,
    fi,
    fr,
    ga,
    gd,
    gl,
    he,
    hu,
    id,
    is,
    it,
    ja,
    ko,
    lt,
    lv,
    nl,
    nb,
    nn,
    pl,
    pt,
    sl,
    sk,
    sr,
    sv,
    ro,
    ru,
    th,
    tr,
    uk,
    vi,
    zh
);

const customLocales = {
    'ab': {
        locale: 'ab',
        parentLocale: 'az'
    },
    'es-419': {
        locale: 'es-419',
        parentLocale: 'es'
    },
    'mi': {
        locale: 'mi',
        parentLocale: 'en'
    },
    'zh-cn': {
        locale: 'zh-cn',
        parentLocale: 'zh'
    },
    'zh-tw': {
        locale: 'zh-tw',
        parentLocale: 'zh'
    }
};

for (const lang in customLocales) {
    localeData.push(customLocales[lang]);
}

// list of RTL locales supported, and a function to check whether a locale is RTL
const rtlLocales = [
    'ar',
    'he'
];

const isRtl = locale => {
    return rtlLocales.indexOf(locale) !== -1;
};

const locales = {
    'ab': {name: 'Аҧсшәа'},
    'ar': {name: 'العربية'},
    'am': {name: 'አማርኛ'},
    'az': {name: 'Azeri'},
    'id': {name: 'Bahasa Indonesia'},
    'ca': {name: 'Català'},
    'cs': {name: 'Česky'},
    'cy': {name: 'Cymraeg'},
    'da': {name: 'Dansk'},
    'de': {name: 'Deutsch'},
    'et': {name: 'Eesti'},
    'el': {name: 'Ελληνικά'},
    'en': {name: 'English'},
    'es': {name: 'Español'},
    'es-419': {name: 'Español Latinoamericano'},
    'eu': {name: 'Euskara'},
    'fr': {name: 'Français'},
    'ga': {name: 'Gaeilge'},
    'gd': {name: 'Gàidhlig'},
    'gl': {name: 'Galego'},
    'ko': {name: '한국어'},
    'he': {name: 'עִבְרִית'},
    'is': {name: 'Íslenska'},
    'it': {name: 'Italiano'},
    'lv': {name: 'Latviešu'},
    'lt': {name: 'Lietuvių'},
    'mi': {name: 'Maori'},
    'nl': {name: 'Nederlands'},
    'ja': {name: '日本語'},
    'ja-Hira': {name: 'にほんご'},
    'hu': {name: 'Magyar'},
    'nb': {name: 'Norsk Bokmål'},
    'nn': {name: 'Norsk Nynorsk'},
    'th': {name: 'ไทย'},
    'pl': {name: 'Polski'},
    'pt': {name: 'Português'},
    'pt-br': {name: 'Português Brasileiro'},
    'ro': {name: 'Română'},
    'ru': {name: 'Русский'},
    'sr': {name: 'Српски'},
    'sk': {name: 'Slovenčina'},
    'sl': {name: 'Slovenščina'},
    'fi': {name: 'Suomi'},
    'sv': {name: 'Svenska'},
    'vi': {name: 'Tiếng Việt'},
    'tr': {name: 'Türkçe'},
    'uk': {name: 'Українська'},
    'zh-cn': {name: '简体中文'},
    'zh-tw': {name: '繁體中文'}
};

const wwwLocales = {
    'ab': {name: 'Аҧсшәа'},
    'ar': {name: 'العربية'},
    'an': {name: 'Aragonés'},
    'ast': {name: 'Asturianu'},
    'id': {name: 'Bahasa Indonesia'},
    'ms': {name: 'Bahasa Melayu'},
    'be': {name: 'Беларуская'},
    'bg': {name: 'Български'},
    'ca': {name: 'Català'},
    'cs': {name: 'Česky'},
    'cy': {name: 'Cymraeg'},
    'da': {name: 'Dansk'},
    'de': {name: 'Deutsch'},
    'yum': {name: 'Edible Scratch'},
    'et': {name: 'Eesti'},
    'el': {name: 'Ελληνικά'},
    'en': {name: 'English'},
    'eo': {name: 'Esperanto'},
    'es': {name: 'Español'},
    'eu': {name: 'Euskara'},
    'fa': {name: 'فارسی'},
    'fr': {name: 'Français'},
    'fur': {name: 'Furlan'},
    'ga': {name: 'Gaeilge'},
    'gd': {name: 'Gàidhlig'},
    'gl': {name: 'Galego'},
    'ko': {name: '한국어'},
    'hy': {name: 'Հայերեն'},
    'he': {name: 'עִבְרִית'},
    'hi': {name: 'हिन्दी'},
    'hr': {name: 'Hrvatski'},
    'zu': {name: 'isiZulu'},
    'is': {name: 'Íslenska'},
    'it': {name: 'Italiano'},
    'kn': {name: 'ಭಾಷೆ-ಹೆಸರು'},
    'rw': {name: 'Kinyarwanda'},
    'ht': {name: 'Kreyòl'},
    'ku': {name: 'Kurdî'},
    'la': {name: 'Latina'},
    'lv': {name: 'Latviešu'},
    'lt': {name: 'Lietuvių'},
    'mk': {name: 'Македонски'},
    'hu': {name: 'Magyar'},
    'ml': {name: 'മലയാളം'},
    'mt': {name: 'Malti'},
    'cat': {name: 'Meow'},
    'mr': {name: 'मराठी'},
    'mn': {name: 'Монгол хэл'},
    'my': {name: 'မြန်မာဘာသာ'},
    'nl': {name: 'Nederlands'},
    'ja': {name: '日本語'},
    'nb': {name: 'Norsk Bokmål'},
    'nn': {name: 'Norsk Nynorsk'},
    'uz': {name: 'Oʻzbekcha'},
    'th': {name: 'ไทย'},
    'pl': {name: 'Polski'},
    'pt': {name: 'Português'},
    'pt-br': {name: 'Português Brasileiro'},
    'ro': {name: 'Română'},
    'ru': {name: 'Русский'},
    'sc': {name: 'Sardu'},
    'sq': {name: 'Shqip'},
    'sk': {name: 'Slovenčina'},
    'sl': {name: 'Slovenščina'},
    'sr': {name: 'Српски'},
    'fi': {name: 'Suomi'},
    'sv': {name: 'Svenska'},
    'te': {name: 'తెలుగు'},
    'vi': {name: 'Tiếng Việt'},
    'tr': {name: 'Türkçe'},
    'uk': {name: 'Українська'},
    'zh-cn': {name: '简体中文'},
    'zh-tw': {name: '繁體中文'}
};

export {
    locales as default,
    wwwLocales,
    isRtl,
    localeData, // data expected for initializing ReactIntl.addLocaleData
};
