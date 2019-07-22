$(window).on("load", function () {
    var search_tags = ["cats", "dogs", "laugh"];
    var id_list =[];
    //var gify_trend = "https://api.giphy.com/v1/gifs/trending?api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
    //var $x = jQuery.noConflict(); put in window load if use othe rlibraries
    //tags need to be able to be deleted on an x button
    //light and dark themes

    var house = $("#gif-house");
    var tag_holder = $("#tag-holder");
    var search_btn = $("#search-button");
    var start = 10;
    var working = false;
    class gif_data{
        constructor(url, tag, id){
            this.gif_url = url;
            this.gif_tag = tag;
            this.gif_id = id;
        }
    }

    function search_api() {
        house.empty();
        search_tags.forEach((index) => {
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&limit=" + start +"&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response) => {
                console.log(response);
                response.data.forEach((element) => {
                    id_list.push(element.id);
                    let gif = $('<img class="gifs grid-item">');
                    gif.attr("src", element.images.downsized.url);
                    gif.appendTo(house);
                });
            });
        });
    }
    function scroll_api(){
        search_tags.forEach((index) =>{
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&limit=" + start +"&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response)=>{
                response.data.forEach((element) => {
                        if(id_list.includes(element.id) === false){
                            id_list.push(element.id);
                            let gif = $('<img class="gifs grid-item">');
                            gif.attr("src", element.images.downsized.url);
                            gif.appendTo(house);
                        }
                });
                start+=5;
                setTimeout(()=>{
                    working = false;
                }, 4000);

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
    $(window).scroll(()=>{
        if($(this).scrollTop() + 1 >= $('body').height() - $(window).height()){
            if(working === false){
                working = true;
                scroll_api();
            }

        }

    });

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
    
    
 
});