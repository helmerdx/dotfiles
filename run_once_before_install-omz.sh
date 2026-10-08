#!/bin/bash
set -eu

# Installs Oh My Zsh on first run. OMZ manages its own updates via auto-updater.
if [ ! -f "$HOME/.oh-my-zsh/oh-my-zsh.sh" ]; then
  zsh_path=$(command -v zsh)
  install_directory=$(mktemp -d)
  trap 'rm -rf "$install_directory"' EXIT

  # Stage the core so an existing custom plugin directory does not block setup.
  git clone --depth=1 https://github.com/ohmyzsh/ohmyzsh.git "$install_directory/oh-my-zsh"
  mkdir -p "$HOME/.oh-my-zsh"
  cp -R "$install_directory/oh-my-zsh/." "$HOME/.oh-my-zsh/"

  if [ "${SHELL:-}" != "$zsh_path" ]; then
    chsh -s "$zsh_path"
  fi
fi
