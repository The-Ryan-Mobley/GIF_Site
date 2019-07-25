$(window).on("load", function () {
    var search_tags = ["Bob Ross", "Simpsons", "Honey Badger","shrek","The Office","Dave Chapelle"];
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
        constructor(url, tag, id, rate, thumb){                                                    //        root
            this.gif_url = url;                                                             //       /    \
            this.gif_tag = tag;                                                             //     tag    tag
            this.gif_id = id;                                                               //    /   \  /   \
            this.gif_rating = rate;
            this.gif_thumbnail=thumb;                                                         //  gif  gifgif  gif
            //this.gif_img = $('<img class="gifs">');
            this.rating_display = $('<p class="rating-text">');
            this.playing=false;
        }
        make_gif(room, img){
           room.appendTo(house);
           img.appendTo(room);
           img.attr('src',this.gif_thumbnail);
           this.rating_display.appendTo(room);
           this.rating_display.html('Rating :' + this.gif_rating);
        } 
        detach_gif(){
            this.gif_room.detach();
        }
        attach_gif(){
            this.gif_room.appendTo(house);
        }
        swap_gif(div){
            if(this.playing===false){
                div.attr('src', this.gif_url);
                this.playing=true;
            }
            else{
                div.attr('src', this.gif_thumbnail);
                this.playing=false;
            }
        }
    }
    class node{
        constructor(data){
            this.data = data;
            this.parent = null;
            this.children =[];
        }

    }
    //https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
    class gif_hood{
        constructor(data){
            this.root = new node("root");
            
        }
        
        add_node(data, toData, traversal){
            let gif_node = new node(data);
            gif_node.parent = null;
            toData.children.push(gif_node);
            callback = function(node){
                if (node.data === toData) {
                    parent = node;
                }
            };
            this.contains(callback, traversal);
            if (parent) {
                parent.children.push(gif_node);
                gif_node.parent = parent;
            } else {
                throw new Error('Cannot add node to a non-existent parent.');
            }
                

        }
        depth_first_traversal(callback){
            (function recurse(currentNode){
                for (var i = 0, length = currentNode.children.length; i < length; i++) {
                    recurse(currentNode.children[i]);
                }
                callback(currentNode);

            })(this.root);
            

        }
        


    }
    //var hood = new gif_hood("root");

    function search_api() { //used for first set of gifs assign data from apicall here
        house.empty();
        search_tags.forEach((index) => {
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&limit=10&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response) => {
                console.log(response);
                response.data.forEach((element) => {
                    let gif_room = $('<div class="gif-holder grid-item">');
                    let gif_img = $('<img class="gifs">');
                    let obj = new gif_obj(element.images.downsized.url,index,element.id,
                    element.rating,element.images.original_still.url);
                    obj.make_gif(gif_room,gif_img);
                    gif_img.data("obj",obj);
                    get_grid_class(element,gif_img);
                    obj_list.push(obj);

                    id_list.push(element.id);
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
                            let gif_room = $('<div class="gif-holder grid-item">');
                            let gif_img = $('<img class="gifs">');
                            let obj = new gif_obj(element.images.downsized.url,index,element.id,element.rating,element.images.original_still.url);
                            
                            obj.make_gif(gif_room,gif_img);
                            gif_img.data("obj",obj);
                            id_list.push(element.id);
                        }
                });
                start++;
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
    function get_grid_class(data, elem){
        if(data.images.downsized.width >= "360"){
            elem.addClass("grid-item--width3");
        }
        else if(data.images.downsized.width >= "260"){
            elem.addClass("grid-item--width2");

        }
        if(data.images.downsized.height >= "360"){
            elem.addClass("grid-item--height3");
        }
        else if(data.images.downsized.height >= "260"){
            elem.addClass("grid-item--height2");

        }

        

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


    tag_holder.on('click','.tag',(event)=>{
        let targeted = tag_holder.find(event.target)
        $('.gifs').each(function(event){
            

        });
        //tag_holder.find(event.target).remove();

    });

    $("#to-top").click(()=>{
        $(window).scrollTop(250);

    });
    house.on("click", ".gif-holder", (event)=>{
        let gif_room = house.find(event.target);
        gif_room.data("obj").swap_gif(gif_room);
        
    });
    house.on('hover', ".gif-holder", (event)=>{
        
    });
    $("#theme-button").on('click',()=>{
        if($(document.body).hasClass('day')){
            $(document.body).removeAttr("class");
            $(document.body).attr('class', 'night');
        }
        else{
            $(document.body).removeAttr("class");
            $(document.body).attr('class', 'day');
        }
    });
    $('.grid').masonry({
        
        itemSelector: '.grid-item',
        columnWidth: 300,
      });
 
});