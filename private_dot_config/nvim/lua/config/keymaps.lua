-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- Remove \w commands
vim.keymap.set("n", "<leader>w", "<cmd>w<cr>")
vim.keymap.set("i", "jj", "<esc>")
