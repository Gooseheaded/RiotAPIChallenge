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
                    team[data[i].id] = data[i];
                   
                    
                    if(i > 2){
                        $('#row2').append('<div class="team-wrap s12 col m6"><div class="blue-grey darken-1 team-sq"><div class="circ-wrap"> <div class="team-circ">'+team[data[i].id].name.charAt(0)+'</div> <p>'+team[data[i].id].name+'</p><p><a data-tid="'+team[data[i].id].id+'" class="btn getpower waves-effect waves-light" type="submit">Get Power picks</a>  </div> </div></div>');
                    
                    }else{
	                     
                    $('#row2').append('<div class="team-wrap s12 col m4"><div class="blue-grey darken-1 team-sq"><div class="circ-wrap"> <div class="team-circ">'+team[data[i].id].name.charAt(0)+'</div> <p>'+team[data[i].id].name+'</p><p><a data-tid="'+team[data[i].id].id+'" class="btn getpower waves-effect waves-light" type="submit">Get Power picks</a>  </div> </div></div>');
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
                                 swal({
        title: 'Getting Power',
        text: '<i class="fa fa-4x fa-cog fa-spin"></i>',
        timer: 40000,
        inputClass: 'loading',
        showConfirmButton: false,
        allowOutsideClick: false,
        
        
    });
                                var jqxhr = $.get( "/teams/by-team-id/"+id+"/"+region, function(data) {
                                    console.log( team );
                                   
                                   for (var key in data) {
                                    
                                    var tempkey;
                                    if (key == "LeBlanc"){
	                                    tempkey = "Leblanc";
	                                    
                                    }else if (key == "Kha'Zix"){
	                                    tempkey = "Khazix";
                                    }else{
	                                    tempkey = key.replace(/[\s\'\`\´\.]/g,"");
                                    }
								   	
                                    var grade = data[key];
                                       $('#tname-label').html(team[id].name + " Power Picks <i class='material-icons '>flash_on</i>");
                                        $('#row3').append('<div class="col m3 l2 s6"> <div class="champ-wrap">  <img class="champ-img" src="http://ddragon.leagueoflegends.com/cdn/img/champion/loading/'+tempkey+'_0.jpg"/>  <div class="grade-wrap"> <div class="grade-circ"> <p>'+grade+'</p> </div> </div> <div class=" blue-grey darken-4 champ-name"> <p>'+key+'</p> </div> </div> </div>');

                                    }
                                    
                                    
                                    $("#row3").animate({
                                        opacity: 1,
                                    },1000,"easeInBack", function(){
											
                                             swal.close() 

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

