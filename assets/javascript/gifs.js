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
            this.gif_room = $('<div class="gif-holder">');
            this.gif_img = $('<img class="gifs">');
            this.rating_display = $('<p class="rating-text">');
            this.playing=false;
        }
        make_gif(){
            
           this.gif_room.appendTo(house);
           this.gif_img.appendTo(this.gif_room);
           this.gif_img.attr('src',this.gif_thumbnail);
           this.rating_display.appendTo(this.gif_room);
           this.rating_display.html('Rating :' + this.gif_rating);
           this.gif_room.data("obj",this.constructor);
           console.log(this.gif_room.data("obj"));
           
        }
        swap_gif(){
            if(this.playing===false){
                this.gif_img.attr('src', this.gif_url);
                this.playing=true;
            }
            else{
                this.gif_img.attr('src', this.gif_thumbnail);
                this.playing=false;
            }
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
    var hood = new gif_hood("root");

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
                    let obj = new gif_obj(element.images.downsized.url,index,element.id,element.rating,element.images.original_still.url); //implimenting object to control dom manipulation
                    obj.make_gif();
                    obj_list.push(obj);

                    id_list.push(element.id);
                });
                    
            });
            });
          
    }
    function tie_gif_data(obj,div){
        div.data("obj",obj);

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
                            let obj = new gif_obj(element.images.downsized.url,index,element.id,element.rating,element.images.original_still.url);
                            obj.make_gif();


                            obj_list.push(obj);
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

    $("#to-top").click(()=>{

    });
    house.on("click", ".gif-holder", (event)=>{
        let gif_room = house.find(event.target);
        console.log( house.find(event.target).data("obj"));
        //gif_room.data("obj",gif_obj.swap_gif());

    });
    
 
});