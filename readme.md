# My Dotfiles

A group of dotfiles for my daily development

## Requeriments

### macOS

- Version: Ventura or greater

You need to install Homebrew and Chezmoi first

#### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install chezmoi

```bash
brew install chezmoi
```

### Ubuntu

- Version: 22.04 or greater

### Fedora

- Version: 38 or greater

## Steps

### Get chezmoi (except for macOS, use Brew) and install this config

```bash
sh -c "$(curl -fsLS chezmoi.io/get)" -- init --ssh --apply helmerdavila
```

```bash
# Only for macOS
chezmoi init --ssh --apply helmerdavila
```

## What's installing?

### Tools

- Chezmoi
- Zsh
- Oh my zsh
- Vim plug
- `~/.vimrc` file
- `~/.ideavimrc` file (used for Jetbrains)
- `~/.tmux.conf` file
- `~/.config/alacritty/alacritty.yml` file

### Extras

- Exa
- NVM
- Alacritty
- Ripgrep
- Bat

## Creating an ~/.nvimrc (Custom Neovim) and ~/.ovimrc (Custom Original Vim)

Chezmoi will create the file when you start it the first time. Make sure the content is nearly similar to the next file contents

### ~/.ovimrc

```vim
set guifont=CodeNewRomanNerdFontCompleteM-:h18
"set guifont=JetBrainsMonoNerdFontCompleteM-Regular:h18
"set guifont=FiraCodeNerdFontCompleteM-Retina:h18

# You can change the following between dark or light
set background=light

" Theme: OneHalfLight (Default | Light theme)
colorscheme onehalflight
let g:airline_theme='onehalflight'

" Theme: papercolor (Light theme)
" set background=light
" colorscheme PaperColor

" Theme: Embark (Dark Theme)
" colorscheme embark

" Theme: Sonokai (Dark Theme)
" let g:sonokai_style = 'atlantis'
" colorscheme sonokai

" Theme: Nightfly (Dark Theme)
" colorscheme nightfly

" Share clipboard with system (Mac)
set clipboard=unnamed
```

## Vim Shortcuts (Neovim, Vscode, Jetbrains)

| Shortcut | Description | Use in mode |
| --- | --- | --- |
| `j + j` | Exit from insert mode | Insert |
| `<leader> + -` | Split window horizontally | Normal |
| `<leader> + \|` | Split window vertically | Normal |
| `<C-k>` | Move to the window above | Normal |
| `<C-j>` | Move to the window below | Normal |
| `<C-h>` | Move to the window on the left | Normal |
| `<C-l>` | Move to the window on the right | Normal |
| `<leader> + <tab> + x` | Tab: Close | Normal |
| `<leader> + q + q` | Window: Close | Normal |
| `<leader> + :` | Execute / Search Command | Normal |
| `<C-[>` | Font Size: Decrease | Normal |
| `<C-]>` | Font Size: Increase | Normal |
| `<leader> + g + g` | Git: Focus | Normal |
| `<leader> + u + L` | Toggle relative line numbers | Normal |
| `<leader> + u + w` | Toggle wrap | Normal |
| `<leader> + z` | Toggle Zen mode | Normal |
| `[ + b` | Move to the previous tab / buffer | Normal |
| `] + b` | Move to the next tab / buffer | Normal |
| `H` | Move to the previous tab / buffer | Normal |
| `L` | Move to the next tab / buffer | Normal |
| `<leader> + f + f` | Search file | Normal |
| `<leader> + ,` | Recent files | Normal |
| `<leader> + /` | Search everywhere (Text) | Normal |
| `<leader> + w` | Save the file | Normal |
| `<leader> + W` | Save: No format (Vscode) | Normal |
| `<leader> + s + S` | Go to symbol (Workspace) | Normal |
| `<leader> + c + f` | Reformat the file | Normal |
| `<leader> + c + r` | Rename element | Normal |
| `<leader> + m + m` | Toggle bookmark: Jetbrains, Vscode (plugin) | Normal |
| `g + z + d` | Surround: Delete | Normal |
| `g + z + r` | Surround: Change / Replace | Normal |
| `g + z + a` | Surround: Add | Normal / Visual |
| `<leader> + s + b` | Search in File | Normal |
| `<leader> + s + s` | Go to symbol (File) | Normal |
| `<leader> + s + m` | Go to bookmark: Jetbrains, Vscode (plugin) | Normal |
| `[ + e` | Move to the previous error | Normal |
| `] + e` | Move to the next error | Normal |
| `s + 2 letters` | Move to next word beginning with | Normal |
| `S + 2 letters` | Move to previous word beginning with | Normal |
| `<leader> + e` | Toggle File Explorer | Normal |
| `<leader> + f + t` | Terminal: Open | Normal |
| `<leader> + t + r` | Test: Run nearest | Normal |
| `<leader> + t + l` | Test: Run last | Normal |
| `<leader> + t + c` | Test: Coverage last | Normal |
| `<leader> + d + b` | Breakpoint: Toggle | Normal |

## Tmux Shortcuts

> Prefix is `C-Space` (macOS / Linux) or `C-a` (WSL)

### Sessions

| Shortcut | Description |
| --- | --- |
| `prefix + $` | Rename session |
| `prefix + s` | List / switch sessions |
| `prefix + d` | Detach from session |
| `prefix + (` | Previous session |
| `prefix + )` | Next session |

### Windows

| Shortcut | Description |
| --- | --- |
| `prefix + c` | New window |
| `prefix + ,` | Rename window |
| `prefix + w` | List / switch windows |
| `prefix + n` | Next window |
| `prefix + p` | Previous window |
| `prefix + 0-9` | Select window by number |
| `prefix + &` | Kill window |
| `prefix + f` | Find window by name |

### Panes

| Shortcut | Description |
| --- | --- |
| `prefix + \|` | Split pane vertically (current path) |
| `prefix + -` | Split pane horizontally (current path) |
| `prefix + x` | Kill pane (no confirmation) |
| `prefix + z` | Zoom / unzoom pane |
| `prefix + q` | Show pane numbers |
| `prefix + o` | Next pane |
| `prefix + ;` | Last active pane |
| `prefix + !` | Break pane into its own window |
| `prefix + {` | Swap pane with previous |
| `prefix + }` | Swap pane with next |
| `prefix + <` | Swap pane up |
| `prefix + >` | Swap pane down |
| `prefix + Space` | Cycle through layouts |

### Pane Resizing

| Shortcut | Description |
| --- | --- |
| `prefix + H` | Resize pane left 5 |
| `prefix + J` | Resize pane down 5 |
| `prefix + K` | Resize pane up 5 |
| `prefix + L` | Resize pane right 5 |

### Navigation (vim-tmux-navigator)

| Shortcut | Description |
| --- | --- |
| `C-h` | Move to pane left |
| `C-j` | Move to pane below |
| `C-k` | Move to pane above |
| `C-l` | Move to pane right |
| `C-\` | Move to last active pane |

### Copy Mode

| Shortcut | Description |
| --- | --- |
| `prefix + v` | Enter copy mode |
| `prefix + [` | Enter copy mode (default) |
| `prefix + ]` | Paste |
| `v` | Begin selection |
| `C-v` | Toggle rectangle selection |
| `y` | Copy selection and exit |
| `H` | Jump to start of line |
| `L` | Jump to end of line |
| `Escape` | Cancel / exit copy mode |

### Copy Mode — tmux-yank

| Shortcut | Description |
| --- | --- |
| `y` | Copy selection to system clipboard |
| `Y` | Copy current line to system clipboard |
| `D` | Copy from cursor to end of line |

### Copy Mode — tmux-open

| Shortcut | Description |
| --- | --- |
| `o` | Open selection with default app / browser |
| `C-o` | Open selection in `$EDITOR` |
| `S` | Search selection with web browser |

### Plugins

| Shortcut | Description |
| --- | --- |
| `prefix + F` | tmux-fzf: fuzzy find sessions, windows, panes, commands |
| `prefix + Space` | tmux-thumbs: hint-based yank for any visible text |
| `prefix + C-s` | tmux-resurrect: save session |
| `prefix + C-r` | tmux-resurrect: restore session |

### Misc

| Shortcut | Description |
| --- | --- |
| `prefix + r` | Reload tmux config |
| `prefix + C-l` | Send `Ctrl-L` (clear screen) to pane |
| `prefix + :` | Open command prompt |
| `prefix + ?` | List all keybindings |
| `prefix + t` | Show clock |