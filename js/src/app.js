(function($) {
    $(function() {

        $("#toggle").on("click", function(e) {
            $(this).toggleClass("active");
            $("#ref").toggleClass("active");
        });

        $("#nav-toggle").on("click", function(e) {
            $(this).parent("nav").toggleClass("active");

        });

    });
})(jQuery);;
