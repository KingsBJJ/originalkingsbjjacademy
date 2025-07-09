{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20  # Node.js 20.x (ajuste para nodejs_22 se preferir)
    pkgs.firebase-tools  # Firebase CLI
  ];

  shellHook = ''
    export PATH=$PATH:$HOME/.npm/bin
    echo "Ambiente Nix com Node.js e Firebase CLI configurado!"
  '';
}