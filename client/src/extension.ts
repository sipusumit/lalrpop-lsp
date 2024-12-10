/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
  languages,
  workspace,
  EventEmitter,
  ExtensionContext,
  window,
  InlayHintsProvider,
  TextDocument,
  CancellationToken,
  Range,
  InlayHint,
  TextDocumentChangeEvent,
  ProviderResult,
  commands,
  WorkspaceEdit,
  TextEdit,
  Selection,
  Uri,
} from "vscode";

import {
  Disposable,
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

import { exec, spawn } from 'child_process';

let client: LanguageClient;
// type a = Parameters<>;

export async function activate(context: ExtensionContext) {
  const traceOutputChannel = window.createOutputChannel("LALRPOP Language Server trace");

  if (!(await isLanguageServerInstalled())) {
    try {
      await installLanguageServer();
    } catch (error) {
      window.showErrorMessage(error.message);
      return;
    }
  }

  const command = process.env.SERVER_PATH || "lalrpop-lsp";
  const run: Executable = {
    command,
    options: {
      env: {
        ...process.env,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RUST_LOG: "debug",
      },
    },
  };
  const serverOptions: ServerOptions = {
    run,
    debug: run,
  };
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: "file", language: "lalrpop" }],
    // synchronize: {
    //   // Notify the server about file changes to '.clientrc files contained in the workspace
    //   fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    // },
    traceOutputChannel,
  };

  // Create the language client and start the client.
  client = new LanguageClient("lalrpop-language-server", "LALRPOP language server", serverOptions, clientOptions);
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function isLanguageServerInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    exec(`command -v lalrpop-lsp`, (error) => {
      // If the command is not found, the error code is 127
      resolve(!error);
    });
  });
}

function installLanguageServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    window.showInformationMessage("LALRPOP language server is not installed. Would you like to install it?", "Yes", "No").then((answer) => {
      if (answer === "Yes") {
        const install = spawn("cargo", ["install", "--git", "https://github.com/LighghtEeloo/lalrpop-lsp.git"]);
        install.on("exit", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error("Failed to install LALRPOP language server"));
          }
        });
      } else {
        reject(new Error("LALRPOP language server is not installed"));
      }
    });
  });
}