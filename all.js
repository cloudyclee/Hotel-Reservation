var url = "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms";
var get_room_url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room/";
var token = "Bearer 4n5Nx7UdQ9X9vinFsCr6BdKA0qRJkEeN5ixTlcGuwpLa8hXHoUMFT5hydK9F";
var data;
var roomImg = ["https://images.unsplash.com/photo-1526880792616-4217886b9dc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", 
               "https://images.unsplash.com/photo-1558211583-03ed8a0b3d5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80", 
               "https://images.unsplash.com/photo-1526913621366-a4583840d736?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", 
               "https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80", 
               "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2021&q=80", 
               "https://images.unsplash.com/photo-1552902019-ebcd97aa9aa0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"];

// Vue3 template 
const vm = Vue.createApp({
    data () {
        return {
            rooms: data,
            room: {index: 3, id: data[3].id, name: data[3].name},
            now_room: 4,
            img: roomImg
        }
    }
});

// activate loadinf frame
$('.loader-inner').loaders(8);

//get room data with XHR
var xhr = new XMLHttpRequest();
xhr.open("get", url, true);
xhr.setRequestHeader("Authorization", token);
xhr.setRequestHeader("Accept", "application/json");
xhr.send();

// when ajax content is loaded
xhr.addEventListener("load", function(){
    
    var room_name_list = [];
    data = JSON.parse(xhr.response).items
    data.forEach((item) => {
        room_name_list.push(item.name);
    });
    
    var mount_vm = vm.mount("#app");

    // loading frame fades out 
    $(".loading").addClass("loading_fade_out");
    $(".loading").html("");

    // element's anination
    setTimeout(function(){
        $(".logo, .title, .room_list, .infos").css("opacity", "1");
        $(".logo, .title, .room_list, .infos").css("transform", "translateX(0px)");
    }, 300);

    // define hover
    $(document.body).on("mouseover", "li", function(){
        
        // get which room
        var index = $(this).attr("data-id");

        // define room data
        mount_vm.$data.room.index = parseInt(index);
        mount_vm.$data.room.id = data[index].id;
        mount_vm.$data.room.name = data[index].name;
        mount_vm.$data.now_room = parseInt(index)+1;
        
        // show corresponding image
        $(".room1, .room2, .room3, .room4, .room5, .room6").css("opacity", "0");
        $("[data-num='"+ index +"']").css("opacity", "1");
    });

    // hover in middle screen
    $("option:nth-child(4)").attr("selected", "true");
    $("select").on("change", function(){
        var room_name = $("select").val();
        var index = room_name_list.indexOf(room_name);
        
        mount_vm.$data.room.index = parseInt(index);
        mount_vm.$data.room.id = data[index].id;
        mount_vm.$data.room.name = data[index].name;
        mount_vm.$data.now_room = parseInt(index)+1;
        
        $(".room1, .room2, .room3, .room4, .room5, .room6").css("opacity", "0")
        $("[data-num='"+ index +"']").css("opacity", "1")
    });
});

