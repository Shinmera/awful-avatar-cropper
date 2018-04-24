document.addEventListener("DOMContentLoaded", function(){
    var alert = document.querySelector("#alert");
    var file = document.querySelector("#file");
    var download = document.querySelector("#download");
    var image = document.querySelector("#image");
    var cropper = new Cropper(image, {
        viewMode: 2,
        preview: "#preview",
        scalable: false,
    });
    
    var showAlert = function(text){
        alert.innerText = text;
        alert.style.display = "block";
    }

    var log = function(){
        if(console)
            return console.log.apply(console, arguments);
        return null;
    }

    var newAvatar = function(source){
        cropper.replace(source);
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
            .getCroppedCanvas({imageSmoothingQuality: "high",
                               maxWidth: 180,
                               maxHeight: 180})
            .toDataURL("image/"+type);
        download.setAttribute("href", img);
        download.setAttribute("download", "avatar."+type);
        return true;
    });

    if(!FileReader)
        showAlert("Your browser does not seem to support the FileReader API, which is necessary for this to work. Sorry.");
});
