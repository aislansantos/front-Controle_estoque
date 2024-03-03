class ProductModal {
  constructor() {
    this.endpointCategory = "http://localhost:3000/products/categories/";
    this.endpointUnit = "http://localhost:3000/products/units/";
    // Botão abrir e fechar modal cadastro de categorias e corpo do modal
    this.openModalButtonCategoryCad = document.getElementById(
      "open-modal-category-cad"
    );
    this.closeModalButtonCategoryCad = document.getElementById(
      "close-modal-category-cad"
    );
    this.modalCategoryCad = document.getElementById("modal-category-cad");
    // Campo de abrir modal e botão de fechar modal busca categorias e corpo do modal de search categoria
    this.openModalTxtCategorySearch = document.getElementById("txt_category");
    this.closeModalButtonCategorySearch = document.getElementById(
      "close-modal-category-search"
    );
    this.modalCategorySearch = document.querySelector("#modal-category-search");
    // Botáo de abir e botão de fechar modal unidade, e corpo do modal unidade
    this.closeModalButtonUnit = document.getElementById("close-modal-unit");
    this.openModalButtonUnit = document.getElementById("open-modal-unit");
    this.modalUnit = document.getElementById("modal_unit");
    // Fundo modal - responsavel por escurercer o fundo da página
    this.fade = document.getElementById("fade");
  }

  initEventListeners() {
    
    this.openModalButtonCategoryCad.addEventListener("click", () =>
      this.toggleModalCategoryCad()
    );
    this.closeModalButtonCategoryCad.addEventListener("click", () =>
      this.toggleModalCategoryCad()
    );
    this.fade.addEventListener("click", () => this.toggleModalCategoryCad());

    this.openModalButtonUnit.addEventListener("click", () =>
      this.toggleModalUnit()
    );
    this.closeModalButtonUnit.addEventListener("click", () =>
      this.toggleModalUnit()
    );
    this.fade.addEventListener("click", () => this.toggleModalUnit());

    this.openModalTxtCategorySearch.addEventListener("dblclick", () =>
      this.toggleModalCategorySearch()
    );
    this.closeModalButtonCategorySearch.addEventListener("click", () =>
      this.toggleModalCategorySearch()
    );
  }

  toggleModalCategoryCad = () => {
    [this.modalCategoryCad, this.fade].forEach((el) =>
      el.classList.toggle("hide")
    );
  };

  toggleModalUnit = () => {
    [this.modalUnit, this.fade].forEach((el) => el.classList.toggle("hide"));
  };

  toggleModalCategorySearch = () => {
    [this.modalCategorySearch, this.fade].forEach((el) =>
      el.classList.toggle("hide")
    );
  };

  // Função assincrona para criar/atualizar uma categoria de produto
  async createCategory(event) {
    try {
      event.preventDefault(); // Impede o envio padrão do formulário
      // Obtém os valores dos campos do formulário
      const description = document.getElementById(
        "txt-description-category-cad"
      ).value;
      const data = {
        description: description,
      };
      const response = await fetch(this.endpointCategory, {
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

      product.loadCategories();

      document.getElementById("txt-description-category-cad").value = "";
      // Fecha o modal
      this.toggleModalCategoryCad();
    } catch (error) {
      console.error(error);
    }
  }

  // Função assincrona para criar/atualizar uma unidade de produto
  async createUnit(event) {
    try {
      event.preventDefault(); // Impede o envio padrão do formulário
      // Obtém os valores dos campos do formulário
      const description = document.getElementById("txt_description_unit").value;
      console.log(description);
      const data = {
        description: description,
      };
      const response = await fetch(this.endpointUnit, {
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
      product.loadUnits();

      document.getElementById("txt_description_unit").value = "";
      // Fecha o modal
      this.toggleModalUnit();
    } catch (error) {
      console.error(error);
    }
  }
}
// Criar uma instância da classe para iniciar o código
const productModal = new ProductModal();
