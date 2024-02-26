const endpoint = `http://localhost:3000/products/units/`;
const urlCad = `cadastro_units.html?id=`;

// Função assíncrona para carregar os dados das unidades dos produtos
async function loadUnits() {
  try {
    // Faz a Requisição GET para a API
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(
        "Erro ao carregar unidades dos produtos",
        response.statusText
      );
      alert(
        "Erro ao carregar unidades dos produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Converte a resposta para JSON
    const data = await response.json();
    // Chama a função para carregar as unidades na tabela HTML
    loadTableUnits(data);
  } catch (error) {
    console.error("Erro durante o carregamento de unidades:", error);
    alert(
      "Erro ao carregar unidades dos produtos. Por favor, tente novamente mais tarde."
    );
  }
}

// Função para carregar os dados na tabela HTML -> usada dentro do loadUnits
function loadTableUnits(units) {
  try {
    let html = "";
    // Verifica se units está definido ou não está vazia
    if (!units || units.length === 0) {
      console.error("Nenhum dados de unidade disponível.");
      alert("Nenhum dados de categorias disponível.");
      return;
    }

    // Itera sobre as categorias e cria as linhas da tabela
    for (const unity of Object.values(units)) {
      html += `<tr data-id="${unity.id}">`;
      html += `<td>${unity.id}</td>`;
      html += `<td>${unity.description}</td>`;
      html += `<td>
                    <a href="#" class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id="${unity.id}"> Detalhar </a> 
                    <a href="#" class="primary-color excluir-link btn btn-sm btn-outline-danger" data-id="${unity.id}"> Excluir </a> 
                </td>`;
      html += `</tr>`;
    }
    // Obtém o elemento tbody da tabela HTML
    const tbodyUnitsElement = document.getElementById("tbody_units");
    // Atualiza o conteúdo do elemento tbody
    if (tbodyUnitsElement) {
      tbodyUnitsElement.innerHTML = html;
    } else {
      console.error("Elemento tbody_units não encontrado.");
    }
  } catch (error) {
    console.error(error);
  }
}

// Função assíncrona para buscar os detalhes
async function loadUnitDestails(unitId) {
  try {
    console.log("Buscando detalhes do cliente para o ID", unitId);
    // Faz uma resquisição GET para a API, fazendo busca pelo ID
    const response = await fetch(`${endpoint}${unitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verifica o status da resposta
    if (!response.ok) {
      console.error("Detalhes da unidade indefinidos ou vazios.");
      alert(
        "Detalhes do unidade indefinidos ou vazios. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Converte a reposta para JSON se bem-sucedida
    const unitDetails = await response.json();
    console.log(unitDetails.data);
    // Preenche os campos do formulário com os detalhes da categoria
    if (unitDetails.data && unitDetails.data.length > 0) {
      const unit = unitDetails.data[0];
      // Atribui valores apenas se os campos existirem e o valor não for undefined
      const idElement = document.getElementById("txt_id");
      const descriptionElement = document.getElementById("txt_description");
      if (idElement) {
        idElement.value = unit.id !== undefined ? unit.id : "";
      }
      if (descriptionElement) {
        descriptionElement.value =
          unit.description !== undefined ? unit.description : "";
      } else {
        console.error("Detalhes da unidade indefinidos ou vazios.");
        alert(
          "Detalhes do unidade indefinidos ou vazios. Por favor, tente novamente mais tarde."
        );
      }
    }
  } catch (error) {
    console.error("Erro ao obter detalhes da unidade dos produtos:", error);
    alert(
      "Erro ao obter detalhes da unidade. Por favor, tente novamente mais tarde."
    );
  }
}

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

// Função redireciona para a pagina de detalhes
function redirectToDetails(unitId) {
  // Redireciona para o página de detalhes com o id da categoria
  window.location.href = `${urlCad}${unitId}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID da categoria na URL, carrega os detalhes desta categoria
  const unitId = getParameterByName("id");
  // Se existir um ID de unidade na URL, carrega os detalhes desta unidade
  if (unitId) {
    setTimeout(() => {
      loadUnitDestails(unitId);
    });
  }
});

// Função assícrona para cria/atualizar uma unidade de produto
async function createUnit(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Obtém os valores dos campos do formulário
    const id = document.getElementById("txt_id").value;
    const description = document.getElementById("txt_description").value;
    // Determina o metodo com base no valor de ID
    const method = id ? "PATCH" : "POST";
    // Constrói o objeto de dados a ser enviado no corpo da requisição
    const data = {
      description: description,
    };
    // Se tiver ID("PATCH"), adiciona o id no objeto
    if (id) {
      data.id = id;
    }
    // Faz uma requisição para API
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
        "Erro ao criar/atualizar unidade dos produtos:",
        response.statusText
      );
      alert(
        "Erro ao criar/atualizar unidade dos produtos. Por favor, tente novamente mais tarde."
      );
      return;
    }
    console.log("Unidade de produto criado/atualizado com sucesso!");
    alert("Unidade de produto criado/atualizado com sucesso!");

    window.location.href = `http://${window.location.host}/consulta_units.html`;

    loadUnits();
  } catch (error) {
    console.error(error);
  }
}

// Função assícrona para excluir uma unidade de produto
async function deleteUnit(unitId) {
  try {
    // Confirmação do usuário antes da exclusão
    const confirmDelete = confirm(
      "Tem certeza que deseja exclui esta unidade de produtos"
    );
    if (!confirmDelete) {
      return;
    }
    // Faz a requisição DELETE para a API passando o ID
    const response = await fetch(`${endpoint}${unitId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verufuca se a excluão foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao excluir unidade de produto:", response.statusText);
      alert(
        "Erro ao excluir unidade de produto. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Se chegou aqui, a exclusão foi bem-sucedida
    console.log("Categoria excluído com sucesso!");
    alert("Categoria excluído com sucesso!");
    // Recarrega a lista de unidades após a exclusão
    loadUnits();
    // Remove um ouvinte de evento para clique
    document.removeEventListener("click", deleteLinkClickHandler);
    // Adiciona um ouvinte de evento para clique
    document.addEventListener("click", deleteLinkClickHandler);
  } catch (error) {
    console.error("Erro ao excluir unidade de produtos:", error);
    alert(
      "Erro ao excluir unidade de produtos. Por favor, tente novamente mais tarde."
    );
  }
}

function deleteLinkClickHandler(event) {
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o  comportamento padrão do link
    const unitId = event.target.getAttribute("data-id");
    deleteUnit(unitId);
  }
}

// Adiciona um ouvinte de eventos para cliques na pagina
document.addEventListener("click", deleteLinkClickHandler);

// Adiciona um ouvinte de eventos para clique na própia página de consulta para carregar os detalhes da categoria
document.addEventListener("click", function (event) {
  // verifica se o clique foi no link de detalhar com a classe "detalhar-link"
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const unitId = event.target.getAttribute("data-id");
    redirectToDetails(unitId);
  }
});
