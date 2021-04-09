var url = new URL(location.href);
var room_id = url.searchParams.get("room_id");
var room_name = url.searchParams.get("room_name");
var single_room_data;
var booking_data;
var booked_date_ms = [];
var booked_date = [];
var amenities = {
    "Wi-Fi": {url: "./info_icon/wifi.svg", name: "WIFI"},
    "Television": {url: "./info_icon/phone.svg", name: "電話"},
    "Great-View": {url: "./info_icon/mountain-range.svg", name: "漂亮的視野"},
    "Breakfast": {url: "./info_icon/breakfast.svg", name: "早餐"},
    "Air-Conditioner": {url: "./info_icon/breeze.svg", name: "空調"},
    "Smoke-Free": {url: "./info_icon/no-smoke-symbol.svg", name: "禁止吸菸"},
    "Mini-Bar": {url: "./info_icon/bar.svg", name: "Mini Bar"},
    "Refrigerator": {url: "./info_icon/fridge.svg", name: "冰箱"},
    "Child-Friendly": {url: "./info_icon/crawling-baby-silhouette.svg", name: "適合兒童"},
    "Room-Service": {url: "./info_icon/room_service.svg", name: "Room Service"},
    "Sofa": {url: "./info_icon/sofa.svg", name: "沙發"},
    "Pet-Friendly": {url: "./info_icon/dog.svg", name: "寵物攜帶"},
}

var get_room_url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room/";
var token = "Bearer 4n5Nx7UdQ9X9vinFsCr6BdKA0qRJkEeN5ixTlcGuwpLa8hXHoUMFT5hydK9F";

const vm = Vue.createApp({
    data () {
        return {
            room: single_room_data,
            detail: amenities,
            status: "",
            bed: {"Single": "單人床", "Double": "雙人床", "Queen": "加大雙人床", "Small Double": "小雙人床"}
        }
    }
});

var xhr = new XMLHttpRequest();
xhr.open("get", get_room_url + room_id, true);
xhr.setRequestHeader("Authorization", token);
document.title = room_name + " - Detail & Reservation | White Space";

document.addEventListener("DOMContentLoaded", function(){
    
    xhr.send();

    xhr.addEventListener("load", function(){
        single_room_data = JSON.parse(xhr.response).room[0];
        booking_data = JSON.parse(xhr.response).booking;

        booking_data.forEach((item) => {
            booked_date.push(item.date);
            booked_date_ms.push(Date.parse(item.date));
        });

        for(var i=0; i<booked_date_ms.length; i++){
            var checkedTime = booked_date_ms[i] - 86400000;
            if(booked_date_ms.indexOf(checkedTime) < 0){
                delete booked_date[i];
            };
        };
        
        for( item in single_room_data.amenities){
            amenities[item].isActive = single_room_data.amenities[item];
        };

        const mount_vm = vm.mount("#app");
        $(".loading").addClass("loading_fade_out");
        $(".loading").html("");
        $("body").css("overflow-y", "scroll");

        $(".pics").on("mouseenter", function(){
            $(".pic").addClass("pic_shadow");
            $(".pic").css("opacity", "1");
        });
        $(".pics").on("mouseleave", function(){
            $(".pic").removeClass("pic_shadow");
        });

        var id = 0;
        var update_pic = function(num){
            var index = num + 1
            $("#img").attr("src", single_room_data.imageUrl[num]);
            $("#img").css("opacity", "1");
            $("#pic_index").text(index + "/3");
        };
        $(".next").on("click", function(e){
            if(id >= 2){
                id = 0;
            } else {
                id++;
            };
            $("#img").css("opacity", "0");
            setTimeout(function(){
                update_pic(id);
            }, 150);
            e.stopPropagation();
        });
        $(".pre").on("click", function(e){
            if(id <= 0){
                id = 2;
            } else {
                id--;
            };
            $("#img").css("opacity", "0");
            setTimeout(function(){
                update_pic(id);
            }, 150);
            e.stopPropagation();
        });

        $(".pic").on("click", function(){
            $(".gallery").css("display", "block");
            setTimeout(function(){
                $(".gallery").css("opacity", "1");
            }, 10);
            id = parseInt($(this).children().attr("data-num"));
            update_pic(id);
            $("body").css("overflow-y", "hidden");
        });
        $(".gallery").on("click", function(){
            $(".gallery").css("opacity", "0");
            setTimeout(function(){
                $(".gallery").css("display", "none");
            }, 500);
            $("body").css("overflow-y", "scroll");
        });
        $("#img").on("click", function(e){
            e.stopPropagation();
        });

        $("#reserv").on("click", function(){
            $(".dialogue").css("display", "block");
            setTimeout(function(){
                $(".dialogue").css("opacity", "1");
            }, 10);
            $("body").css("overflow-y", "hidden");
            
            $(".normal").text(normal + "夜");
            $(".holiday").text(holiday + "夜");
            $(".final_price").text("= NT." + totalPrice());
            
            $("#reserv_start").val(start);
            $("#reserv_end").val(end);

            $("#reserv_start, #reserv_end").attr("min", my_year + "-" + localMonth + "-" + localDate);
            $("#reserv_start, #reserv_end").attr("max", my_year_90after + "-" + localMonth_90after + "-" + localDate_90after);            
            if($("#reserv_start").val() != ""){
                $("#reserv_end").attr("min",$("#reserv_start").val());
            };
            $("#reserv_start").on("change", function(){
                start = $("#reserv_start").val();
                $("#reserv_end").attr("min",$("#reserv_start").val());
                if($("#reserv_end").val() != ""){
                    if(Date.parse($("#reserv_start").val()) > Date.parse($("#reserv_end").val())){
                        $("#reserv_end").val("");
                        $("#reserv_end").attr("min",$("#reserv_start").val());
                    } else {
                        getDateStr(start, end);
                        $(".normal").text(normal + "夜");
                        $(".holiday").text(holiday + "夜");
                        $(".final_price").text("= NT." + totalPrice());
                    };
                };
            });
            $("#reserv_end").on("change", function(){
                if(start != ""){
                    end = $("#reserv_end").val();
                    getDateStr(start, end);
                    $(".normal").text(normal + "夜");
                    $(".holiday").text(holiday + "夜");
                    $(".final_price").text("= NT." + totalPrice());
                };
            });
        });

        $(document).on("click", ".return_page, .cancel", function(){
            $(".dialogue").css("opacity", "0");
            setTimeout(function(){
                $(".dialogue").css("display", "none");
                mount_vm.$data.status = "";
            }, 500);
            $("body").css("overflow-y", "scroll");
            $("input").val("");
            reset();
            holder.innerHTML = "";
            refreshDate();
        });
        $("#reset").on("click", function(){
            reset();
        })

        var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
        var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
        var month_name = ["01","02","03","04","05","06","07","08","09","10","11","12"];

        var holder = document.getElementById("days");
        var prev = document.getElementById("prev");
        var next = document.getElementById("next");
        var ctitle = document.getElementById("calendar-month");
        var cyear = document.getElementById("calendar-year");

        var my_date = new Date();
        var my_year = my_date.getFullYear();
        var my_month = my_date.getMonth();
        var my_day = my_date.getDate();
        var localMonth = my_month + 1 < 10 ? "0" + (my_month + 1) : my_month + 1;
        var localDate = my_day < 10 ? "0" + my_day : my_day;

        var ninetydays = new Date();
        ninetydays.setDate(ninetydays.getDate() + 90);
        var my_year_90after = ninetydays.getFullYear();
        var my_month_90after = ninetydays.getMonth();
        var my_day_90after = ninetydays.getDate()-1;
        var localMonth_90after = my_month_90after + 1 < 10 ? "0" + (my_month_90after + 1) : my_month_90after + 1;
        var localDate_90after = my_day_90after < 10 ? "0" + my_day_90after : my_day_90after;

        function dayStart(month, year) {
            var tmpDate = new Date(year, month, 1);
            return (tmpDate.getDay());
        };

        function daysMonth(month, year) {
            var tmp = year % 4;
            if (tmp == 0) {
                return (month_olympic[month]);
            } else {
                return (month_normal[month]);
            };
        };

        function refreshDate(){
            var str = "";
            var totalDay = daysMonth(my_month, my_year); //获取该月总天数
            var firstDay = dayStart(my_month, my_year); //获取该月第一天是星期几
            var myclass;
            for(var i=0; i<firstDay; i++){ 
                str += "<li></li>"; //为起始日之前的日期创建空白节点
            }
            for(var i=1; i<=totalDay; i++){
                if((i < my_day && my_year == my_date.getFullYear() && my_month == my_date.getMonth()) || my_year < my_date.getFullYear() || ( my_year == my_date.getFullYear() && my_month < my_date.getMonth())){ 
                    myclass = " class='days_past'"; //当该日期在今天之前时，以浅灰色字体显示
                } else if (i == my_day && my_year == my_date.getFullYear() && my_month == my_date.getMonth()){
                    myclass = " class='days_non_past today'"; //当天日期以绿色背景突出显示
                } else {
                    myclass = " class='days_non_past'"; //当该日期在今天之后时，以深灰字体显示
                };

                var month = my_month + 1 < 10 ? "0" + (my_month + 1) : my_month + 1;
                var day = i < 10 ? "0" + i : i;
                var my_ymd = " data-ymd='" + my_year + "-" + month + "-" + day + "'";

                str += "<li" + myclass +  my_ymd + ">" + i + "</li>"; //创建日期节点
            };
        
            holder.innerHTML = str; //设置日期显示
            ctitle.innerHTML = month_name[my_month]; //设置英文月份显示
            cyear.innerHTML = my_year; //设置年份显示

            for(var i=0; i<booked_date.length; i++){
                var booked = $("li[data-ymd='" + booked_date[i] + "']");
                if(booked){
                    booked.removeClass("days_non_past");
                    booked.addClass("days_not_selectable");
                };
            };
        };
        refreshDate(); //执行该函数

        prev.onclick = function(e){
            e.preventDefault();
            my_month--;
            if(my_month<0){
                my_year--;
                my_month = 11;
            }
            refreshDate();

            var d = document.getElementById("days").children;
            for( var i=0; i<d.length; i++){
                var ymd = d[i].getAttribute('data-ymd');
                if(ymd){
                    if(isNinetyDays(ymd)){
                        $("li[data-ymd='" + ymd + "']").removeClass("days_non_past");
                        $("li[data-ymd='" + ymd + "']").addClass("days_not_selectable");
                    };
                };
            };
        };
        next.onclick = function(e){
            e.preventDefault();
            my_month++;
            if(my_month > 11){
                my_year++;
                my_month = 0;
            }
            refreshDate();

            var d = document.getElementById("days").children;
            for( var i=0; i<d.length; i++){
                var ymd = d[i].getAttribute('data-ymd');
                if(ymd){
                    if(isNinetyDays(ymd)){
                        $("li[data-ymd='" + ymd + "']").removeClass("days_non_past");
                        $("li[data-ymd='" + ymd + "']").addClass("days_not_selectable");
                    };
                };
            };
        };

        function getDateStr(startDate, endDate) {

            var str = [startDate];
            normal = 0;
            holiday = 0;
            for (var i = 0 ;; i++) {
                var getDate = getTargetDate(startDate);
                startDate = getDate;
                if (getDate <= endDate) {
                    str.push(getDate);
                    $('[data-ymd="' + getDate + '"]').addClass("selectDay");
                } else {
                    var testDay = new Date(startDate).getDay();
                    if(testDay >= 2 && testDay <= 5){
                        normal--;
                    } else {
                        holiday--;
                    };
                    break;
                };
            };
            date = str;
            console.log(date);
        };
        
        // startDate: 开始时间；dayLength：每隔几天，0-代表获取每天，1-代表日期间隔一天
        function getTargetDate(date) {
            var tempDate = new Date(date);

            var day = tempDate.getDay();
            if(day >= 1 && day <= 4){
                normal++;
            } else {
                holiday++;
            };

            tempDate.setDate(tempDate.getDate() + 1);
            var year = tempDate.getFullYear();
            var month = tempDate.getMonth() + 1 < 10 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
            var day = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
            return year + "-" + month + "-" + day;
        };

        var start = "";
        var end = "";
        var date = "";
        var normal = 0;
        var holiday = 0;
        var first = "";
        var second = "";
        var totalPrice = function(){
            return normal * single_room_data.normalDayPrice + holiday * single_room_data.holidayPrice;
        };
        $(document).on("click", ".days_non_past", function(){
            if (first == "") {
                $(this).addClass("selectDay");
                first = $(this).attr("data-ymd");
            } else if (first != "" && second == "") {                
                $(this).addClass("selectDay");
                second = $(this).attr("data-ymd");
                if(second > first){
                    start = first;
                    end = second;
                    getDateStr(start, end);
                } else if(second == first){
                    second = "";
                } else {
                    start = second;
                    end = first;
                    getDateStr(start, end);
                };
            };
        });
        
        var reserv = document.querySelector("#submit");
        if(reserv){
            $(document).on("click", "#submit", function(){
                
                var obj = {"name": "", "tel": "", "date": ""};
                date.splice(-1, 1);
                obj.name = $("#user_name").val();
                obj.tel = $("#tel").val();
                obj.date = date;

                $("input").val("");
                mount_vm.$data.status = "loading";
                $(".dialogue_frame").ready(function(){
                    $('.loader-reserv').loaders(3);
                });
                
                fetch(get_room_url + room_id, {
                    body: JSON.stringify(obj),
                    headers: {"content-type": "application/json", 
                              "Authorization": token, 
                              "Accept": "application/json"},
                    method: "post"
                }).then(function(res){
                    if (!res.ok) throw new Error(res.statusText)
                    return res.json();
                }).then(function(res){
                    if(res.success){
                        mount_vm.$data.status = "success";
                    } else {
                        mount_vm.$data.status = "fail";
                    };
                }).catch(function(err){
                    mount_vm.$data.status = "fail";
                    console.log("錯誤：", err);
                });
            });
        };

        var reset = function(){
            start = "";
            end = "";
            date = "";
            normal = 0;
            holiday = 0;
            first = "";
            second = "";
            $("li").removeClass("selectDay");
        };

        var isNinetyDays = function(yymmdd){
            var checkday = Date.parse(yymmdd);
            var ninetydayTime = ninetydays.getTime();
            return checkday > ninetydayTime;
        };
    });
});

$('.loader-inner').loaders(8);


