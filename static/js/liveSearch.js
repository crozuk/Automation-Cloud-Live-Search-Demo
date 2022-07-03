//Get search results from user input 
/**
 * The function gets the value of the search term from the form, sends it to the server, and then
 * displays the results in the results div
 * @returns the html of the results.
 */
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
                html += '<img src="https://digitalcontent.api.tesco.com' + item.image + '?h=255&w=255"/>';
                html += '<a target="_blank" href ="' + item.url + '">' + item.url + "</a>";
            });
            return html;
        });
    }, "json");
    console.log(form_input)
    var html = "<p>" + 'Loading Search Results...<img width="20px" src="https://i.gifer.com/VAyR.gif" style="position: fixed; margin-left: 5px;">' + "</p>";
    $("#results").html(html)
};

/* This is a jQuery function that is called when the document is ready. It is looking for a click event
on the h3 tag. FOR LATER USE */
$(document).ready(function () {
    $("#results").on("click", "h3", function(){
        alert("You clicked on the title of a product");
    }); 
});