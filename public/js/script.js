// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
});
let taxSwitch=document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click",()=>{
    let tax_info=document.getElementsByClassName("tax-info");
    for(info of tax_info){
        if(info.style.display!="inline"){
            info.style.display="inline";
        }
        else{
            info.style.display="none";
        }
    }
});
const filters = document.getElementById("filtersContainer");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

rightBtn.addEventListener("click", () => {
    filters.scrollBy({
        left: 300,
        behavior: "smooth"
    });
});

leftBtn.addEventListener("click", () => {
    filters.scrollBy({
        left: -300,
        behavior: "smooth"
    });
});

// Single scroll listener for both arrows
filters.addEventListener("scroll", () => {
    const scrollLeft = filters.scrollLeft;
    const maxScrollLeft = filters.scrollWidth - filters.clientWidth;

    // Hide left button if at the left-most edge
    leftBtn.classList.toggle("d-none", scrollLeft <= 0);

    // Hide right button if at the right-most edge
    rightBtn.classList.toggle("d-none", scrollLeft >= maxScrollLeft - 1);
});

// Initialize arrow visibility on page load
const initArrows = () => {
    const scrollLeft = filters.scrollLeft;
    const maxScrollLeft = filters.scrollWidth - filters.clientWidth;

    leftBtn.classList.toggle("d-none", scrollLeft <= 0);
    rightBtn.classList.toggle("d-none", scrollLeft >= maxScrollLeft - 1);
};

initArrows();