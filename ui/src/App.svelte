<script>
    import {onMount} from "svelte";
    import {writable} from "svelte/store";
    import { getCarsFromPage} from "./utils/api";
    import DataTable from "./components/DataTable.svelte";

    let serverData = writable([]);
    let reqDone = false;

    onMount(async () => {
        const response = await getCarsFromPage(1)
        serverData.update(() => {
            return response;
        });
        reqDone = true;
    });

    async function getDataFromPage(pageNumber){
        // Just get the next set of data;
        const response = await getCarsFromPage(pageNumber)
        serverData.update(() => {
            return response;
        });
    }

</script>


<main class="w-100 h-100">
    <div class="container h-100">
        <div class="row h-100 justify-content-center align-items-center">
            <form class="col-12 w-100 h-75">
                {#if reqDone}
                    <DataTable serverData={$serverData} />
                {:else }
                    <h3>Loading ...</h3>
                {/if}
            </form>
        </div>
    </div>


</main>

<style>
    .vertical-center {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
</style>