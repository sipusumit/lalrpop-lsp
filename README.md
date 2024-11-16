# boilerplate for a  rust language server powered by `tower-lsp` 
## Introduction
This repo is a template for `tower-lsp`, a useful github project template which makes writing new language servers easier.
## Development using VSCode
1. `pnpm i`
2. `cargo build`
3. Open the project in VSCode: `code .`
4. In VSCode, press <kbd>F5</kbd> or change to the Debug panel and click <kbd>Launch Client</kbd>.
5. In the newly launched VSCode instance, open a folder that contains a lalrpop file.
6. If the LSP is working correctly you should see syntax highlighting and the features described below should work.
> **Note**  
> 
> If encountered errors like `Cannot find module '/xxx/xxx/dist/extension.js'`
> please try run command `tsc -b` manually, you could refer https://github.com/IWANABETHATGUY/tower-lsp-boilerplate/issues/6 for more details

## Features

- [ ] InlayHint for LiteralType

- [ ] semantic token   
make sure your semantic token is enabled, you could enable your `semantic token` by
adding this line  to your `settings.json`
```json
{
 "editor.semanticHighlighting.enabled": true,
}
```
- [ ] syntactic error diagnostic

- [ ] code completion  

- [ ] go to definition  

- [ ] find reference

- [ ] rename







