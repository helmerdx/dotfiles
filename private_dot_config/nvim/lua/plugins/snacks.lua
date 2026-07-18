local function herdr_focus(direction)
  local herdr = vim.env.HERDR_BIN_PATH
  if herdr == nil or herdr == "" then
    herdr = "herdr"
  end
  vim.fn.system({ herdr, "pane", "focus", "--direction", direction, "--current" })
end

return {
  "folke/snacks.nvim",
  opts = {
    picker = {
      sources = {
        explorer = {
          win = {
            list = {
              keys = {
                -- the explorer's list/input windows are floating, not real splits,
                -- so wincmd-based edge detection (used by the herdr nvim integration)
                -- can't reliably tell it's at the outer boundary. Hand off directly.
                ["<c-h>"] = function()
                  herdr_focus("left")
                end,
                ["<c-j>"] = function()
                  herdr_focus("down")
                end,
                ["<c-k>"] = false,
              },
            },
            input = {
              keys = {
                ["<c-j>"] = false,
                ["<c-k>"] = false,
              },
            },
          },
        },
      },
    },
  },
}
