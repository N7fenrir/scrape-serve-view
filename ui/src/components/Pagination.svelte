<script>
    import {writable} from "svelte/store";

    export let currentPage;
    export let total_pages;
    export let getDataFromPage;

    let displayPageNumbers = writable([currentPage, currentPage + 1, currentPage + 2]);

    function nextPages() {
        displayPageNumbers.update((state) => {
            if (state[2] !== total_pages) {
                state[0] = state[0] + 1;
                state[1] = state[1] + 1;
                state[2] = state[2] + 1;
            }
            console.log(state);
            return state;
        })
    }

    function prevPages() {
        displayPageNumbers.update((state) => {
            if (state[0] !== 1) {
                state[0] = state[0] - 1;
                state[1] = state[1] - 1;
                state[2] = state[2] - 1;
            }
            return state;
        })
    }


</script>

<div style="float: right">
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item">
                <button class="btn btn-outline-primary" aria-label="Previous" on:click={()=>{prevPages()}}>
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
            {#each $displayPageNumbers as pageNumber, index (index)}
                <li class="page-item {pageNumber === currentPage? 'active' : ''}"
                    on:click={()=> getDataFromPage(pageNumber)}>
                    <a class="page-link" href="#">
                        {pageNumber}
                    </a>
                </li>
            {/each}
            <li class="page-item">
                <button class="btn btn-outline-primary" aria-label="Next" on:click={()=>{nextPages()}}>
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>
        </ul>
    </nav>
</div>