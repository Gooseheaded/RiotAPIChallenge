var sumname; 
var region;
var team = new Array();

$(document).ready(function(){
    $('.parallax').parallax();
    $('.slider').slider();
    $('select').material_select();
    
    Materialize.fadeInImage('.login-card');
    
    $('html .getpower').on('click',function(){
       
        $("#row2").animate({
            opacity: 1,
        },1000,"easeInBack", function(){
             $("#row3").animate({
                opacity: 0,
            },1000,"easeInBack", function(){

             });
         });
        
        
        
    });
    
    
    $("#go").click(function(){
    
        sumname = $("#sum-name").val();
        region = $("#region").val();
        
        console.log(sumname+region);
        
        $("#row1").animate({
            opacity: 0,
            top:"40%",
        },1000,"easeInBack", function(){
            var jqxhr = $.get( "/teams/by-summoner-name/"+sumname+"/"+region, function(data) {
              console.log( data );
                
                for(var i = 0; i < data.length; i++){
                    team[i] = data[i];
                    
                    $('#row2').append('<div class="team-wrap s12 col m4"><div class="blue-grey darken-1 team-sq"><div class="circ-wrap"> <div class="team-circ">'+team[i].name.charAt(0)+'</div> <p>'+team[i].name+'</p><p><a data-tid="'+team[i].id+'" class="btn getpower waves-effect waves-light" type="submit">Get Power picks</a>  </div> </div></div>');
                    
                    if(i > 2){
                        $('#row2').append('<div class="team-wrap s12 col m6"><div class="blue-grey darken-1 team-sq"><div class="circ-wrap"> <div class="team-circ">'+team[i].name.charAt(0)+'</div> <p>'+team[i].name+'</p><p><a data-tid="'+team[i].id+'" class="btn getpower waves-effect waves-light" type="submit">Get Power picks</a>  </div> </div></div>');
                    
                    }
                    
                }
                $("#row2").css("display","block");
                $("#row1").css("display","none");
                $("#row2").animate({
                    opacity:1,
            
                },800,"linear",function(){
                
                    
                    $('.getpower').on('click',function(){
                        
                        var id = $(this).data("tid");
                        $("#row2").animate({
                                opacity: 0,
                            },1000,"easeInBack", function(){
                                $("#row2").css("display","none");
                                $("#row3").css("display","block");
                                var jqxhr = $.get( "/teams/by-team-id/"+id+"/"+region, function(data) {
                                    console.log( data );
                                   for (var key in data) {
 
                                    var grade = data[key];

                                        $('#row3').append('<div class="col m3 l2 s6"> <div class="champ-wrap"> <div class="grade-wrap"> <div class="grade-circ"> <p>'+grade+'</p> </div> </div> <div class=" blue-grey darken-4 champ-name"> <p>'+key+'</p> </div> </div> </div>');

                                    }
                                    
                                    
                                    $("#row3").animate({
                                        opacity: 1,
                                    },1000,"easeInBack", function(){



                                    });
                                })
                                .fail(function() {
                                        alert( "error" );
                                });
                   
                        });
                       

            
                    });
                    
                });
            })
            .fail(function() {
                alert( "error" );
            });
       
        });
          
              
             
        
        
    });
       
        
});

