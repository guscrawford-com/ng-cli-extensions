const ChildProcess = require('child_process'), CWD = process.cwd();
module.exports = generateLibrary;
async function generateLibrary (args, options, logger, creatables) {
    var shellCommand = `ng generate library ${args.library}`;
    logger.info(`${options.dry?'Preview:':'Executing:'} "${shellCommand}"`);
    if (!options.dry)
        ChildProcess.exec(
            shellCommand,
            (err, stdo, stde) => {
                if (err) throw err;
                if (stdo) logger.info(`${stdo}`);
                if (stde) logger.error(`${stde}`);
                logger.info(`Augmenting ${CWD}/package.json with library-scripts for ${args.library}`);
                creatables['library-scripts'](args, options, logger, creatables);
            }
        )
}