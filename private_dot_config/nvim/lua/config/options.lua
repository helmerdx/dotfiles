-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

-- LazyVim's own json_conceal fix (config/autocmds.lua) registers on VeryLazy,
-- which can fire after the FileType event for a file opened directly from the
-- command line (nvim foo.json), leaving quotes concealed on first open.
-- Registering it here, before lazy.nvim/VeryLazy, closes that race.
vim.api.nvim_create_autocmd("FileType", {
  pattern = { "json", "jsonc", "json5" },
  callback = function()
    vim.opt_local.conceallevel = 0
  end,
})
