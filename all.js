var url = "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms";
var single_room_url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room/";
var token = "Bearer 4n5Nx7UdQ9X9vinFsCr6BdKA0qRJkEeN5ixTlcGuwpLa8hXHoUMFT5hydK9F";
var data;
var single_room_data;

const vm = Vue.createApp({
  data () {
    return {
      rooms: data,
      room: {index: 3, id: data[3].id, name: data[3].name},
      now_room: 4
    }
  }
});

var xhr = new XMLHttpRequest();
xhr.open("get", url, true);
xhr.setRequestHeader("Authorization", token);
xhr.setRequestHeader("Accept", "application/json");

document.addEventListener("DOMContentLoaded", function(){
    
    xhr.send();

    xhr.addEventListener("load", function(){
        data = JSON.parse(xhr.response).items
        var mount_vm = vm.mount("#app");

        // var child = document.querySelector(".loading");
        // child.parentNode.removeChild(child);

        $(".loading").addClass("loading_fade_out");
        $(".loading").html("");
        setTimeout(function(){
            $(".logo, .title, .room_list, .infos").css("opacity", "1");
            $(".logo, .title, .room_list, .infos").css("transform", "translateX(0px)");
        }, 300);

        $(document.body).on("mouseover", "li", function(){
            var index = $(this).attr("data-id");
            
            mount_vm.$data.room.index = parseInt(index);
            mount_vm.$data.room.id = data[index].id;
            mount_vm.$data.room.name = data[index].name;
            mount_vm.$data.now_room = parseInt(index)+1;
            
            $("img:not(.show_img)").css("opacity", "0");
            $("img[data-num='"+ index +"']").css("opacity", "1");
        });
    });
});

$('.loader-inner').loaders(8);


