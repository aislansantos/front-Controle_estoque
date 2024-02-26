// referente ao modal de suppliers
const endpointSuppliers = `http://localhost:3000/suppliers`;
const openModalButtonSupplier = document.querySelector("#open-modal-supplier");
const closeModalButtonSupplier = document.querySelector(
  "#close-modal-supplier"
);

// referente ao modal de suppliers
const modalSupplier = document.querySelector("#modal_suplliers");
const fade = document.querySelector("#fade");

const toggleModalSupplier = () => {
  [modalSupplier, fade].forEach((el) => el.classList.toggle("hide"));
};

[openModalButtonSupplier, closeModalButtonSupplier, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModalSupplier());
});

// referente ao modal de suppliers
