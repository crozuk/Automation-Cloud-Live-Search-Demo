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

//Process selected item
// function selectedItem(selected) {
//     $.post( "selected", {'title' : selected}, function(data){
//         screenshotBase = data;
//         $("#results").html("<img id='screenshot' />");
//         $("#results img").attr('src','data:image/png;base64, ' + screenshotBase)
//     } );
// }

//Bind click event
// $(document).ready(function () {
//     $("#results").on("click", "h3", function(){
//         var selectedResult = $(this).text();
//         console.log(selectedResult);
//         selectedItem(selectedResult);
//         var html = '<p>Loading screenshot for ' + selectedResult + '...</p><br><img id="loader" src="https://i.gifer.com/VAyR.gif" />';
//         $("#results").html(html);
//     }); 
// });
