(function($) {
    $(function() {

        var $doc = $(document);
        var $body = $("body");

        $("#toggle").on("click", function(e) {
            $(this).toggleClass("active");
            $("#ref").toggleClass("active");
        });

        $("#nav-toggle").on("click", function(e) {
            $(this).parent("nav").toggleClass("active");
            if ($(this).parent("nav").hasClass("active")) {
                $body.addClass("lock");
            } else {
                $body.removeClass("lock");
            }
        });


        var current = "";
        var sections = {};

        function initSections() {
            $(".section").each(function(i,v) {
                var $v = $(v);
                var id = $v.attr("id");
                var top = $v.position().top;
                // var h = $v.outerHeight();
                // var bottom = top + h;

                sections[id] = {
                    // h: h,
                    top: top,
                    // bottom: bottom,
                }

                switch (id) {
                    case "navigation":
                        sections[id].enter = function() {
                        $("#navigation nav").addClass("show");
                    };

                    sections[id].leave = function() {
                        $("#navigation nav").removeClass("show");
                    };

                    break;

                    case "accordion":
                        sections[id].enter = function() {
                        $("#accordion .arc-accordion").addClass("show");
                    };

                    sections[id].leave = function() {
                        $("#accordion .arc-accordion").removeClass("show");
                    };

                    break;
                }
            });
        }

        initSections();

        function onScroll() {
            var st = $doc.scrollTop();
            _.each(sections, function(n,k) {
                if (st >= n.top-120 && current !== k) {
                    if (_.has(sections, current) && typeof sections[current].leave !== "undefined") 
                        sections[current].leave();
                    if (typeof sections[k].enter !== "undefined") 
                        sections[k].enter();

                    current = k;
                }
            });
        }

        $doc.on("scroll", onScroll);

        $(".arc-accordion li").each(function(i,v) {
            var $li = $(v);
            $li.on("click", function(e) {
                $li.toggleClass("active");
                var $ul = $li.find("> ul");
                if ($li.hasClass("active")) {
                    $(".arc-accordion").addClass("active");
                    $li.siblings().removeClass("active");
                    TweenMax.to($li.siblings().find("> ul"), 0.4, {
                        height: 0,
                    });

                    var title = $li.find("> span").text();
                    $(".arc-accordion-title span").text(title);
                    TweenMax.set($ul, {height:"auto"});
                    TweenMax.from($ul, 0.4, {
                        height:0,
                        onComplete: function() {
                            initSections();
                        }
                    });
                } else {
                    $(".arc-accordion").removeClass("active");
                    TweenMax.to($ul, 0.4, {
                        height: 0,
                        onComplete: function() {
                            initSections();
                        }
                    });
                }
            });
        });

        $(".arc-accordion-close").on("click", function(e) {
            $(".arc-accordion li.active").trigger("click");
        });

        var $popup = $("#popup");
        var popupShow = false;
        var tl = new TimelineLite({paused:true});
        tl.to($popup, 0.01, {display:"block"})
        tl.to($popup, 0.4, {opacity: 1})
        $popup.animation = tl;

        $("#trigger-modal").on("click", function(e) {
            $popup.animation.play();
            $body.addClass("lock");

        });

        $popup.find("a.btn-small").on("click", function() {
            $popup.animation.reverse();
            $body.removeClass("lock");
        })



        $("#tabs svg text").on("click", function(e) {
            var $this = $(this);
            $this.parent("g").addClass("active").siblings().removeClass("active");
            var target = $this.attr("data-target");
            $("#" + target).addClass("active").siblings().removeClass("active");

        });


        var mySwiper = new Swiper(".swiper-container", {
            pagination: ".swiper-pagination"
        });

    });
})(jQuery);;
