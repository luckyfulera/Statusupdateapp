$env:GIT_AUTHOR_NAME="lucky fulera"
$env:GIT_AUTHOR_EMAIL="santiprasad121@gmail.com"
$env:GIT_COMMITTER_NAME="lucky fulera"
$env:GIT_COMMITTER_EMAIL="santiprasad121@gmail.com"

git filter-branch -f --env-filter "
    export GIT_AUTHOR_NAME='lucky fulera'
    export GIT_AUTHOR_EMAIL='santiprasad121@gmail.com'
    export GIT_COMMITTER_NAME='lucky fulera'
    export GIT_COMMITTER_EMAIL='santiprasad121@gmail.com'
" --tag-name-filter cat -- --all
