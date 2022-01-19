
const paginatedData = "http://localhost:8000/getdata"
// const modelNameSearch = "http://localhost:8000/searchbymodelname?name="
// const bodyStyleSearch = "http://localhost:8000/searchbybodystyle?class="

export async function getCarsFromPage() {
    return await makeRequest(paginatedData);
}

async function makeRequest(address) {
    return await fetch(address)
        .then(response => response.json())
        .then(data => {
            return data;
        }).catch(error => {
            console.log(error);
            return {};
        });
}