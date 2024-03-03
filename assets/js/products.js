class Product {
    // Variável global para rastrear a página atual na paginação
    currentPage = 1;
    // Número de itens exibidos por página na tabela
    itemsPerPage = 10;
    // Lista de fornecedores atualmente exibidos na página (para paginação)
    products = [];
    // Lista completa de todos os fornecedores disponíveis
    allProducts = [];

  constructor() {
    // Endpoints para a API
    this.endpoint = "http://localhost:3000/products/";
    this.endpointCategories = this.endpoint + "categories/";
    this.endpointUnits = this.endpoint + "units/";

    this.products = []; // Lista de fornecedores exibidos na página (para paginação)
    this.allProducts = []; // Lista completa de todos os fornecedores disponíveis

    this.init();
  }

    // Função para exibir os  com base na página atual
    displayItemsProducts(products) {
      // Atualiza a lista completa de fornecedores com a lista atual
      this.allProducts = products;
      // Calcula o intervalo de fornecedores a serem exibidos na página atual
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      // Filtra a lista completa para obter apenas os fornecedores da página atual
      const paginatedProducts = products.slice(start, end);
      // Carrega a tabela HTML com os fornecedores da página atual
      this.loadTableProducts(paginatedProducts);
      // Cria os botões de paginação com base na lista completa de fornecedores
      this.createPaginationButtons(products);
    }


    // Função para criar os botões de paginação
  createPaginationButtons(products) {
    const totalPages = Math.ceil(products.length / this.itemsPerPage);
    const paginationContainer = document.getElementById("pagination-container");

    paginationContainer.innerHTML = "";

    // Adicione o botão de página anterior
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&laquo;";
    prevButton.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-secondary",
      "mx-1",
      "btn-pagination"
    );
    prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.displayItemsProducts(products);
      }
    });
    paginationContainer.appendChild(prevButton);

    // Adicione o botão de próxima página
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&raquo;";
    nextButton.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-secondary",
      "mx-1",
      "btn-pagination"
    );
    nextButton.addEventListener("click", () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.displayItemsProducts(products);
      }
    });

    // Adicione o elemento para exibir o número total de páginas
    const totalPageElement = document.createElement("div");
    totalPageElement.innerText = `Página ${this.currentPage} de ${totalPages}`;
    totalPageElement.classList.add("total-pages");
    paginationContainer.appendChild(totalPageElement);
    paginationContainer.appendChild(nextButton);
  }

  // Função assíncrona para carregar produtos da API
  // Função assíncrona para carregar os fornecedores da API, com suporte para pesquisa
  async loadProducts(search = "") {
    try {
      // Faz uma requisição GET para o endpoint da API
      const response = await fetch(this.endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Verifica se a resposta é bem-sucedida
      if (!response.ok) {
        console.error("Erro ao carregar o fornecedor", response.statusText);
        alert(
          "Erro ao carregar fornecedores. Por favor, tente novamente mais tarde."
        );
        return;
      }

      // Converte a resposta para JSON
      const data = await response.json();
      let filteredProducts = data;

      // Filtra os fornecedores com base na pesquisa, se houver
      if (search.length > 0) {
        filteredProducts = data.filter((product) =>
          product.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Atualiza a exibição dos fornecedores
      this.displayItemsProducts(filteredProducts);
    } catch (error) {
      console.error("Erro ao carregar os fornecedores: ", error);
      alert("Erro ao carregar os fornecedores. Por favor, tente mais tarde.");
    }
  }

  // Função para carregar os dados na tabela da página HTML
  loadTableProducts(products) {
    try {
      let html = "";
      // Verifica se 'products' está definido e não está vazio
      if (!products || products.length === 0) {
        console.error("Nenhum dado de produto disponível.");
        return;
      }
      // Itera sobre os produtos e cria as linhas da tabela
      for (let product of Object.values(products)) {
        html += `<tr data-id="${product.id}">`;
        html += `<td>${product.id}</td>`;
        html += `<td >${product.description}</td>`;
        html += `<td>${product.amount}</td>`;
        html += `<td>${product.unit}</td>`;
        html += `<td>${product.category}</td>`;
        html += `<td>
                <a href="#" class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id="${product.id}">Detalhar</a> |
                <a href="#" class="primary-color excluir-link btn btn-sm btn-outline-danger" data-id="${product.id}">Excluir</a>
              </td>`;
        html += `</tr>`;
      }
      // Obtém o elemento tbody da tabela
      const tbodyProductsElement = document.getElementById("tbody-products");
      // Atualiza o conteúdo do tbody
      if (tbodyProductsElement) {
        tbodyProductsElement.innerHTML = html;
      }
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error}. Por favor, tente novamente mais tarde.`);
    }
  }

  // Função para obter o parâmetro de consulta da URL
  getParameterByName(name, url) {
    // Se a URL não for fornecida, utiliza a URL atual da janela
    if (!url) url = window.location.href;
    // Escapa caracteres especiais na string do nome do parâmetro
    name = name.replace(/[\[/]]/g, "\\$&");
    // Cria uma expressão regular para encontrar o parâmetro na URL
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    // Executa a expressão regular na URL
    let results = regex.exec(url);
    // Se não houver correspondência, retorna null (nenhum parâmetro encontrado)
    if (!results) return null;
    // Se o valor do parâmetro não estiver presente, retorna uma string vazia
    if (!results[2]) return "";
    // Decodifica o valor do parâmetro (tratando caracteres especiais, como %20 para espaços)
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // Função assíncrona para buscar os detalhes do produto da API e preencher o formulário
  async loadProductDetails(productId, categories, units) {
    console.log("Buscando detalhes do produto para o ID:", productId);
    try {
      document.getElementById("txt_amount").removeAttribute("readonly");
      // Adiciona uma verificação se 'categories' e 'units' está definido e é um array
      if (
        !categories ||
        !Array.isArray(categories) ||
        !units ||
        !Array.isArray(units)
      ) {
        console.error("Categorias ou Unidades não fornecidas corretamente.");
        alert(
          "Erro ao carregar categorias ou unidades. Por favor, tente novamente mais tarde."
        );
        return;
      }
      // Faz uma requisição GET para a API de produto com o ID específico
      const response = await fetch(`${this.endpoint}${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Verifica o status da resposta
      if (response.status === 200) {
        // Converte a resposta para JSON
        const productDetails = await response.json();
        // Preenche os campos do formulário com os detalhes do produto
        if (productDetails.data && productDetails.data.length > 0) {
          const product = productDetails.data[0];
          // Atribui valores apenas se os campos existirem e o valor não for undefined
          const idElement = document.getElementById("txt_id");
          const descriptionElement = document.getElementById("txt_description");
          const amountElement = document.getElementById("txt_amount");
          const categoryElement = document.getElementById("txt_category");
          const unitElement = document.getElementById("txt_unit");
          if (idElement) {
            idElement.value = product.id !== undefined ? product.id : "";
          }
          if (descriptionElement) {
            descriptionElement.value =
              product.description !== undefined ? product.description : "";
          }
          if (amountElement) {
            amountElement.value =
              product.amount !== undefined ? product.amount : "";
          }
          if (categoryElement) {
            // Seleciona a categoria correta com base nos detalhes do produto
            categoryElement.value =
              product.id_category !== undefined ? product.id_category : "";
          }
          if (unitElement) {
            unitElement.value =
              product.id_unit !== undefined ? product.id_unit : "";
          }
        } else {
          console.error("Detalhes do produto indefinidos ou vazios");
          alert(
            "Detalhes do cliente indefinidos ou vazios. Por favor, tente novamente mais tarde."
          );
        }
      } else {
        // Exibe uma mensagem de erro se a busca falhar
        console.error(
          "Erro ao obter detalhes do produto:",
          response.statusText
        );
        alert(
          "Erro ao obter detalhes do produto. Por favor, tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error("Erro ao obter detalhes do produto:", error);
      alert(
        "Erro ao obter detalhes do produto. Por favor, tente novamente mais tarde."
      );
    }
  }

  // Adiciona 'categories' como parâmetro para a função 'redirectToDetails'
  redirectToDetails(productId) {
    // Redireciona para página de detalhes com o ID do cliente e categorias
    window.location.href = `cadastro_products.html?id=${productId}`;
  }

  // Adiciona uma Promise para carregar as categorias
  async loadCategories() {
    try {
      const response = await fetch(this.endpointCategories, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.status !== 200) {
        console.error(
          "Erro ao carregar categorias dos produtos",
          response.statusText
        );
        alert(
          "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
        );
        throw new Error("Erro ao carregar categorias");
      }
      const dataCategories = await response.json();
      this.loadTableCategories(dataCategories);
      return dataCategories
    } catch (error) {
      console.error("Erro durante o carregamento de categorias:", error);
      alert(
        "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
      );
      throw error; // lança o erro novamente
    }
  }

  loadTableCategories(categories) {
    try {
      let html = "";
      if (!categories || categories.length === 0) {
        console.error("Nenhum dado de cateogoria disponível.");
        return;
      }
      categories.forEach((category) => {
        html += `<tr data-id-category="${category.id}">`;
        html += `<td>${category.id}</td>`;
        html += `<td>${category.description}</td>`;
        html += `<td><a href=# class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id-category="${category.id}">Selecionar</a></td>`;
        html += `</tr>`;
      });
      // Obtém elemento tbody da tabela
      const tbodyCategoryProductsElement = document.getElementById(
        "tbody-categories-products"
      );
      if (tbodyCategoryProductsElement) {
        tbodyCategoryProductsElement.innerHTML = html;
      }
      
    } catch (error) {
      console.error("Erro durante o carregamento de categorias:", error);
      alert(
        "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
      );
      reject("Erro ao carregar categorias");
    }
  }

  // Adiciona uma Promise para carregar as unidades
  loadUnits() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(this.endpointUnits, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status !== 200) {
          console.error(
            "Erro ao carregar unidades dos produtos",
            response.statusText
          );
          alert(
            "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
          );
          reject("Erro ao carregar unidades");
          return;
        }
        const dataUnits = await response.json();
        let unitSelect = document.getElementById("txt_unit");
        // Verifica se o elemento "txt_unit" foi encontrado
        if (!unitSelect) {
          console.error("Elemento 'txt_unit' não encontrado.");
          reject("Elemento 'txt_unit' não encontrado.");
          return;
        }
        // Adiciona cada categoria como um option no elemento select
        dataUnits.forEach((unit) => {
          unitSelect.appendChild(new Option(unit.description, unit.id));
        });
        resolve(dataUnits);
      } catch (error) {
        console.error("Erro durante o carregamento de unidade:", error);
        alert(
          "Erro ao carregar unidades  dos produtos. Por favor, tente novamente mais tarde."
        );
        reject("Erro ao carregar unidades");
      }
    });
  }

  // Função assíncrona para carregar categorias e detalhes do produto
  async loadCategoriesAndUnitsAndProductDetails() {
    try {
      // Carrega as categorias
      const categories = await this.loadCategories();
      const units = await this.loadUnits();
      // Adiciona uma verificação se 'categories' está definido e é um array
      if (
        categories &&
        Array.isArray(categories) &&
        units &&
        Array.isArray(units)
      ) {
        // Obtém o ID do produto da URL
        const productId = this.getParameterByName("id");
        // Se houver um ID de produto, carrega os detalhes desse produto
        if (productId) {
          await this.loadProductDetails(productId, categories, units);
        }
      } else {
        console.error("Categorias não carregadas corretamente.");
        alert(
          "Erro ao carregar categorias. Por favor, tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error(
        "Erro ao carregar categorias e detalhes do produto:",
        error
      );
      alert(
        "Erro ao carregar categorias e detalhes do produto. Por favor, tente novamente mais tarde."
      );
    }
  }

  // Função assícrona para criar ou atualizar produto
  async createProduct(event) {
    try {
      event.preventDefault(); // Impede o envio padrão do formulário
      // Obtém os valores dos campos dor formulario
      const id = document.getElementById("txt_id").value;
      const description = document.getElementById("txt_description").value;
      const amount =
        parseFloat(document.getElementById("txt_amount").value) || 0;
      const category = parseFloat(
        document.getElementById("txt_category").value
      );
      const unit = parseFloat(document.getElementById("txt_unit").value);
      // Determina o método com base no valor de ID
      const method = id ? "PATCH" : "POST";
      // Constrói o objeto de dados a ser enviado no corpo da requisição
      const data = {
        description: description,
        amount: amount,
        FkIdUnit: unit,
        FkIdCategory: category,
      };
      // se for uma atualização(PATCH), adiciona o ID no objeto de dados
      if (id) {
        data.id = id;
      }
      // Faz a requisição para a API
      const url = id ? `${this.endpoint}${id}` : `${this.endpoint}`;
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        console.error("Erro ao criar/atualizar produto:", response.statusText);
        alert(
          "Erro ao criar/atualizar produto. Por favor, tente novamente mais tarde."
        );
        return;
      }
      // Se chegou até aqui, a criação/atualização foi bem sucedida
      alert("Produto criado/atualizado com sucesso!");
      window.location.href = `http://${window.location.host}/consulta_products.html`;
      // Recarrega a lista de produtos
      this.loadProducts();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(productId) {
    try {
      // Confirmação do usuário antes de excluir um produto
      const confirmDelete = confirm(
        "Tem certeeza que deseja exlcuir este produto ?"
      );
      if (!confirmDelete) {
        return;
      }
      // Faz a requisição DELETE para a API de produtos com o ID especifico
      const response = await fetch(`${this.endpoint}${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Verifica sea exclusão foi bem-sucedida
      if (!response.ok) {
        console.error("Erro ao excluir produto:", response.statusText);
        alert(
          "Erro ao excluir produto. Por favor, tente novamente mais tarde."
        );
        return;
      }
      // Recarrega a lista de produtps após a exclusão
      await this.loadProducts();
      // Se chegou até aqui, a exclusão foi bem-suicedida
      console.log("Produto excluido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto. Por favor, tente novamente mais tarde.");
    }
  }
  init() {
    // Captura os endereços para comparar e evitar carregar em pagina html errado
    let url = document.location.href;
    let localhost = `http://${window.location.host}/consulta_products.html`;
    if (url !== localhost) {
      // Carrega categorias e detalhes do produto
      this.loadCategoriesAndUnitsAndProductDetails();
      const txtCategory = document.getElementById("txtcategory");
      if (
        window.location.href ==
        `http://${window.location.host}/consulta_products.html`
      ) {
        // Adiciona um evento para cliques na página de consulta para carregar os detalhes do produto
        document.addEventListener("click", (event) => {
          // Verifica se o clique foi no link de detalhar com a classe detalhar link
          if (event.target.classList.contains("detalhar-link")) {
            // Impede o comportamento padrão do link
            event.preventDefault();
            // Obtém o ID do fornecedor a partir do atributo data-id do link
            const productId = event.target.getAttribute("data-id");
            // Chama a função para excluir o fornecedor
            this.redirectToDetails(productId);
          }
          if (event.target.classList.contains("excluir-link")) {
            event.preventDefault(); // Impede o comportamento padrão do link
            const productId = event.target.getAttribute("data-id");
            this.deleteProduct(productId); // Chama a função para ecluir o cliente
          }
        });
      }
    }
  }
}
