function sortTableByColumn(table, column, asc=true, numeric=false) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    //sort each row ... need to fix for numbers
    const sortedRows = rows.sort((a, b) => {
        let aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        let bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        if(numeric) {
            aColText = parseInt(aColText);
            bColText = parseInt(bColText);
        }
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    //remove all existing TRs from the table
    while(tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    //re-add the newly sorted rows
    tBody.append(...sortedRows);
    //remember how the column is currently sorted
    table.querySelectorAll('th').forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

//need to fix so it doesn't just check last 
function filterTable(hasNums=true) {
    let filter = document.querySelector('.my-search-input').value.toUpperCase();
    let tableElement = document.querySelector('.table-sortable');
    const tBody = tableElement.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    rows.forEach(tr => {
        let td = Array.from(tr.querySelectorAll('.to-filter'));
        if(td) {
            let foundInstance = false;
            td.forEach(data => {
                let txtValue = data.textContent || data.innerText;
                if((hasNums && ((isNaN(filter) && isNaN(txtValue)) || (!isNaN(filter) && !isNaN(txtValue)))) 
                    || !hasNums){
                    if(txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr.style.display = "";
                        foundInstance = true;
                    } else {
                        if(!foundInstance)
                            tr.style.display = "none";
                    }
                }
            });
        }
    });
}


const teamTableHeader = document.querySelector('#team-name');
if(teamTableHeader){
    teamTableHeader.addEventListener('click', () => {
        const tableElement = document.querySelector('table');
        const headerIndex = 1;
        const currentIsAscending = teamTableHeader.classList.contains('th-sort-asc');
        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
}

const searchInput = document.querySelector('.my-search-input');
if(searchInput) {
    searchInput.addEventListener('keyup', () => {
        if(searchInput.classList.contains('no-nums')){
            filterTable(false);
        } else {
            filterTable(true);
        }
    });
}

document.querySelectorAll('.header-clickable').forEach(tableHeader => {
    tableHeader.addEventListener('click', () => {
        const tableElement = document.querySelector('.table-sortable');
        const headerIndex = Array.prototype.indexOf.call(tableHeader.parentElement.children, tableHeader);
        const currentIsAscending = tableHeader.classList.contains('th-sort-asc');
        const isNumeric = tableHeader.classList.contains('sort-numeric');
        sortTableByColumn(tableElement, headerIndex, !currentIsAscending, isNumeric);
    }); 
});

document.querySelectorAll('.team-clickable').forEach(tableCell => {
    tableCell.addEventListener('click', () => {
        const id = tableCell.id;
        const name = tableCell.children[1].textContent;
        location.href = 'team?name=' + name + '&id=' + id;
    });
});