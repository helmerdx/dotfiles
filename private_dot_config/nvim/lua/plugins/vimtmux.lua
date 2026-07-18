return {
  "christoomey/vim-tmux-navigator",
  lazy = false,
  init = function()
    vim.g.tmux_navigator_no_mappings = 1
  end,
  config = function()
    vim.api.nvim_create_autocmd("User", {
      pattern = "VeryLazy",
      once = true,
      callback = function()
        vim.schedule(function()
          dofile(vim.fn.expand("~/.local/share/herdr/plugins/vim-herdr-navigation/editor/nvim.lua"))
        end)
      end,
    })
  end,
}
