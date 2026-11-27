-- Per-machine colorscheme choice. chezmoi creates this file once and never
-- overwrites it, so each machine can pick its own theme. The theme plugins
-- themselves live in themes.lua so every machine installs the same set.
return {
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "alabaster",
    },
  },
}
