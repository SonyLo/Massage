
$('.carousel').carousel({
    interval: 2000
  })


  function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

 
$(document).ready(function(){
  $("#liDropdown").hover( ()=>{
    if($("#liDropdown").hasClass("show")){
      $("#liDropdown").removeClass("show")
      $("#divDropdown-menu").removeClass("show")
      document.getElementById("navbarDropdown1").setAttribute("aria-expanded", "false")

    }else{
      document.getElementById("liDropdown").setAttribute("class","nav-item dropdown show")
      document.getElementById("navbarDropdown1").setAttribute("aria-expanded", "true")
      document.getElementById("divDropdown-menu").setAttribute("class","dropdown-menu show")
    } 

  } 
)
})
  