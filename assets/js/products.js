// Endpoints para a API
let endpointProduct = "http://localhost:3000/products/";
let endpointCategories = "http://localhost:3000/products/categories/";

// Variável global para armazenar as categorias
let categories;

// Função assíncrona para carregar produtos da API
async function loadProducts() {
  try {
    // Faz uma requisição GET para a API de produtos
    const response = await fetch(endpointProduct, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao carregar produtos", response.statusText);
      alert(
        "Erro ao carregar produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Converte a resposta para JSON
    const data = await response.json();

    // Chama a função para carregar os produtos na tabela
    loadTableProducts(data);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    alert("Erro ao carregar produtos. Por favor, tente novamente mais tarde.");
  }
}

// Função para carregar os dados na tabela da página HTML
function loadTableProducts(products) {
  try {
    let html = "";

    // Verifica se 'products' está definido e não está vazio
    if (!products || products.length === 0) {
      console.error("Nenhum dado de produto disponível.");
      return;
    }

    // Itera sobre os produtos e cria as linhas da tabela
    for (let product in products) {
      html += `<tr data-id="${products[product].id}">`;
      html += `<td>${products[product].id}</td>`;
      html += `<td>${products[product].description}</td>`;
      html += `<td>${products[product].amount}</td>`;
      html += `<td>${products[product].unit}</td>`;
      html += `<td>${products[product].category}</td>`;
      html += `<td>
                <a href="#" class="primary-color detalhar-link" data-id="${products[product].id}">Detalhar</a> |
                <a href="#" class="primary-color excluir-link" data-id="${products[product].id}">Excluir</a>
              </td>`;
      html += `</tr>`;
    }

    // Obtém o elemento tbody da tabela
    const tbodyProductsElement = document.getElementById("tbody_products");

    // Atualiza o conteúdo do tbody
    if (tbodyProductsElement) {
      tbodyProductsElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
  }
}

// Aguarda o carregamento completo da página antes de executar qualquer código
document.addEventListener("DOMContentLoaded", function () {
  // Carrega categorias e detalhes do produto
  loadCategoriesAndProductDetails();

  // Adiciona um evento para cliques na página de consulta para carregar os detalhes do produto
  document.addEventListener("click", function (event) {
    // Verifica se o clique foi no link de detalhar com a classe detalhar link
    if (event.target.classList.contains("detalhar-link")) {
      event.preventDefault(); // Impede o comportamento padrão do link
      const productId = event.target.getAttribute("data-id");
      redirectToDetails(productId); // Não é necessário passar 'categories' aqui
    }
  });
});

// Função para obter o parâmetro de consulta da URL
function getParameterByName(name, url) {
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
async function loadProductDetails(productId, categories) {
  try {
    // Adiciona uma verificação se 'categories' está definido e é um array
    if (!categories || !Array.isArray(categories)) {
      console.error("Categorias não fornecidas corretamente.");
      alert("Erro ao carregar categorias. Por favor, tente novamente mais tarde.");
      return;
    }

    console.log("Buscando detalhe do produto para o ID:", productId);
    // Faz uma requisição GET para a API de produto com o ID específico
    const response = await fetch(`${endpointProduct}${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica o status da resposta
    if (response.status === 200) {
      // Converte a resposta para JSON
      const productDetails = await response.json();
      console.log("Detalhes do produto obtidos com sucesso: ", productDetails);

      // Preenche os campos do formulário com os detalhes do produto
      if (productDetails.data && productDetails.data.length > 0) {
        const product = productDetails.data[0];

        // Atribui valores apenas se os campos existirem e o valor não for undefined
        const idElement = document.getElementById("txt_id");
        const descriptionElement = document.getElementById("txt_description");
        const amountElement = document.getElementById("txt_amount");
        const categoryElement = document.getElementById("txt_category");
        const unitElement = document.getElementById("txt_unit");

        if (idElement)
          idElement.value = product.id !== undefined ? product.id : "";
        if (descriptionElement)
          descriptionElement.value =
            product.description !== undefined ? product.description : "";
        if (amountElement)
          amountElement.value =
            product.amount !== undefined ? product.amount : "";
        if (categoryElement) {
          // Limpa as opções atuais do select
          categoryElement.innerHTML = '';
          // Adiciona uma opção padrão
          categoryElement.appendChild(new Option("Selecione a Categoria", ""));
          // Adiciona todas as categorias disponíveis como opções
          categories.forEach((category) => {
            categoryElement.appendChild(new Option(category.description, category.id));
          });
          // Seleciona a categoria correta com base nos detalhes do produto
          categoryElement.value = product.id_category !== undefined ? product.id_category : "";
        }
        if (unitElement)
          unitElement.value = product.unit !== undefined ? product.unit : "";
      } else {
        console.error("Detalhes do produto indefinidos ou vazios");
        alert(
          "Detalhes do cliente indefinidos ou vazios. Por favor, tente novamente mais tarde."
        );
      }
    } else {
      // Exibe uma mensagem de erro se a busca falhar
      console.error("Erro ao obter detalhes do produto:", response.statusText);
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
function redirectToDetails(productId) {
  // Redireciona para página de detalhes com o ID do cliente e categorias
  window.location.href = `cadastro_products.html?id=${productId}`;
}

// Adiciona um evento para cliques na página de consulta para carregar os detalhes do produto
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link de detalhar com a classe detalhar link
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const productId = event.target.getAttribute("data-id");
    // Passa 'categories' como segundo argumento
    redirectToDetails(productId);
  }
});

// Adiciona uma Promise para carregar as categorias
function loadCategories() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(endpointCategories, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Erro ao carregar categorias dos produtos",
          response.statusText
        );
        alert(
          "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
        );
        reject("Erro ao carregar categorias");
        return;
      }

      const dataCategories = await response.json();
      var categorySelect = document.getElementById("txt_category");

      // Verifica se o elemento "txt_category" foi encontrado
      if (!categorySelect) {
        console.error("Elemento 'txt_category' não encontrado.");
        reject("Elemento 'txt_category' não encontrado.");
        return;
      }

      // Adiciona cada categoria como uma opção no elemento select
      dataCategories.forEach((element) => {
        categorySelect.appendChild(new Option(element.description, element.id));
      });

      console.log(categorySelect);
      resolve(dataCategories);
    } catch (error) {
      console.error("Erro durante o carregamento de categorias:", error);
      alert(
        "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
      );
      reject("Erro ao carregar categorias");
    }
  });
}

// Função assíncrona para carregar categorias e detalhes do produto
async function loadCategoriesAndProductDetails() {
  try {
    // Carrega as categorias
    const categories = await loadCategories();

    // Adiciona uma verificação se 'categories' está definido e é um array
    if (categories && Array.isArray(categories)) {
      // Obtém o ID do produto da URL
      const productId = getParameterByName("id");

      // Se houver um ID de produto, carrega os detalhes desse produto
      if (productId) {
        await loadProductDetails(productId, categories);
      }
    } else {
      console.error("Categorias não carregadas corretamente.");
      alert(
        "Erro ao carregar categorias. Por favor, tente novamente mais tarde."
      );
    }
  } catch (error) {
    console.error("Erro ao carregar categorias e detalhes do produto:", error);
    alert(
      "Erro ao carregar categorias e detalhes do produto. Por favor, tente novamente mais tarde."
    );
  }
}


// Adiciona um evento para cliques na página de consulta para carregar os detalhes do produto
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link de detalhar com a classe detalhar link
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const productId = event.target.getAttribute("data-id");
    // Passa 'categories' como segundo argumento
    redirectToDetails(productId);
  }
});

