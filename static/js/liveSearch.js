//Get search results from user input 
function getResults() {
    var form_input = $("input[name='search_term").val();
    response = $.post( "search", { search_term: form_input }, function( data ) {
        //console.log(data);
        jobId = data.jobId;
        //console.log(jobId)
        result_set = data.data;
        //console.log(result_set);
        $('#results').html(function(){
            var html = '';
            $.each(result_set, function(i,item){
                html += '<h3>' + item.title + '</h3>';
                html += '<p>' + item.snippet + '</p>';
                html += '<a target="_blank" href ="' + item.url + '">' + item.url + "</a>";
            });
            return html;
        });
    }, "json");
    console.log(form_input)
    var html = "<p>" + "Loading Search Results..." + "</p>";
    $("#results").html(html)
};

//Process selected item
function selectedItem(selected) {
    $.post( "selected", {'title' : selected} );
}

//Bind click event
$(document).ready(function () {
    $("#results").on("click", "h3", function(){
        var selectedResult = $(this).text();
        console.log(selectedResult);
        selectedItem(selectedResult);
    }); 
});
