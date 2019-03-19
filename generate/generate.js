const NULABLE_STRING = (pat)=>(op)=>
    pat? (typeof op === 'string' && op.match(pat) && op) || !!op
    : op,
CWD = process.cwd(),
COMMAND_NAME = 'generate'
COMMAND_DESCRIPTION = `Generate code in the package present at ${CWD} (shorthand g)`,
CREATABLES = {
    'library': require('./generate-library'),
    'library-scripts': require('./library-scripts/generate-library-scripts'),

};
module.exports = generateFactory;
function generateFactory (cli) {
    cli
    .command(COMMAND_NAME, COMMAND_DESCRIPTION)
    .argument('<creatable>', 'Type of thing to create (i.e. library-scripts)')
    .argument('[library]', 'Name of library (i.e. lib-template)')
    .option('--org', 'Specify an @org-namme prefix', NULABLE_STRING(/^@\w+/) )
    .option('--prefix', 'Specify a selector prefix (default "lib")', NULABLE_STRING() )
    .option('--prod', `Add the prod flag to the build`)
    .option('--dry', `Do not actually make any changes to the ${CWD}/package.json`)
    .action(generate);
    
    function generate (args, options, logger) {
        // args and options are objects
        // args = {"app": "myapp", "env": "production"}
        // options = {"tail" : 100}
        if (!CREATABLES[args.creatable]) {
            logger.error(`no creation routine available for "${args.creatable}"`);
            process.exit(1);
        }
        CREATABLES[args.creatable](args, options, logger, CREATABLES);

    }
}