//I actually just did this to myself, so lol

var imgSize = 174; //default size
var numberW, numberH, totalAlbums;
var resolution;

function getUserName(){
    return $('[name="user"]').val();
}

function getPeriod(){
    return $('[name="period"] :selected').val();
}

function getResolution(){
    var res = $('[name="resolution"] :selected').text();
    res = res.split("x");
    res[0] = parseInt(res[0]);
    res[1] = parseInt(res[1]);
    return res;
}

function calculateTotalAlbums(resolution){
    imgSize = parseInt($('[name="imgSize"] :selected').text());
    numberW = Math.ceil(resolution[0]/imgSize); 
    numberH = Math.ceil(resolution[1]/imgSize); 
    totalAlbums = numberH * numberW; 
}

function getData() {
    resolution = getResolution();
    calculateTotalAlbums(resolution);
    
    //set the LastFM API call url with the parameters 
    var getTopAlbums = "http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json" +
        "&api_key=0bf7e6c7cb7263a825e0cc0c7ec3f39d"+
        "&user="+getUserName()+
        "&period="+getPeriod()+
        "&limit="+totalAlbums;
    
    console.log(getTopAlbums);
    
    //call the LastFM API to get the data
    $.getJSON(getTopAlbums, function(data){
        console.log(data);
        if(data.topalbums == undefined){
            alert(data.message);
        }else{
            generateWallpaper(data.topalbums);
        }        
    });
}

//checks if all the images are loaded
function loadingComplete(imageLoaded){
    for(var i = 0; i < imageLoaded.length; i++){
        for(var j = 0; j < imageLoaded[i].length; j++){
            if(!imageLoaded){
                return false;
            }
        }
    }
    return true;
}

function generateWallpaper(data){
    var albums = data.album;
    
    if(albums.length >= totalAlbums){
        $("canvas").remove();
        //creating canvas
        var canvas = document.createElement("canvas");
        canvas.width = resolution[0];
        canvas.height = resolution[1];
        var ctx = canvas.getContext("2d");

        //to check if all the images were loaded
        var imageLoaded = new Array(numberH);
        for(var x = 0; x < numberH; x++){
            imageLoaded[x] = new Array(numberW);
        }

        //to run through all albums
        var k = 0;

        for(var i = 0; i < numberH; i++){
            for(var j = 0; j < numberW; j++){
                var img = new Image();

                //function that draws the image after loaded on the right position
                var drawCanvasImage = function(ctx, img, i,j, imgSize) {
                    return function() {
                        imageLoaded[i][j] = true;
                        ctx.drawImage(img, j*imgSize, i*imgSize, imgSize, imgSize);
                    }
                }
                img.onload = drawCanvasImage(ctx, img, i, j, imgSize);
                img.src = albums[k].image[3]["#text"];
                k++;
            }
        }
        console.log(imageLoaded);
        setTimeout(function(){
            if(loadingComplete(imageLoaded)){
                // var d=canvas.toDataURL("image/png");
                //var w=window.open('about:blank','image from canvas');
                //w.document.write("<img src='"+d+"' alt='from canvas'/>");
            }
        },2000);
        document.body.appendChild(canvas);   
    }else{
        alert("Not albums enough to that resolution.");
    }
}