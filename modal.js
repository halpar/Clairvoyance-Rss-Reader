// Get the modal
var modal = document.getElementById("pop-up");

// Get the button that opens the modal
var btn = document.getElementsByClassName("btnModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// // var input = document.getElementsByClassName("linkInput");
// var input = document.getElementById("linkInput");

// var url = document.getElementById("linkInput").value;

// // Enter'a basıldığında

// input.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    document.getElementById("linkInputBtn").click();
//   }
// });

var thumb =  document.getElementById("thumbnail");

thumb.addEventListener("click" , showModal);


// When the user clicks the button, open the modal 
function showModal(){
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


module.exports = showModal;


