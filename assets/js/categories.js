const endpoint = `http://localhost:3000/products/categories/`;
const urlCad = `cadastro_category.html?id=`;

// Função assincrona para carrgegar os dados das categorias de produtos
async function loadCategories() {
  try {
    // Faz a resuisição GET para a API
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(
        "Erro ao carregar categorias dos produtos",
        response.statusText
      );
      alert(
        "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Converte a resposta para JSON
    const data = await response.json();
    // Chama a função para carregar os clientes na tabela
    loadTableCategories(data);
  } catch (error) {
    console.error("Erro durante o carregamento de categorias:", error);
    alert(
      "Erro ao carregar categorias dos produtos. Por favor, tente novamente mais tarde."
    );
  }
}

// Função para carregar os dados na tabela HTML -> usado dento do loadCategories()
function loadTableCategories(categories) {
  try {
    let html = "";
    // Verifica se categories está definido e não está vazio
    if (!categories || categories.length === 0) {
      console.error("Nenhum dados de categorias disponível.");
      alert("Nenhum dados de categorias disponível.");
      return;
    }
    // Itera sobre as categorias e cria as linhas da tabela
    for (category of Object.values(categories)) {
      html += `<tr data-id="${category.id}">`;
      html += `<td>${category.id}</td>`;
      html += `<td>${category.description}</td>`;
      html += `<td>
                <a href="#" class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id="${category.id}"> Detalhar </a> | 
                <a href="#" class="primary-color excluir-link btn btn-sm btn-outline-danger" data-id="${category.id}"> Excluir </a> 
              </td>`;
      html += `</tr>`;
    }
    // Obtém o elemento tbody da tabela HTML
    const tbodyCategoriesElement = document.getElementById("tbody_categories");
    // Atualiza o conteúdo do elemento tbody
    if (tbodyCategoriesElement) {
      tbodyCategoriesElement.innerHTML = html;
    } else {
      console.error("Elemento tbody_categories não encontrado.");
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// Função assíncrona para buscar os detalhes da categoria do cliente para preencher o formulario para atualização de cadastro
async function loadCategoryDetails(categoryId) {
  try {
    console.log("Buscando detalhe do cliente para o ID:", categoryId);
    // Faz uma requisição GET para a API buscando pelo ID
    const response = await fetch(`${endpoint}${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verifica o status da resposta
    if (!response.ok) {
      console.error("Detalhes da categoria indefinidos ou vazios.");
      alert(
        "Detalhes do categoria indefinidos ou vazios. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Converte a resposta para JSON se bem sucedida
    const categoryDetails = await response.json();

    // Preenche os campos do formulário com os detaljes da categoria
    if (categoryDetails.data && categoryDetails.data.length > 0) {
      const category = categoryDetails.data[0];
      // Atribui valores apenas se os campos existiram e o valor não for undefined
      const idElement = document.getElementById("txt_id");
      const descriptionElement = document.getElementById("txt_description");
      if (idElement) {
        idElement.value = category.id !== undefined ? category.id : "";
      }
      if (descriptionElement) {
        descriptionElement.value =
          category.description !== undefined ? category.description : "";
      } else {
        console.error("Detalhes da categoria indefinidos ou vazios.");
        alert(
          "Detalhes do categoria indefinidos ou vazios. Por favor, tente novamente mais tarde."
        );
      }
    }
  } catch (error) {
    console.error("Erro ao obter detalhes da categoria dos produtos:", error);
    alert(
      "Erro ao obter detalhes da categoria. Por favor, tente novamente mais tarde."
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID da categoria na URL, carrega os detalhes desta categoria
  const categoryId = getParameterByName("id");
  // Se existir um ID de categoria na URL, carrega os detalhes desta categoria
  if (categoryId) {
    setTimeout(() => {
      loadCategoryDetails(categoryId);
    }, 100);
  }
});

// Função para obter o parâmetro de consulta URL
function getParameterByName(name, url) {
  // Se a URL não for fornecida, ultiliza a URL atual da janela
  if (!url) url = window.location.href;
  // Escapa caracteres epeciais na string do nome do parametro
  name = name.replace(/[/[\]]/g, "\\$&");
  //! Cria uma expressão regular para encontrar o parametro na URL
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  // Executa a expressão regular na URL
  let results = regex.exec(url);
  // Se não houver correspondencia, retorna null(nenhum parametro encontrado)
  if (!results) return null;
  // Se o valor do paramentro não estiver presente retorna uma strinf vazia
  if (!results[2]) return "";
  // Decodifica o valor do parâmetro(tratando caracteres epeciais, como %20 para espaços)
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Função para reirecionar para a página de detalhes
function redirectToDetails(categoryId) {
  //Redireciona para a página de detalhes com o ID da categoria
  window.location.href = `${urlCad}${categoryId}`;
}

// Adiciona um ouvinte de eventos para clique na própia página de consulta para carregar os detalhes da categoria
document.addEventListener("click", function (event) {
  // verifica se o clique foi no link de detalhar com a classe "detalhar-link"
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const categoryId = event.target.getAttribute("data-id");
    redirectToDetails(categoryId);
  }
});

// Função assincrona para criar/atualizar uma categoria de produto
async function createCategory(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Obtém os valores dos campos do formulário
    const id = document.getElementById("txt_id").value;
    const description = document.getElementById("txt_description").value;
    // Dertemina o método com base no valor de ID
    const method = id ? "PATCH" : "POST";
    // Constrói o objeto de dados a ser enviado no corpo da requisição
    const data = {
      description: description,
    };
    // Se uma atualização (PATCH), adicione o id ao objeto
    if (id) {
      data.id = id;
    }
    // Faz uma requisição para a API
    const url = id ? `${endpoint}${id}` : endpoint;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);
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

    window.location.href = `http://${window.location.host}/consulta_categories.html`;

    // Recarrega a lista de categoria de produtos
    loadCategories();
  } catch (error) {
    console.error(error);
  }
}

// Função assícrona para ecluir uma categoria de produto
async function deleteCategory(categoryId) {
  try {
    // Confirmação do usuário antes de excluir
    const confirmDelete = confirm(
      "Tem certez que deseja excluir esta categoria de Produtos"
    );
    if (!confirmDelete) {
      return;
    }
    // Faz a requisição DELETE para a API com o ID especifico
    const response = await fetch(`${endpoint}${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verifica se a exclusão foi bem-sucedida
    if (!response.ok) {
      console.error(
        "Erro ao excluir categoria de produto:",
        response.statusText
      );
      alert(
        "Erro ao excluir categoria de produto. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Se chegou até aqui, a exclusão foi bem-sucedida
    console.log("Categoria excluído com sucesso!");
    alert("Categoria excluído com sucesso!");
    // Recarrega a lista de categorias após a exclusão
    loadCategories();
    // Remove um ouvinte de evento para cliques na página
    document.removeEventListener("click", deleteLinkClickHandler);
    // Adiciona um ouvinte de evento para cliques na página
    document.addEventListener("click", deleteLinkClickHandler);
    console.log();
  } catch (error) {
    console.error("Erro ao excluir categoria de produtos:", error);
    alert(
      "Erro ao excluir categoria de produtos. Por favor, tente novamente mais tarde."
    );
  }
}

function deleteLinkClickHandler(event) {
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const categoryId = event.target.getAttribute("data-id");
    deleteCategory(categoryId); // chama a função para exckuir a categoria
  }
}

// Adiciona um ouvinte de evento para cliques na página
document.addEventListener("click", deleteLinkClickHandler);
