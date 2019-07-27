$(window).on("load", function () {
    var search_tags = ["Monty Python", "Simpsons", "Futurama","Parks and Recreation","The Office","Dave Chapelle"]; //holds tags to search api
    var id_list =[]; //holds ids of images already appended to avoid duplicates
    var house = $("#gif-house");            //main elements modified with jquery
    var tag_holder = $("#tag-holder");
    var search_btn = $("#search-button");
   
    var start = 10;                        //initial pull of images
    var working = false;
    
    class gif_obj{                                  //object that holds image values and appends them                                                                   
        constructor(url, tag, id, rate, thumb){                                                 
            this.gif_url = url;                                                            
            this.gif_tag = tag;                                                          
            this.gif_id = id;                                                          
            this.gif_rating = rate;
            this.gif_thumbnail=thumb;                                                       
            this.rating_display = $('<p class="rating-text">');
            this.playing=false;
        }
        make_gif(room, img){                     //makes the image and rating and appends it to parent div
           room.appendTo(house);
           img.appendTo(room);
           img.attr('src',this.gif_thumbnail);
           this.rating_display.appendTo(room);
           this.rating_display.html('Rating :' + this.gif_rating);
        } 
        
        swap_gif(div){                              //changes from still image to gif
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
   

    function search_api() {                                 //calls api and appends new images
        search_tags.forEach((index) => {
            var gif_search = "https://api.giphy.com/v1/gifs/search?q=" + index + "&limit="+start+"&api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
            $.ajax({
                url: gif_search,
                method: "GET"
            }).then((response) => {
                response.data.forEach((element) => {
                    if(id_list.indexOf(element.id)===-1){
                    let gif_room = $('<div class="gif-holder grid-item">');
                    let gif_img = $('<img class="gifs ">');
                    let obj = new gif_obj(element.images.downsized.url,index,element.id,
                    element.rating,element.images.original_still.url);
                    obj.make_gif(gif_room,gif_img);
                    gif_img.data("obj",obj);
                    id_list.push(element.id);
                    }
                });
                    
            });
            });
          
    }
    

    function scroll_api(){ //appends more images as they scroll on a 2 second interval
        search_api();
        start++;
        setTimeout(()=>{
            working = false;
        }, 2000);
    }

    function display_tag() {                       //creates a new tag element
        tag_holder.empty();
        search_tags.forEach((index) => {
            let tag = $('<button class="tag">');
            tag.appendTo(tag_holder);
            tag.html(index);

        });
    }

    //*************************************************Code Starts Here*****************************************************/
    $(window).scroll(()=>{                                                                   //infinite scroller
        if($(this).scrollTop() + 1 >= $('body').height() - $(window).height()){
            if(working === false){
                working = true;
                scroll_api();
            }

        }

    });

    display_tag(); //initializes tags and gifs
    house.empty();
    search_api();


    search_btn.on("click", (input) => {                      //adds new tags based on user input
        let tag_value = $("#tag-bar").val();
        if (search_tags.includes(tag_value) === false) {
            search_tags.push(tag_value);
        }
        display_tag();
        $("#tag-bar").val("");
        house.empty();
        search_api();

    });


    tag_holder.on('click','.tag',(event)=>{                        //removes tags on click                  
        let targeted = tag_holder.find(event.target)
        search_tags.splice(search_tags.indexOf(targeted.html()),1);
        targeted.remove();
        house.empty();
        id_list =[];
        search_api();

    });

    $("#to-top").click(()=>{                                          //sets position to top of page when user clicks
        $(window).scrollTop(250);

    });
    house.on("click", ".gif-holder", (event)=>{                 //plays gif
        let gif_room = house.find(event.target);
        gif_room.data("obj").swap_gif(gif_room);
        
    });
    
    $("#theme-button").on('click',()=>{                       //swaps day night theme
        if($(document.body).hasClass('day')){
            $(document.body).removeAttr("class");
            $(document.body).attr('class', 'night');
            $('#theme-button').html('Theme: \uD83C\uDF16');
        }
        else{
            $(document.body).removeAttr("class");
            $(document.body).attr('class', 'day');
            $('#theme-button').html('Theme: \u2600\uFE0F')
        }
    });
    

    var $grid =$('.grid').masonry({   //initializes masonry
        itemSelector: '.grid-item',
        columnWidth: 160,

    });
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
 
});