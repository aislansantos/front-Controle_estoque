// Classe Supplier representa um objeto para gerenciar fornecedores
class Supplier {
  // Variável global para rastrear a página atual na paginação
  currentPage = 1;
  // Número de itens exibidos por página na tabela
  itemsPerPage = 10;
  // Lista de fornecedores atualmente exibidos na página (para paginação)
  suppliers = [];
  // Lista completa de todos os fornecedores disponíveis
  allSuppliers = [];

  // Construtor da classe, recebe o endpoint da API como parâmetro
  constructor(endpoint) {
    // Define o endpoint padrão caso não seja fornecido
    this.endpoint = endpoint || `http://localhost:3000/suppliers/`;
    // Inicializa as variáveis de fornecedores
    this.suppliers = []; // Lista de fornecedores exibidos na página (para paginação)
    this.allSuppliers = []; // Lista completa de todos os fornecedores disponíveis
  }

  // Função para exibir os fornecedores com base na página atual
  displayItems(suppliers) {
    // Atualiza a lista completa de fornecedores com a lista atual
    this.allSuppliers = suppliers;
    // Calcula o intervalo de fornecedores a serem exibidos na página atual
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    // Filtra a lista completa para obter apenas os fornecedores da página atual
    const paginatedSuppliers = suppliers.slice(start, end);
    // Carrega a tabela HTML com os fornecedores da página atual
    this.loadTableSuppliers(paginatedSuppliers);
    // Cria os botões de paginação com base na lista completa de fornecedores
    this.createPaginationButtons(suppliers);
  }

  // Função para criar os botões de paginação
  createPaginationButtons(suppliers) {
    const totalPages = Math.ceil(suppliers.length / this.itemsPerPage);
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
        this.displayItems(suppliers);
      }
    });
    paginationContainer.appendChild(prevButton);

    // // Adicione os botões numerados para cada página
    // for (let i = 1; i <= totalPages; i++) {
    //   const button = document.createElement("button");
    //   button.innerText = i;
    //   button.classList.add(
    //     "btn",
    //     "btn-sm",
    //     "btn-outline-secondary",
    //     "mx-1",
    //     "btn-pagination"
    //   );

    //   button.addEventListener("click", () => {
    //     this.currentPage = i;
    //     this.displayItems(suppliers);
    //   });

    //   paginationContainer.appendChild(button);
    // }

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
        this.displayItems(suppliers);
      }
    });

    // Adicione o elemento para exibir o número total de páginas
    const totalPageElement = document.createElement("div");
    totalPageElement.innerText = `Página ${this.currentPage} de ${totalPages}`;
    totalPageElement.classList.add("total-pages");
    paginationContainer.appendChild(totalPageElement);
    paginationContainer.appendChild(nextButton);
  }

  // Função assíncrona para carregar os fornecedores da API, com suporte para pesquisa
  async loadSuppliers(search = "") {
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
      let filteredSuppliers = data;

      // Filtra os fornecedores com base na pesquisa, se houver
      if (search.length > 0) {
        filteredSuppliers = data.filter((supplier) =>
          supplier.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Atualiza a exibição dos fornecedores
      this.displayItems(filteredSuppliers);
    } catch (error) {
      console.error("Erro ao carregar os fornecedores: ", error);
      alert("Erro ao carregar os fornecedores. Por favor, tente mais tarde.");
    }
  }

  // Função para carregar os dados na tabela HTML
  loadTableSuppliers(suppliers) {
    try {
      let html = "";
      // Verifica se suppliers está definido e não está vazio
      if (!suppliers || suppliers.length === 0) {
        console.error("Nenhum dado de fornecedor disponível.");
        return;
      }
      // Itera sobre os fornecedores e cria as linhas da tabela
      for (let supplier of Object.values(suppliers)) {
        html += `<tr data-id="${supplier.id}">`;
        html += `<td class="text-center"> ${supplier.id} </td>`;
        html += `<td> ${supplier.name} </td>`;
        html += `<td> ${supplier.email} </td>`;
        html += `<td class="text-center">
                <a href=# class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id="${supplier.id}">Detalhar</a>
                <a href=# class="primary-color excluir-link btn btn-sm btn-outline-danger" data-id="${supplier.id}">Excluir</a>
             </td>`;
        html += `</tr>`;
      }

      // Obtém o elemento tbody da tabela
      const tbodySuppliersElement = document.getElementById("tbody_suppliers");
      // Atualiza o conteúdo do elemento tbody
      if (tbodySuppliersElement) {
        tbodySuppliersElement.innerHTML = html;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  // Função para carregar a tabela com base na pesquisa
  loadTableWithSearch(search) {
    try {
      console.log("allSuppliers:", this.allSuppliers);
      console.log("search:", search);

      let html = "";

      // Verifica se allSuppliers está definido e não está vazio
      if (!this.allSuppliers || this.allSuppliers.length === 0) {
        console.error("Nenhum dado de fornecedor disponível.");
        return;
      }

      // Função que verifica se o nome do fornecedor contém a string de busca
      let searchName = (name) => {
        return name.toLowerCase().includes(search.toLowerCase());
      };

      // Filtra os fornecedores mantendo apenas aqueles que atendem à condição da busca
      const filteredSuppliers = this.allSuppliers.filter((element) =>
        searchName(element.name)
      );

      // Adicione a condição para verificar se a array filteredSuppliers está vazia
      if (filteredSuppliers.length === 0) {
        console.log("Nenhum fornecedor correspondente encontrado.");
        // Você pode exibir uma mensagem ou lidar com isso conforme necessário
      } else {
        // Continue com a exibição dos fornecedores filtrados
        this.displayItems(filteredSuppliers);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  // Função assíncrona para buscar os detalhes do fornecedor da API e preencher o formulário
  async loadSupplierDetails(supplierID) {
    try {
      console.log("Buscando detalhes do fornecedor para o ID:", supplierID);

      // Faz uma requisição GET para a API de fornecedor com o ID específico
      const response = await fetch(`${this.endpoint}${supplierID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Verifica o status da resposta
      if (response.status === 200) {
        // Converte a resposta para JSON
        const supplierDetails = await response.json();
        console.log(
          "Detalhes do fornecedor obtidos com sucesso:",
          supplierDetails
        );

        // Preenche os campos do formulário com os detalhes do fornecedor
        if (supplierDetails.data && supplierDetails.data.length > 0) {
          const supplier = supplierDetails.data[0];

          // Atribui valores apenas se os campos existirem e o valor não for undefined
          const idElement = document.getElementById("txt_id");
          const nameElement = document.getElementById("txt_name");
          const emailElement = document.getElementById("txt_email");

          if (idElement)
            idElement.value = supplier.id !== undefined ? supplier.id : "";
          if (nameElement)
            nameElement.value =
              supplier.name !== undefined ? supplier.name : "";
          if (emailElement)
            emailElement.value =
              supplier.email !== undefined ? supplier.email : "";
        } else {
          console.error("Detalhes do fornecedor indefinidos ou vazios.");
          alert(
            "Detalhes do fornecedor indefinidos ou vazios. Tente novamente mais tarde."
          );
        }
      } else {
        // Exibe uma mensagem de erro se a busca falhar
        console.error(
          "Erro ao obter detalhes do fornecedor:",
          response.statusText
        );
        alert(
          "Erro ao obter detalhes do fornecedor. Por favor, tente novamente mais tarde."
        );
      }
    } catch (error) {
      console.error("Erro ao obter detalhes do fornecedor:", error);
      alert(
        "Erro ao obter detalhes do fornecedor. Por favor, tente novamente mais tarde."
      );
    }
  }

  // Função para obter o parâmetro de consulta da URL
  getParameterByName(name, url) {
    // Se a URL não for fornecida, utiliza a URL atual da janela
    if (!url) url = window.location.href;
    // Escapa caracteres especiais na string do nome do parâmetro
    name = name.replace(/[\[\]]/g, "\\$&");
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

  // Função para redirecionar para a página de detalhes
  redirectToDetails(supplierID) {
    // Redireciona para a página de detalhes com o ID do fornecedor
    window.location.href = `cadastro_suppliers.html?id=${supplierID}`;
  }

  // Função assíncrona para criar ou atualizar um fornecedor
  async createSupplier(event) {
    try {
      event.preventDefault(); // Impede o envio padrão do formulário
      // Obtém os valores dos campos do formulário
      const id = document.getElementById("txt_id").value;
      const name = document.getElementById("txt_name").value;
      const email = document.getElementById("txt_email").value;
      // Determina o método com base no valor do ID
      const method = id ? "PATCH" : "POST";
      // Constrói o objeto de dados a ser enviado no corpo da requisição
      const data = {
        name: name,
        email: email,
      };
      // Se for uma atualização (PATCH), adiciona o id ao objeto de dados
      if (id) {
        data.id = id;
      }
      // Faz uma requisição para a API
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
        console.error(
          "Erro ao criar/atualizar fornecedor",
          response.statusText
        );
        alert(
          "Erro ao criar/atualizar fornecedor. Por favor, tente novamente mais tarde."
        );
        return;
      }
      // Se chegou até aqui, a criação/atualização foi bem-sucedida
      console.log("Fornecedor criado/atualizado com sucesso!");
      alert("Fornecedor criado/atualizado com sucesso!");
      // Limpa os campos do formulário
      document.getElementById("txt_id").value = "";
      document.getElementById("txt_name").value = "";
      document.getElementById("txt_email").value = "";
      // Recarrega a lista de fornecedores
      this.loadSuppliers();
      // Redireciona para a página de consulta de fornecedores
      window.location.href = `http://${window.location.host}/consulta_suppliers.html`;
    } catch (error) {
      console.error("Erro ao criar/atualizar fornecedor:", error);
      alert(
        "Erro ao criar/atualizar fornecedor. Por favor, tente novamente mais tarde."
      );
    }
  }

  // Função assíncrona para excluir um fornecedor
  async deleteSupplier(supplierID) {
    try {
      // Pede confirmação antes de excluir o fornecedor
      const confirmDelete = confirm(
        "Tem certeza que deseja excluir este fornecedor?"
      );

      if (!confirmDelete) {
        return;
      }

      // Faz a requisição DELETE para a API de fornecedores com o ID específico
      const response = await fetch(`${this.endpoint}${supplierID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Verifica se a exclusão foi bem-sucedida
      if (!response.ok) {
        console.error("Erro ao excluir fornecedor:", response.statusText);
        alert(
          "Erro ao excluir fornecedor. Por favor tente novamente mais tarde."
        );
        return;
      }

      // Se chegou até aqui, a exclusão foi bem-sucedida
      console.log("Fornecedor excluído com sucesso!");
      alert("Fornecedor excluído com sucesso!");

      // Recarrega a lista de fornecedores
      this.loadSuppliers();
    } catch (error) {
      console.error(error);
    }
  }

  // Função de inicialização, aguarda o carregamento completo da página antes de executar algumas ações
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      // Obtém o ID do fornecedor da URL
      const supplierID = this.getParameterByName("id");
      // Se existir um ID de fornecedor na URL, carrega os detalhes desse fornecedor
      if (supplierID) {
        setTimeout(() => {
          this.loadSupplierDetails(supplierID);
        }, 100);
      }
    });

    // Verifica se a página atual é a página de consulta de fornecedores
    if (
      window.location.href ==
      `http://${window.location.host}/consulta_suppliers.html`
    ) {
      // Obtém a referência para o elemento txtSearch
      const txtSearch = document.getElementById("txt_search_supplier");

      // Verifica se txtSearch foi encontrado antes de adicionar ouvintes de eventos
      if (txtSearch) {
        // Adiciona um ouvinte para o evento de clique nos links de detalhes
        document.addEventListener("click", (event) => {
          if (event.target.classList.contains("detalhar-link")) {
            event.preventDefault();
            const supplierID = event.target.getAttribute("data-id");
            this.redirectToDetails(supplierID);
          }
        });

        // Adiciona um ouvinte para o evento de clique nos links de exclusão
        document.addEventListener("click", (event) => {
          if (event.target.classList.contains("excluir-link")) {
            event.preventDefault();
            const supplierID = event.target.getAttribute("data-id");
            this.deleteSupplier(supplierID);
          }
        });

        // Adiciona um ouvinte para o evento keyup no campo de pesquisa
        if (txtSearch) {
          txtSearch.addEventListener("keyup", () => {
            const search = txtSearch.value;
            if (search.length === 0) {
              this.loadSuppliers(); // Carrega todos os fornecedores se a pesquisa for vazia
            } else {
              this.loadTableWithSearch(search);
            }
          });
        }
      } else {
        console.error("Elemento txtSearch não encontrado");
      }
    }
  }
}

// Cria uma instância única da classe Supplier se ainda não existir
let supplierInstance;

if (typeof supplierInstance === "undefined") {
  supplierInstance = new Supplier();
  supplierInstance.init();
}