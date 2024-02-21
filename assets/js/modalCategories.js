const endpoint = `http://localhost:3000/products/categories/`;
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
  [modal, fade].forEach((el) => el.classList.toggle("hide"));
};

[openModalButton, closeModalButton, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
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
    const response = await fetch(endpoint, {
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

    // Fecha o modal
    toggleModal();
  } catch (error) {
    console.error(error);
  }
}
