$(window).on("load", function () {
    var search_tags = ["cats", "dogs", "laugh","shrek","The Office","Dave Chapelle"];
    var id_list =[];
    var obj_list =[];
    //var gify_trend = "https://api.giphy.com/v1/gifs/trending?api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
    //var $x = jQuery.noConflict(); put in window load if use othe rlibraries
    //tags need to be able to be deleted on an x button
    //light and dark themes

    var house = $("#gif-house");
    var tag_holder = $("#tag-holder");
    var search_btn = $("#search-button");
    var start = 10;
    var working = false;
    class gif_obj{                                                                          //end result of data tree
        constructor(url, tag, id, rate){                                                    //        root
            this.gif_url = url;                                                             //       /    \
            this.gif_tag = tag;                                                             //     tag    tag
            this.gif_id = id;                                                               //    /   \  /   \
            this.gif_rating = rate;                                                         //  gif  gifgif  gif
            this.gif_room = $('<div class="gif-holder">');
            this.gif_img = $('<img class="gifs">');
            this.rating_display = $('<p class="rating-text">');
        }
        make_gif(){
            
           this.gif_room.appendTo(house);
           this.gif_img.appendTo(this.gif_room);
           this.gif_img.attr('src',this.gif_url);
           this.rating_display.appendTo(this.gif_room);
           this.rating_display.html('Rating :' + this.gif_rating);
        }
        detach_gif(){
            this.gif_room.detach();

        }
        attach_gif(){
            this.gif_room.appendTo(house);

        }
    }
    class node{
        constructor(data){
            this.data = data;
            this.children =[];
        }

    }
    //https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
    class gif_hood{
        constructor(){
            this.root = null;
        }
        
        add_node(data, toData, traverse){
            let gif_node = new node(data);
            if(root === null){
                root = gif_node;
            }
            else{
                this.root.children.push(gif_node);
            }

        }
        dfs_search(){

        }


    }

    function search_api() { //used for first set of gifs
        house.empty();
        search_tags.forEach((index) => {
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&limit=10&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response) => {
                console.log(response);
                response.data.forEach((element) => {
                    let obj = new gif_obj(element.images.downsized.url,index,element.id,element.rating); //implimenting object to control dom manipulation
                    obj.make_gif();
                    obj_list.push(obj);

                    id_list.push(element.id);
                    // let gif = $('<img class="gifs grid-item">');
                    // gif.attr("src", element.images.downsized.url);
                    // gif.appendTo(house);
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
                            let obj = new gif_obj(element.images.downsized.url,index,element.id,element.rating);
                            obj.make_gif();
                            obj_list.push(obj);
                            id_list.push(element.id);
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