-- TEMP: not synced to chezmoi yet, still confirming this feels right.
-- LazyVim's flash.nvim default binds S to treesitter-node selection, not
-- backward search like leap.nvim's S was. Override it to match.
return {
  "folke/flash.nvim",
  keys = {
    {
      "S",
      mode = { "n", "x", "o" },
      function()
        require("flash").jump({ search = { forward = false } })
      end,
      desc = "Flash Backward",
    },
  },
}
