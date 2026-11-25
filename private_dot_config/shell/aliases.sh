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
