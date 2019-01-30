const fs = require('fs');
const path = require('path');

let args = process.argv.slice(2);

const jsonRegex = new RegExp(/(.+)\.json$/);

let dir = args[0] || './translations';

let files = fs.readdirSync(dir);

const messages = files.reduce(function (collection, file) {
    const filePath = path.join(dir, file);
    const isDir = fs.statSync(filePath).isDirectory();
    if (isDir) {
        return collection;
    }
    const jsonRegexResult = jsonRegex.exec(file);
    const jsonFileName = jsonRegexResult ? jsonRegexResult[1] : null;
    if (jsonFileName == null) {
        return collection;
    }
    const langData = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
    );
    let langMessages = {};
    Object.keys(langData).forEach((id) => {
        langMessages[id] = langData[id].message;
    });
    const lang = jsonFileName;
    collection[lang] = langMessages;
    return collection;
}, {});

let data =
    '// GENERATED FILE:\n' +
    'export default ' +
    JSON.stringify(messages, null, 4) +
    ';\n';

fs.writeFileSync(path.join(dir, 'msgs.js'), data);