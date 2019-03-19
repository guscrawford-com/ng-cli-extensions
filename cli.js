const Caporal = require('caporal'),
THIS_PACKAGE = require('./package'),
GENERATE = require('./generate/generate'),
REMOVE = require('./remove/remove');
const SHORT_HANDS = {
    2:{
        g:'generate'
    },
    3: {
        l:'library',
        ls:'library-scripts'
    }
};
process.argv.forEach((arg, v)=>{
    if (SHORT_HANDS[v] && SHORT_HANDS[v][arg])
        process.argv[v] = SHORT_HANDS[v][arg];
});
Caporal.version(THIS_PACKAGE.version);
GENERATE(Caporal);
REMOVE(Caporal);
Caporal.parse(process.argv);