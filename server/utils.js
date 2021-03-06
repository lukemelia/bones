var utils = module.exports = require('../shared/utils');
var fs = require('fs');
var path = require('path');
var tty = require('tty');

var colors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    cyan: 36,
    white: 37
};

var styles = {
    regular: 0,
    bold: 1,
    underline: 4
};

if (tty.isatty()) {
    utils.colorize = function(text, color, style) {
        color = color || 'red';
        style = style || 'regular';
        return "\033[" + styles[style] + ";" + colors[color] + "m" + text + "\033[0m";
    };
} else {
    utils.colorize = function(text) { return text };
}


// Load client-side wrappers
var wrappers = {};
var wrapperDir = path.join(__dirname, '../client');
fs.readdirSync(wrapperDir).forEach(function(name) {
    var match = name.match(/^(.+)\.(prefix|suffix)\.js$/);
    if (match) {
        wrappers[match[1]] = wrappers[match[1]] || {};
        wrappers[match[1]][match[2]] =
            fs.readFileSync(path.join(wrapperDir, name), 'utf8');
    }
});

utils.wrapClientFile = function(content, filename) {
    var kind = utils.singularize(path.basename(path.dirname(filename)));
    var name = path.basename(filename).replace(/\..+$/, '');

    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    return wrappers[kind].prefix.replace(/__NAME__/g, name) +
           "\n" + content + "\n" +
           wrappers[kind].suffix.replace(/__NAME__/g, name);
};
