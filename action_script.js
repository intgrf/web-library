function sort_by_date() {

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("book_list").innerHTML = this.responseText;
        }
    };
    xhttp.open("PUT", `/sort_by_date`, true);
    xhttp.send();
}

function sort_is_free() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("book_list").innerHTML = this.responseText;
        }
    };
    xhttp.open("PUT", `/sort_is_free`, true);
    xhttp.send();
}

function reset_list() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(document.getElementById("table_id").innerHTML);
            document.getElementById("book_list").innerHTML = this.responseText;
        }
    };
    xhttp.open("PUT", `/reset_list`, true);
    xhttp.send();
}

