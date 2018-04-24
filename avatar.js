document.addEventListener("DOMContentLoaded", function(){
    var alert = document.querySelector("#alert");
    var file = document.querySelector("#file");
    var preview = document.querySelector("#preview");
    var download = document.querySelector("#download");
    var image = document.querySelector("#image");
    var originalImage = image.cloneNode();
    var cropper;
    var zoom = 1.0;
    
    var showAlert = function(text){
        alert.innerText = text;
        alert.style.display = "block";
    }

    var log = function(){
        if(console)
            return console.log.apply(console, arguments);
        return null;
    }

    var init = function(){
        cropper = new Croppr(image, {
            maxSize: [180, 180, 'px'],
            onCropMove: updatePreview,
            onInitialize: function(){
                document.querySelector(".croppr").addEventListener("wheel", function(ev){
                    zoomAvatar(zoom + ev.deltaY/1000);
                    ev.preventDefault();
                });
            }
        });
        updatePreview();
    }

    var zoomAvatar = function(newZoom){
        var canvas = document.createElement("canvas");
        canvas.width = document.querySelector(".croppr").offsetWidth;
        canvas.height = document.querySelector(".croppr").offsetHeight;
        var scale = originalImage.naturalWidth / canvas.width;
        ctx = canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(originalImage,
                      (canvas.width/2-(canvas.width*newZoom/2))*scale, (canvas.height/2-(canvas.height*newZoom/2))*scale, canvas.width*newZoom*scale, canvas.height*newZoom*scale,
                      0, 0, canvas.width, canvas.height);
        image.src = canvas.toDataURL();
        cropper.update(image.src);
        zoom = newZoom;
    }

    var newAvatar = function(source){
        image.src = source;
        cropper.update(image.src);
        originalImage = image.cloneNode();
        zoom = 1.0;
    }

    var updatePreview = function(){
        cropper.drawCropped(preview);
    }

    file.addEventListener("change", function(ev){
        var target = ev.target || window.event.srcElement;
        var files = target.files;
        if(FileReader && files && files.length) {
            var reader = new FileReader();
            reader.onload = function () {
                newAvatar(reader.result);
            }
            log("New file", files[0]);
            reader.readAsDataURL(files[0]);
        }
    });

    download.addEventListener("click", function(ev){
        var type = document.querySelector('input[name=type]:checked').value;
        var img = cropper
            .getCroppedCanvas()
            .toDataURL("image/"+type);
        download.setAttribute("href", img);
        download.setAttribute("download", "avatar."+type);
        return true;
    });
    
    image.addEventListener("load", updatePreview);

    if(!FileReader)
        showAlert("Your browser does not seem to support the FileReader API, which is necessary for this to work. Sorry.");

    Croppr.prototype.update = function(source){
        this.imageEl.src = source;
        this.imageClippedEl.src = source;
    }
    
    Croppr.prototype.drawCropped = function(canvas){
        var imageDetails = this.getValue("real");
        var canvasDetails = this.getValue("raw");
        canvas.width = canvasDetails.width;
        canvas.height = canvasDetails.height;
        ctx = canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image,
                      imageDetails.x, imageDetails.y, imageDetails.width, imageDetails.height,
                      0, 0, canvas.width, canvas.height);
        return canvas;
    };

    Croppr.prototype.getCroppedCanvas = function(){
        return this.drawCropped(document.createElement("canvas"));
    };

    init();
});
