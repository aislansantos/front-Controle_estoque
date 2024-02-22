const endpointCategory = `http://localhost:3000/products/categories/`;
const enpointUnit = `http://localhost:3000/products/units/`;
const openModalButtonCategory = document.querySelector("#open-modal-category");
const openModalButtonUnit = document.querySelector("#open-modal-unit");
const closeModalButtonCategory = document.querySelector(
  "#close-modal-category"
);
const closeModalButtonUnit = document.querySelector("#close-modal-unit");
const modalCategory = document.querySelector("#modal_category");
const modalUnit = document.querySelector("#modal_unit");
const fade = document.querySelector("#fade");

const toggleModalCategory = () => {
  [modalCategory, fade].forEach((el) => el.classList.toggle("hide"));
};

const toggleModalUnit = () => {
  [modalUnit, fade].forEach((el) => el.classList.toggle("hide"));
};

[openModalButtonCategory, closeModalButtonCategory, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModalCategory());
});
[openModalButtonUnit, closeModalButtonUnit, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModalUnit());
});

// Função assincrona para criar/atualizar uma categoria de produto
async function createCategory(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Obtém os valores dos campos do formulário
    const description = document.getElementById(
      "txt_description_category"
    ).value;
    const data = {
      description: description,
    };
    const response = await fetch(endpointCategory, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(
        "Erro ao criar/atualizar categoria dos produtos:",
        response.statusText
      );
      alert(
        "Erro ao criar/atualizar categoria dos produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Se chegou até aqui, a criação/atualização foi bem-sucedida
    console.log("Categoria de produto criado/atualizado com sucesso!");
    alert("Categoria de produto criado/atualizado com sucesso!");

    // limpa o select com os
    var campoSelect = document.getElementById("txt_category");
    campoSelect.innerHTML = "";
    // Recarrega a lista de categoria de produtos
    loadCategories();

    document.getElementById("txt_description_category").value = "";
    // Fecha o modal
    toggleModalCategory();
  } catch (error) {
    console.error(error);
  }
}

// Função assincrona para criar/atualizar uma unidade de produto
async function createUnit(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Obtém os valores dos campos do formulário
    const description = document.getElementById("txt_description_unit").value;
    console.log(description);
    const data = {
      description: description,
    };
    const response = await fetch(enpointUnit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(
        "Erro ao criar/atualizar unidade dos produtos:",
        response.statusText
      );
      alert(
        "Erro ao criar/atualizar unidade dos produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Se chegou até aqui, a criação/atualização foi bem-sucedida
    console.log("Unidade do produto criado/atualizado com sucesso!");
    alert("Unidade de produto criado/atualizado com sucesso!");

    // limpa o select com os
    var campoSelect = document.getElementById("txt_unit");
    campoSelect.innerHTML = "";
    // Recarrega a lista de categoria de produtos
    loadUnits();

    document.getElementById("txt_description_unit").value = "";
    // Fecha o modal
    toggleModalUnit();
  } catch (error) {
    console.error(error);
  }
}
