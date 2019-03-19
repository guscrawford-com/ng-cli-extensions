# Angular Command-line Extensions

A cli designed to work on top of `@angular/cli` to further improve speed and consistency

## Set-up

1. Open a terminal in the root of this project
2. Run `yarn link`
3. From any working-directory with an **Anguular** project in it (i.e. you'll see _angular.json_)
   1. Run once, `yarn link ng-cli-extensions`
   2. Run `ngx generate library-scripts <existing library name>` to generate the scripts in your project's **package.json** stanza to build, package and preview your library
   3. Run `ngx generate library <new library name>` to generate a new library and add the corresponding scripts