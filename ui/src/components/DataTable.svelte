<script>
    import {onMount} from 'svelte';
    import {writable} from "svelte/store";
    import IconEyeOpen from "./IconEyeOpen.svelte";
    import IconEyeClosed from "./IconEyeClosed.svelte";

    export let serverData;

    let data = writable([]);
    const tableHeads = [{key: "modelName", search: true, label: "Model"}, {
        key: "bodyClass",
        search: true,
        label: "Body Style"
    }]
    const tableSearchFilter = new Array(tableHeads.length).fill('');
    const openRows = writable(new Set());


    function expandRow(index) {
        openRows.update((state) => {
            if (state.has(index)) {
                state.delete(index)
            } else {
                state.add(index)
            }
            return state;
        })
    }

    function filterColumn(index) {
        const searches = tableSearchFilter[index].split(';');
        data.update(() => {
            let tempArray = [];
            if (searches.length === 1 && searches[0] === '') tempArray = serverData;
            searches.forEach((searchItem) => {
                if (searchItem !== '') {
                    const key = tableHeads[index].key;
                    tempArray = tempArray.concat(
                        serverData.filter((o) => o[key].toLowerCase().includes(searchItem.toLowerCase().trim())
                        )
                    );
                }
            });
            openRows.update(()=> {return new Set()});
            return tempArray;
        });
    }

    function updateData() {
        data.update(() => {
            return serverData;
        });
    }

    onMount(() => {
        updateData()
    })

</script>
<div class="panel tableFixHead panel-default w-100 h-100" style="border-radius: 2rem">
<table class="table table-bordered sticky-header m-0">
    <thead style="background-color: white">
    <tr>
        <th class="p-0 m-0 w-3rem" style="background-color: white" scope="col"></th>
        {#each tableHeads as head, index}
            <th class="mw-w-15rem" style="background-color: white" scope="col">
                <div>{head.label}</div>
                {#if head.search}
                    <input placeholder="Search ... " bind:value={tableSearchFilter[index]}
                           on:input={() => filterColumn(index)}/>
                {/if}
            </th>
        {/each}
    </tr>
    </thead>
    <tbody>

    {#if $data.length === 0}
        <tr class="pad-1 margin-1" >
            <td style="background-color: red; color: white" colspan=3>
                Its time to change your filters...
            </td>
        </tr>
        {:else }
        {#each $data as rowData, index (index)}
            <tr class="pad-1 margin-1 "  style="background-color: white">
                <th>
                    <button class="btn" type="button" on:click={()=>{expandRow(index)}}>
                        {#if $openRows.has(index)}
                            <IconEyeOpen/>
                        {:else}
                            <IconEyeClosed/>
                        {/if}
                    </button>
                </th>
                <th class="pad-1 margin-1 " data-container="body" title={rowData.modelName} scope="row">
                    {rowData.modelName}
                </th>
                <td class="pad-1 margin-1" data-container="body"
                    title={rowData.bodyClass}>{(rowData.bodyClass !== "" ? rowData.bodyClass : "N/A")}</td>
            </tr>
            {#if $openRows.has(index)}
                <tr  style="background-color: white">
                    <td class="text-center hidden" colspan={tableHeads.length+1}>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-auto m-1 p-1">
                                    <img style="max-width:100%; max-height:100%;" src={rowData.modelImage}
                                         alt={rowData.modelUrl}/>
                                </div>
                                <div class="col-auto m-1 p-1">
                                    <h5>Production Years</h5>
                                    <ul>
                                        {#each rowData.productionYears as years}
                                            <li>
                                                {(years === "" ? "N/A" : years)}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            {/if}
        {/each}
    {/if}




    </tbody>
</table>
</div>

<style>

    .tableFixHead          { overflow: auto; height: fit-content; }
    .tableFixHead thead th { position: sticky; top: 0; z-index: 1; }

    table {
        text-align: center;
        margin-left: 2em;
        margin-right: 2em;
        padding-left: 2em;
        padding-right: 2em;
        table-layout: fixed;
        width: 100%
    }

    table td,
    table th {
        overflow: hidden;
        word-wrap: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .pad-1 {
        padding: 1em;
    }

    .margin-1 {
        margin: 1em;
    }

    .mw-w-15rem {
        min-width: 15rem;
        width: 15rem;
    }

    .w-3rem {
        min-width: 3rem;
        width: 3rem;
    }

    /* Works on Firefox */
    * {
        scrollbar-width: thin;
        scrollbar-color: blue orange;
    }

    /* Works on Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
        width: 12px;
    }

    *::-webkit-scrollbar-track {
        background: orange;
    }

    *::-webkit-scrollbar-thumb {
        background-color: blue;
        border-radius: 20px;
        border: 3px solid orange;
    }


</style>



