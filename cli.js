const Caporal = require('caporal'),
THIS_PACKAGE = require('./package'),
GENERATE = require('./generate/generate'),
REMOVE = require('./remove/remove'),
AT = require('./in/in');
const SHORT_HANDS = require('./shorthands');
process.argv.forEach((arg, v)=>{
    if (SHORT_HANDS[v] && SHORT_HANDS[v][arg])
        process.argv[v] = SHORT_HANDS[v][arg];
});
Caporal.version(THIS_PACKAGE.version);
GENERATE(Caporal);
REMOVE(Caporal);
AT(Caporal);
Caporal.parse(process.argv);