# Personal aliases shared by Bash and Zsh.
if [[ $OSTYPE == darwin* ]] && command -v eza >/dev/null 2>&1; then
  alias ls='eza --icons=auto'
fi

alias hc='eza -l -a --icons --git --octal-permissions'
alias lg='lazygit'
alias pn='pnpm'

alias th='treehouse'
alias ths='treehouse status'
alias the='treehouse enter'

# Claude Code
alias cl='claude --permission-mode auto'
alias clc='claude --permission-mode auto --continue'
alias clr='claude --permission-mode auto --resume'
alias clw='claude --permission-mode auto --worktree'
