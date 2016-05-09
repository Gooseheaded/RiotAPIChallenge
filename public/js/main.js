$(document).ready(function(){
    $('.parallax').parallax();
    $('.slider').slider();
    $('select').material_select();
    
    Materialize.fadeInImage('.login-card');
    
    
    $("#go").click(function(){
    
       
        $("#row1").animate({
            opacity: 0,
            top:"40%",
        },1000,"easeInBack", function(){
            $(this).remove();
            $("#row2").css("display","block");
            $("#row2").animate({
                opacity:1,
            
            },800,"linear",function(){
            
       
            });
            
        });
        
        
        
       
        
    });

    
});

