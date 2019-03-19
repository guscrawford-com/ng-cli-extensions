/**
 * A master set of scripts to tack on to the package.json "scripts" stanza for each `ng cli library <lib-name>` generated
 */
module.exports = {
    'npm-pack':(lib)=>`cd dist/${lib} && npm pack`,
    'build-watch':(lib)=>`ng build --watch ${lib}`,
    'build-lib':(lib, options)=>`ng build ${options.prod?'--prod':''} ${lib}`,
    'copy-assets':(lib)=>`xcopy \"projects/${lib}/src/assets\" \"dist/${lib}/assets\" /e /i /y /s`,
    'package':(lib)=>`yarn build-lib-${lib} && (yarn copy-assets-${lib} || echo Skipping assets...) && yarn npm-pack-${lib}`,
    'preview':(lib)=>`yarn build-lib-${lib} && cd dist/${lib} && (yarn unlink || echo Skipping unlink...) && yarn link`
};
function tarballPath (lib) {
    var libPackage = require(`./dist/${lib}/package`),
    libPackageName = libPackage.name.replace(/@/g,'').replace(/\//g,'-');
    return `${libPackageName}-${libPackage.version}.tgz`;
}