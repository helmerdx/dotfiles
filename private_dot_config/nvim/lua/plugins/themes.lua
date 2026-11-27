-- Colorscheme plugins installed on every machine, so the plugin set always
-- matches lazy-lock.json. Which one is active is a per-machine choice made in
-- colorscheme.lua (created once by chezmoi, never overwritten).
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
    lazy = true,
    priority = 1000,
    config = function()
      -- Neovim auto-detects the terminal's light/dark background into
      -- vim.o.background; alabaster needs style set explicitly to match.
      require("alabaster").setup({ style = vim.o.background, transparent = true })
      -- Track the active theme through ColorScheme events: alabaster clears
      -- vim.g.colors_name while it reapplies itself, so that can't be used.
      local alabaster_active = true
      vim.api.nvim_create_autocmd("ColorScheme", {
        callback = function(event)
          alabaster_active = event.match == "alabaster"
        end,
      })
      vim.api.nvim_create_autocmd("OptionSet", {
        pattern = "background",
        callback = function()
          -- Only follow background changes while alabaster is the active theme.
          if not alabaster_active then
            return
          end
          require("alabaster").setup({ style = vim.o.background, transparent = true })
          vim.cmd.colorscheme("alabaster")
        end,
      })
    end,
  },
}
