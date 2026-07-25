-- Set lazy to false for your default colorscheme.
return {
  { "rose-pine/neovim", name = "rose-pine", lazy = true },
  {
    "catppuccin/nvim",
    name = "catppuccin",
    lazy = true,
    priority = 1000,
  },
  {
    "folke/tokyonight.nvim",
    lazy = true,
    priority = 1000,
    opts = {},
  },
  {
    "mcncl/alabaster.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      -- Neovim auto-detects the terminal's light/dark background into
      -- vim.o.background; alabaster needs style set explicitly to match.
      require("alabaster").setup({ style = vim.o.background })
      vim.api.nvim_create_autocmd("OptionSet", {
        pattern = "background",
        callback = function()
          require("alabaster").setup({ style = vim.o.background })
          vim.cmd.colorscheme("alabaster")
        end,
      })
    end,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "alabaster",
    },
  },
}
