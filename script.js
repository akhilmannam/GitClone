const repoContainer = document.createElement('div');
repoContainer.setAttribute('class','container');

const repoRow = document.createElement('div');
repoRow.setAttribute('class','row');

const repoCol = document.createElement('div')
repoCol.setAttribute('class','offset-3 col-6');

const repoTable = document.createElement('table');
repoTable.setAttribute('class','table table-bordered');

const repoHead = document.createElement('thead')
repoHead.setAttribute('class','thead-dark');

const repoHeaderRow = document.createElement('tr');

const repoHeader = document.createElement('th')
repoHeader.setAttribute('scope','col');
repoHeader.innerHTML = 'Repositories';

const repoFiles = document.createElement('th')
repoFiles.setAttribute('scope','col');
repoFiles.innerHTML = 'Files Inside Repository';

const repoBody = document.createElement('tbody');
repoBody.setAttribute('class','repos');

const repoSearchResults = document.createElement('div');
repoSearchResults.setAttribute('class','d-flex flex-column justify-content-center align-items-center');
repoSearchResults.setAttribute('id', 'repoResults');

repoHeaderRow.append(repoHeader, repoFiles);
repoHead.append(repoHeaderRow);
repoTable.append(repoHead, repoBody);
repoCol.append(repoTable);
repoRow.append(repoCol);
repoContainer.append(repoRow);
document.body.append(repoContainer, document.createElement('hr'), repoSearchResults);


//search implementation
const searchUserForm = document.querySelector('form#search');
const searchRepoName = document.querySelector('input#searchrepo');
const searchUsername = document.querySelector('input#searchuser');

const username = 'akhilmannam';

const headers = {
    "Authorization" : "Basic " + btoa(username)
}

searchUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchValue = searchUsername.value;
    const searchRepoValue = searchRepoName.value;
    if(searchValue !== ''){
        async function searchUser(){
            const response = await fetch(`https://api.github.com/search/users?q=${searchValue}`, {
                "method" : "GET",
                "headers" : headers
            });
            const search = await response.json();
            return search;
        }

        searchUser()
        .then(userDetails => {
            console.log(userDetails);
            //fetch repos
            async function getRepos(){
                const res = await fetch(userDetails.items[0].repos_url, {
                    "method" : "GET",
                    "headers" : headers
                });
                const repos = await res.json();
                return repos;
            }

            getRepos().
            then(repos => {
                console.log(repos);
                //Table creation for repo names
                for(let i=0; i<repos.length; i++){
                    let repo = document.createElement('tr');

                    let repoNames = document.createElement('td');
                    repoNames.setAttribute('scope', 'col');
                    repoNames.innerHTML = repos[i].name;

                    let repoFiles = document.createElement('td');
                    repoFiles.setAttribute('scope', 'col');

                    //get files on clicking repo name
                    async function getRepoFiles(){
                        const response = await fetch(`https://api.github.com/repos/${searchValue}/${repos[i].name}/contents/`, {
                            "method" : "GET",
                            "headers" : headers
                        });
                        const repofiles = await response.json();
                        return repofiles;
                    }

                    getRepoFiles()
                    .then(files => {
                        console.log(files);
                        let fileNames = '';
                        files.forEach(file => {
                            fileNames += file.name + ', ';
                        })
                        repoFiles.innerHTML = fileNames.substring(0, fileNames.length-2);

                    })
                    .catch(e => console.log(e))

                    const body = document.querySelector('.repos');
                    repo.append(repoNames, repoFiles);
                    body.append(repo);
                }
                document.querySelectorAll('tbody tr').forEach(row => {
                    searchUsername.addEventListener('change', ()=>{
                        row.style.display = 'none';  
                    })
                })

            })
        })
        .catch(e => console.log(e))
    }
    if(searchRepoValue !== ''){
        async function searchRepo(){
            const response = await fetch(`https://api.github.com/search/repositories?q=${searchRepoValue}&sort=stars&order=desc`, {
                "method" : "GET",
                "headers" : headers
            })
            const search = await response.json();
            return search;
        }

        searchRepo()
        .then(repos => {
            console.log(repos);
            const searchDisplayMessage = document.createElement('strong');
            searchDisplayMessage.innerHTML = 'Displaying repositories sorted by stars in descending order';
            searchDisplayMessage.style.borderBottom = "2px solid black";
            repoSearchResults.append(searchDisplayMessage);

            for(let i=0; i<repos.items.length; i++){
                let repoFullName = document.createElement('p');
                repoFullName.innerHTML = repos.items[i].full_name;

                const display = document.querySelector('#repoResults');
                display.append(repoFullName);
            }
            document.querySelectorAll('p').forEach(para => {
                searchRepoName.addEventListener('change', ()=>{
                    para.style.display = 'none';
                })
            });
        })
        .catch(e => console.log(e))
    }
});







