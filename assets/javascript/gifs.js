//var gify_url = "api.giphy.com/v1/gifs/search"
var gify_trend ="https://api.giphy.com/v1/gifs/trending?api_key=eKe5uDNPkEck1b04Tz1bRYnaiJtZ2OvW";
$.ajax({
    url: gify_trend,
    method: "GET"
}).then((response)=>{
    console.log(response);
    response.data.forEach((element)=>{
        gif = $("<img>");
        gif.attr("src", element.images.downsized.url);
        bod=$("body");
        gif.appendTo(bod);

      });

});