const  CWD = process.cwd(),
COMMAND_NAME = 'remove'
COMMAND_DESCRIPTION = `Remove code in the package present at ${CWD}`,
REMOVABLES = {
    'library-scripts': require('./remove-library-scripts')
};
module.exports = removeFactory;
function removeFactory (cli) {
    cli
    .command(COMMAND_NAME, COMMAND_DESCRIPTION)
    .argument('<removable>', 'Type of thing to remove (i.e. library-scripts)')
    .argument('[library]', 'Name of library (i.e. lib-template)')
    .option('--dry', `Do not actually make any changes to the ${CWD}/package.json`)
    .action(remove);
    
    function remove (args, options, logger) {
        // args and options are objects
        // args = {"app": "myapp", "env": "production"}
        // options = {"tail" : 100}
        if (!REMOVABLES[args.removable])
            throw new Error(`no removal routine available for "${args.removable}"`);
            REMOVABLES[args.removable](args, options, logger, REMOVABLES);

    }
}