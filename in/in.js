const ChildProcess = require('child_process'),
CWD = process.cwd(),
COMMAND_NAME = 'in'
COMMAND_DESCRIPTION = `Run ng relative to a library path (a.k.a "at", shorthand i, a)`,
{ join } = require('path');
// CREATABLES = {
//     'library': require('./generate-library'),
//     'library-scripts': require('./library-scripts/generate-library-scripts'),

// };
module.exports = inFactory;
function inFactory (cli) {
    cli
    .command(COMMAND_NAME, COMMAND_DESCRIPTION)
    .argument('<library>', 'Name of library (i.e. lib-template)')
    .argument(`[ng-cli-args...]`, 'ng ...')
    .option(
        '--org', 'Specify an @org-namme prefix',
        (option)=>(
            typeof option === 'string'
                && option.match(/^@\w+/)
        ) || typeof option !== 'string'
    )
    .option('--dry', `Do not actually execute commands`)
    .action(at);
    
    function at (args, options, logger) {
        // args and options are objects
        // args = {"app": "myapp", "env": "production"}
        // options = {"tail" : 100}
        //console.info(args)
        var targetCwd = join(CWD,'projects',args.library,'src','lib'),
        shellCommand = args.ngCliArgs.join(' ');
        if (!shellCommand.match(/^ng /)) {
            if (!shellCommand.match(/^(g|generate) /))
                shellCommand = `ng generate ${shellCommand}`;
            else shellCommand = `ng ${shellCommand}`
        }
        logger.info(`${options.dry?'Previewing':'Executing'} ${shellCommand} in ${targetCwd}`);
        if (!options.dry)
            ChildProcess.exec(
                shellCommand,
                {
                    cwd: targetCwd
                },
                (err, stdo, stde) => {
                    if (err) throw err;
                    if (stdo) logger.info(`${stdo}`);
                    if (stde) logger.error(`${stde}`);
                    logger.info(`Finished ng cli exectution in ${targetCwd}`)
                }
            )
    }
}