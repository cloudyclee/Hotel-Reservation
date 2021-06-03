// get parameter in URL
var url = new URL(location.href);
var room_id = url.searchParams.get("room_id");
var room_name = url.searchParams.get("room_name");
document.title = room_name + " - Detail & Reservation | White Space";

// prepare ajax
var get_room_url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room/";
var token =
	"Bearer 4n5Nx7UdQ9X9vinFsCr6BdKA0qRJkEeN5ixTlcGuwpLa8hXHoUMFT5hydK9F";
var xhr = new XMLHttpRequest();
xhr.open("get", get_room_url + room_id, true);
xhr.setRequestHeader("Authorization", token);
xhr.send();

// prepare Vue data
var single_room_data;
var amenities = {
	"Wi-Fi": { url: "./info_icon/wifi.svg", name: "WIFI" },
	Television: { url: "./info_icon/phone.svg", name: "電話" },
	"Great-View": { url: "./info_icon/mountain-range.svg", name: "漂亮的視野" },
	Breakfast: { url: "./info_icon/breakfast.svg", name: "早餐" },
	"Air-Conditioner": { url: "./info_icon/breeze.svg", name: "空調" },
	"Smoke-Free": { url: "./info_icon/no-smoke-symbol.svg", name: "禁止吸菸" },
	"Mini-Bar": { url: "./info_icon/bar.svg", name: "Mini Bar" },
	Refrigerator: { url: "./info_icon/fridge.svg", name: "冰箱" },
	"Child-Friendly": {
		url: "./info_icon/crawling-baby-silhouette.svg",
		name: "適合兒童",
	},
	"Room-Service": {
		url: "./info_icon/room_service.svg",
		name: "Room Service",
	},
	Sofa: { url: "./info_icon/sofa.svg", name: "沙發" },
	"Pet-Friendly": { url: "./info_icon/dog.svg", name: "寵物攜帶" },
};
const vm = Vue.createApp({
	data() {
		return {
			room: single_room_data,
			detail: amenities,
			status: "",
			bed: {
				Single: "單人床",
				Double: "雙人床",
				Queen: "加大雙人床",
				"Small Double": "小雙人床",
			},
		};
	},
});

// define some arrays to manipulate
var booking_data;
var booked_date_ms = [];
var booked_date = [];
var firstDay = [];
var showBooked = function (xhrObject) {
	booking_data = JSON.parse(xhrObject.response).booking;
	booking_data.forEach((item) => {
		booked_date.push(item.date);
		booked_date_ms.push(Date.parse(item.date));
	});
	for (var i = 0; i < booked_date_ms.length; i++) {
		var checkedTime = booked_date_ms[i] - 86400000;
		if (booked_date_ms.indexOf(checkedTime) < 0) {
			firstDay.push(booked_date[i]);
			delete booked_date[i];
		}
	}
};

// prepare calendar html to mount
var calendar =
	'<div class="calendar"><div class="title"><span id="calendar-year"></span><span> / </span><span id="calendar-month"></span><a id="prev" href="">‹</a><a id="next" href="">›</a></div><div class="body"><div class="body-list"><ul><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul></div><div class="body-list"><ul id="days"></ul></div></div></div>';

// load loading frame
$(".loader-inner").loaders(8);

// FUNCTIONS
// input date string "YYYY-MM-DD" to calculate date
var dateCount = function (dateString, count) {
	var dateObj = new Date(dateString);
	dateObj.setDate(dateObj.getDate() + count);

	var yearObj = dateObj.getFullYear();
	var monthObj = dateObj.getMonth();
	var dayObj = dateObj.getDate();
	var localMonthObj = monthObj + 1 < 10 ? "0" + (monthObj + 1) : monthObj + 1;
	var localDateObj = dayObj < 10 ? "0" + dayObj : dayObj;

	return yearObj + "-" + localMonthObj + "-" + localDateObj;
};
// reset
var start = "";
var end = "";
var date = "";
var normal = 0;
var holiday = 0;
var first = "";
var second = "";
var totalPrice = function () {
	return (
		normal * single_room_data.normalDayPrice +
		holiday * single_room_data.holidayPrice
	);
};
var reset = function () {
	start = "";
	end = "";
	date = "";
	normal = 0;
	holiday = 0;
	first = "";
	second = "";
	$("li").removeClass("selectDay");
	$(".warn_name, .warn_tel, .warn_correct_tel, .warn_date").css(
		"display",
		"none"
	);
	$("label").css("margin-bottom", "27px");
	$(".output").css("margin-top", "65px");
};

// when ajax content is loaded
xhr.addEventListener("load", function () {
	// get data
	single_room_data = JSON.parse(xhr.response).room[0];

	// get service status
	for (item in single_room_data.amenities) {
		amenities[item].isActive = single_room_data.amenities[item];
	}

	// get dates have been booked
	showBooked(xhr);

	// mount Vue template
	const mount_vm = vm.mount("#app");

	// loading frame fades out
	$(".loading").addClass("loading_fade_out");
	$(".loading").html("");
	$("body").css("overflow-y", "scroll");

	// NAVBAR
	// listen scroll event to change navbar color
	window.addEventListener(
		"scroll",
		function () {
			var scrollBegin = 0,
				scrollTop = document.body.scrollTop,
				scrollArea = $(".content-body").offset().top - 86,
				topColor = 0,
				bottomColor = 1,
				settingColor;

			// change color
			if (scrollTop > scrollBegin) {
				var ratio =
					(scrollTop - scrollBegin) / (scrollArea - scrollBegin) < -1
						? 1
						: (scrollTop - scrollBegin) /
						  (scrollArea - scrollBegin);
				// change begin
				settingColor = topColor - (topColor - bottomColor) * ratio;
				// get value
				$(".navibar").css({
					"background-color": "rgb(255,255,255," + settingColor + ")",
				});
			}
		},
		true
	);
	// navbar swings
	(function () {
		setTimeout(function () {
			const $body = window.opera
				? document.compatMode == "CSS1Compat"
					? $("html")
					: $("body")
				: $("html,body");
			$($body).animate(
				{
					scrollTop: $(".content-body").offset().top - 86,
				},
				800,
				"swing"
			);
		}, 1000);
	})();

	// GALLERY
	// gallery hover
	$(".pics").on("mouseenter", function () {
		$(".pic").addClass("pic_shadow");
		$(".pic").css("opacity", "1");
	});
	$(".pics").on("mouseleave", function () {
		$(".pic").removeClass("pic_shadow");
	});
	// gallery show
	$(".pic").on("click", function () {
		var id = 0;
		var update_pic = function (num) {
			var index = num + 1;
			$("#img").attr("src", single_room_data.imageUrl[num]);
			$("#img").css("opacity", "1");
			$("#pic_index").text(index + "/3");
		};

		$(".gallery").css("display", "block");
		setTimeout(function () {
			$(".gallery").css("opacity", "1");
		}, 10);
		id = parseInt($(this).attr("data-num"));
		update_pic(id);
		$("body").css("overflow-y", "hidden");

		// gallery picture updaye
		$(".next").on("click", function (e) {
			if (id >= 2) {
				id = 0;
			} else {
				id++;
			}
			$("#img").css("opacity", "0");
			setTimeout(function () {
				update_pic(id);
			}, 150);
			e.stopPropagation();
		});
		$(".pre").on("click", function (e) {
			if (id <= 0) {
				id = 2;
			} else {
				id--;
			}
			$("#img").css("opacity", "0");
			setTimeout(function () {
				update_pic(id);
			}, 150);
			e.stopPropagation();
		});
	});
	$(".gallery").on("click", function () {
		$(".gallery").css("opacity", "0");
		setTimeout(function () {
			$(".gallery").css("display", "none");
		}, 500);
		$("body").css("overflow-y", "scroll");
	});
	$("#img").on("click", function (e) {
		e.stopPropagation();
	});

	// CALENDAR and RESERVATION
	var month_olympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var month_name = [
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
	];

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

	function dayStart(month, year) {
		var tmpDate = new Date(year, month, 1);
		return tmpDate.getDay();
	}
	function daysMonth(month, year) {
		var tmp = year % 4;
		if (tmp == 0) {
			return month_olympic[month];
		} else {
			return month_normal[month];
		}
	}
	function refreshDate() {
		var str = "";
		// how many days that month
		var totalDay = daysMonth(my_month, my_year);
		// what day is the first day of that month
		var firstDay = dayStart(my_month, my_year);
		var myclass;
		// add blank nodes in calendar
		for (var i = 0; i < firstDay; i++) {
			str += "<li></li>";
		}
		// add date nodes in calendar
		for (var i = 1; i <= totalDay; i++) {
			// days have past
			if (
				(i < my_day &&
					my_year == my_date.getFullYear() &&
					my_month == my_date.getMonth()) ||
				my_year < my_date.getFullYear() ||
				(my_year == my_date.getFullYear() &&
					my_month < my_date.getMonth())
			) {
				myclass = " class='days_past'";
				// today
			} else if (
				i == my_day &&
				my_year == my_date.getFullYear() &&
				my_month == my_date.getMonth()
			) {
				myclass = " class='days_non_past today'";
				// days non past
			} else {
				myclass = " class='days_non_past'";
			}

			var month = my_month + 1 < 10 ? "0" + (my_month + 1) : my_month + 1;
			var day = i < 10 ? "0" + i : i;
			var my_ymd =
				" data-ymd='" + my_year + "-" + month + "-" + day + "'";

			str += "<li" + myclass + my_ymd + ">" + i + "</li>";
		}

		// set calendar
		holder.innerHTML = str;
		// set month
		ctitle.innerHTML = month_name[my_month];
		// set year
		cyear.innerHTML = my_year;

		// set booked days
		for (var i = 0; i < booked_date.length; i++) {
			var booked = $("li[data-ymd='" + booked_date[i] + "']");
			if (booked && booked_date[i] >= my_date) {
				booked.removeClass("days_non_past");
				booked.addClass("days_not_selectable");
			}
		}
		for (var i = 0; i < date.length; i++) {
			var selected = $("li[data-ymd='" + date[i] + "']");
			if (selected) {
				selected.addClass("selectDay");
			}
		}
	}
	refreshDate();
	for (var j = 0; j < firstDay.length; j++) {
		$("li[data-ymd='" + firstDay[j] + "']").css(
			"text-decoration",
			"line-through"
		);
	}
	// next month & pre month button
	prev.onclick = function (e) {
		e.preventDefault();
		my_month--;
		if (my_month < 0) {
			my_year--;
			my_month = 11;
		}
		refreshDate();

		var d = document.getElementById("days").children;
		for (var i = 0; i < d.length; i++) {
			var ymd = d[i].getAttribute("data-ymd");
			if (ymd) {
				if (new Date(dateCount(ymd, -90)) > my_date) {
					$("li[data-ymd='" + ymd + "']").removeClass(
						"days_non_past"
					);
					$("li[data-ymd='" + ymd + "']").addClass("days_past");
				}
			}
		}
	};
	next.onclick = function (e) {
		e.preventDefault();
		my_month++;
		if (my_month > 11) {
			my_year++;
			my_month = 0;
		}
		refreshDate();

		var d = document.getElementById("days").children;
		for (var i = 0; i < d.length; i++) {
			var ymd = d[i].getAttribute("data-ymd");
			if (ymd) {
				if (new Date(dateCount(ymd, -90)) > my_date) {
					$("li[data-ymd='" + ymd + "']").removeClass(
						"days_non_past"
					);
					$("li[data-ymd='" + ymd + "']").addClass("days_past");
				}
			}
		}
	};
	// get selected days array
	function getDateStr(startDate, endDate) {
		var str = [startDate];
		normal = 0;
		holiday = 0;
		for (var i = 0; ; i++) {
			var getDate = getTargetDate(startDate);
			startDate = getDate;
			if (getDate <= endDate) {
				str.push(getDate);
				if ($(".dialogue").css("display") == "none") {
					$('[data-ymd="' + getDate + '"]').addClass("selectDay");
				}
			} else {
				var testDay = new Date(startDate).getDay();
				if (testDay >= 2 && testDay <= 5) {
					normal--;
				} else {
					holiday--;
				}
				break;
			}
		}
		date = str;
		console.log(date);
	}
	// get target date string
	function getTargetDate(date) {
		var tempDate = new Date(date);

		var day = tempDate.getDay();
		if (day >= 1 && day <= 4) {
			normal++;
		} else {
			holiday++;
		}

		tempDate.setDate(tempDate.getDate() + 1);
		var year = tempDate.getFullYear();
		var month =
			tempDate.getMonth() + 1 < 10
				? "0" + (tempDate.getMonth() + 1)
				: tempDate.getMonth() + 1;
		var day =
			tempDate.getDate() < 10
				? "0" + tempDate.getDate()
				: tempDate.getDate();
		return year + "-" + month + "-" + day;
	}
	// add class to selected days on calendar
	$(document).on("click", ".days_non_past, .firstDay", function () {
		if (first == "") {
			$(this).addClass("selectDay");
			first = $(this).attr("data-ymd");
		} else if (first != "" && second == "") {
			$(this).addClass("selectDay");
			second = $(this).attr("data-ymd");
			if (second > first) {
				start = first;
				end = second;
				getDateStr(start, end);
			} else if (second == first) {
				second = "";
			} else {
				start = second;
				end = first;
				getDateStr(start, end);
			}
		}
	});

	// reservation frame show
	$("#reserv").on("click", function () {
		$(".dialogue").css("display", "block");
		setTimeout(function () {
			$(".dialogue").css("opacity", "1");
		}, 10);
		$("body").css("overflow-y", "hidden");

		if (second == "") {
			start = first;
		}

		$(".normal").text(normal + "夜");
		$(".holiday").text(holiday + "夜");
		$(".final_price").text("= NT." + totalPrice());

		$("#reserv_start").val(start);
		$("#reserv_end").val(end);

		$("#reserv_start, #reserv_end").attr(
			"min",
			my_year + "-" + localMonth + "-" + localDate
		);
		$("#reserv_start, #reserv_end").attr("max", dateCount(my_date, 90));
		if ($("#reserv_start").val() != "") {
			$("#reserv_end").attr(
				"min",
				dateCount($("#reserv_start").val(), 1)
			);
		}

		$("#reserv_start").on("change", function () {
			start = $("#reserv_start").val();
			$("#reserv_end").attr(
				"min",
				dateCount($("#reserv_start").val(), 1)
			);
			if (end != "") {
				if (
					Date.parse($("#reserv_start").val()) >
					Date.parse($("#reserv_end").val())
				) {
					$("#reserv_end").val("");
					$("#reserv_end").attr("min", $("#reserv_start").val());
				} else {
					getDateStr(start, end);
					$(".normal").text(normal + "夜");
					$(".holiday").text(holiday + "夜");
					$(".final_price").text("= NT." + totalPrice());
				}
			}
		});
		$("#reserv_end").on("change", function () {
			if (start != "") {
				end = $("#reserv_end").val();
				getDateStr(start, end);
				$(".normal").text(normal + "夜");
				$(".holiday").text(holiday + "夜");
				$(".final_price").text("= NT." + totalPrice());
			} else {
				end = $("#reserv_end").val();
			}
		});

		// form validation
		// user name
		$(document).on("input", "#user_name", function () {
			var user_name = $("#user_name").val();
			if (!user_name) {
				$("label[for='name']").css("margin-bottom", "0px");
				$(".warn_name").css("display", "block");
			} else {
				$("label[for='name']").css("margin-bottom", "27px");
				$(".warn_name").css("display", "none");
			}
		});
		// tel
		$(document).on("input", "#tel", function () {
			var tel = $("#tel").val();
			if (!tel) {
				$("label[for='tel']").css("margin-bottom", "0px");
				$(".warn_tel").css("display", "block");
				$(".warn_correct_tel").css("display", "none");
			} else if (!tel.match(/^09[0-9]{8}$/)) {
				$("label[for='tel']").css("margin-bottom", "0px");
				$(".warn_correct_tel").css("display", "block");
				$(".warn_tel").css("display", "none");
			} else {
				$("label[for='tel']").css("margin-bottom", "27px");
				$(".warn_tel").css("display", "none");
				$(".warn_correct_tel").css("display", "none");
			}
		});
		// date
		$(document).on("blur", "#reserv_start", function () {
			if (!start) {
				$("label[for='reserv_date']").css("margin-bottom", "0px");
				$(".output").css("margin-top", "15px");
				$(".warn_date").css("display", "block");
			} else {
				$("label[for='reserv_date']").css("margin-bottom", "27px");
				$(".output").css("margin-top", "65px");
				$(".warn_date").css("display", "none");
			}
		});
		$(document).on("blur", "#reserv_end", function () {
			if (!end) {
				$("label[for='reserv_date']").css("margin-bottom", "0px");
				$(".output").css("margin-top", "15px");
				$(".warn_date").css("display", "block");
			} else {
				$("label[for='reserv_date']").css("margin-bottom", "27px");
				$(".output").css("margin-top", "65px");
				$(".warn_date").css("display", "none");
			}
		});
		// submit button disabled / operable
		$("#user_name, #tel").on("input", function () {
			var user_name = $("#user_name").val();
			var tel = $("#tel").val();

			if (user_name && tel && start && end) {
				if (tel.match(/^09[0-9]{8}$/)) {
					$("#submit").removeAttr("disabled");
					$("#submit").addClass("operable");
				} else {
					$("#submit").attr("disabled", "true");
					$("#submit").removeClass("operable");
				}
			} else {
				$("#submit").attr("disabled", "true");
				$("#submit").removeClass("operable");
			}
		});
		$("#reserv_start, #reserv_end").on("change", function () {
			var user_name = $("#user_name").val();
			var tel = $("#tel").val();

			if (user_name && tel && start && end) {
				if (tel.match(/^09[0-9]{8}$/)) {
					$("#submit").removeAttr("disabled");
					$("#submit").addClass("operable");
				} else {
					$("#submit").attr("disabled", "true");
					$("#submit").removeClass("operable");
				}
			} else {
				$("#submit").attr("disabled", "true");
				$("#submit").removeClass("operable");
			}
		});

		// reservation function
		var reserv = document.querySelector("#submit");
		if (reserv) {
			$(document).on("click", "#submit", function () {
				var obj = { name: "", tel: "", date: "" };
				date.splice(-1, 1);
				obj.name = $("#user_name").val();
				obj.tel = $("#tel").val();
				obj.date = date;

				$("input").val("");
				mount_vm.$data.status = "loading";
				$(".dialogue_frame").ready(function () {
					$(".loader-reserv").loaders(3);
				});

				fetch(get_room_url + room_id, {
					body: JSON.stringify(obj),
					headers: {
						"content-type": "application/json",
						Authorization: token,
						Accept: "application/json",
					},
					method: "post",
				})
					.then(function (res) {
						if (!res.ok) throw new Error(res.statusText);
						return res.json();
					})
					.then(function (res) {
						if (res.success) {
							mount_vm.$data.status = "success";
						} else {
							mount_vm.$data.status = "fail";
						}
					})
					.catch(function (err) {
						mount_vm.$data.status = "fail";
					});
			});
		}
	});
	// return page & cancel button
	$(document).on("click", ".return_page, .cancel", function () {
		$(".dialogue").css("opacity", "0");
		setTimeout(function () {
			$(".dialogue").css("display", "none");
			mount_vm.$data.status = "";
		}, 500);
		$("body").css("overflow-y", "scroll");
		$("input").val("");
		reset();
		$("#submit").attr("disabled", "true");
		$("#submit").removeClass("operable");
	});
	// success button
	$(document).on("click", "#success", function () {
		location.reload();
	});
	// reset button
	$(document).on("click", "#reset", function () {
		reset();
	});
});
