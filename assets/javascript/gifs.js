$(window).on("load", function () {
    var search_tags = ["cats", "dogs", "laugh"];
    //var gify_trend = "https://api.giphy.com/v1/gifs/trending?api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
    //var $x = jQuery.noConflict(); put in window load if use othe rlibraries
    //tags need to be able to be deleted on an x button
    //light and dark themes

    var house = $("#gif-house");
    var tag_holder = $("#tag-holder");
    var search_btn = $("#search-button");

    function search_api() {
        house.empty();
        search_tags.forEach((index) => {
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response) => {
                console.log(response);
                response.data.forEach((element) => {
                    let gif = $('<img class="gifs">');
                    gif.attr("src", element.images.downsized.url);
                    gif.appendTo(house);
                });
            });
        });
    }

    function display_tag() {
        tag_holder.empty();
        search_tags.forEach((index) => {
            let tag = $('<button class="tag">');
            tag.appendTo(tag_holder);
            tag.html(index);

        });
    }
    

    //*************************************************Code Starts Here*****************************************************/

    display_tag();
    search_api();
    search_btn.on("click", (input) => {
        let tag_value = $("#tag-bar").val();
        if (search_tags.includes(tag_value) === false) {
            search_tags.push(tag_value);
        }
        display_tag();
        $("#tag-bar").val("");
        search_api();

    });
    $('.container').infiniteScroll({
        // options
        path: ".pagination__next",
        append: '.post',
        history: false,
      });
 
});