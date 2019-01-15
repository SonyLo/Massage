
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

  $(document).ready(function (){
    elemRef = document.getElementsByClassName("nav-link dropdown-toggle")[0]
$("#"+elemRef).hover(
  document.getElementsByClassName("nav-link dropdown-toggle")[0].addClass()
)
  })

 