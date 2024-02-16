const endpoint = `http://localhost:3000/suppliers/`;

async function loadSuppliers() {
  try {
    // Faz uma requisição GET para a API
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao carregar o fornecedor", response.statusText);
      // Chama a função para mostrar uma mensagem de erro ao usuário
      alert(
        "Erro ao carregar fornecedores. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Converte para JSON
    const data = await response.json();

    // Chama a função para carregfar os fornecedores na tabela
    loadTableSuppliers(data);
  } catch (error) {
    console.error("Erro ao carregar os fornecedores: ", error);
    alert("Erro ao carregar os fornecedores. Por favor, tente mais tade.");
  }
}

// Função para carregar os dados na tabela da pagina HTML
function loadTableSuppliers(suppliers) {
  try {
    let html = "";

    // Verifique se suppliers está definido e não está vazio
    if (!suppliers || suppliers.length === 0) {
      console.error("Nenhum dado de fornecedor disponível.");
      return;
    }

    // Itera sobre os fornecedores e cria as linhas da tabela
    for (let supplier of Object.values(suppliers)) {
      html += `<tr data-id="${supplier.id}">`;
      html += `<td> ${supplier.id} </td>`;
      html += `<td> ${supplier.name} </td>`;
      html += `<td> ${supplier.email} </td>`;
      html += `<td>
                <a href=# class="primary-color detalhar-link" data-id="${supplier.id}">Detalhar</a> |
                <a href=# class="primary-color excluir-link" data-id="${supplier.id}">Excluir</a>
             </td>`;
      html += `</tr>`;
    }

    // Obtém o elemento tbody da table
    const tbodySuppliersElement = document.getElementById("tbody_suppliers");

    // Atualiza o conteudo do elemento tbody
    if (tbodySuppliersElement) {
      tbodySuppliersElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// Function assíncrona para buscar os detalhes do cliente da API e preencher o formulario
async function loadSupplierDetails(supplierID) {
  try {
    console.log("Buscando detalhes do fornecedor para o ID:", supplierID);

    // Faz uma requisição GET para a API de cliente com o ID específico
    const response = await fetch(`${endpoint}${supplierID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica o status da reposta
    if (response.status === 200) {
      // Converte a resposta para JSON
      const supplierDetails = await response.json();
      console.log("Detalhes do cliente obtido com sucesso:", supplierDetails);

      // Preenche os campos do formulário com os detalhes do fornecedor
      if (supplierDetails.data && supplierDetails.data.length > 0) {
        const supplier = supplierDetails.data[0];

        // Atribuivalores apenas se os campos existirem e o valor não for undefined
        const idElement = document.getElementById("txt_id");
        const nameElement = document.getElementById("txt_name");
        const emailElement = document.getElementById("txt_email");

        if (idElement)
          idElement.value = supplier.id !== undefined ? supplier.id : "";
        if (nameElement)
          nameElement.value = supplier.name !== undefined ? supplier.name : "";
        if (emailElement)
          emailElement.value =
            supplier.email !== undefined ? supplier.email : "";
      } else {
        console.error("Detalhe do cliente indefinidos ou vazios.");
        alert(
          "Detalhe do cliente indefinidos ou vazios. Tente novamente mais tarde."
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

// Aguardo o carregamento completo da página antes de executar algumas ações
document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID do fornecedor da URL
  const supplierID = getParameterByName("id");
  // Se existir um ID de fornecedor na URL, carrega os detalhes desse cliente
  if (supplierID) {
    setTimeout(() => {
      loadSupplierDetails(supplierID);
    }, 100);
  }
});

// Função para obter o parâmetro de consulta da URL
function getParameterByName(name, url) {
  // Se a URL não for fornecoda, ultiliza a URL atual da janela
  if (!url) url = window.location.href;

  //Escapa caracteres especiais na string do nome do parâmetro
  name = name.replace(/[\[\]]/g, "\\$&");

  //! Cria uma expressão regular para encontrar o parâmetro na URL
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

  // Executa a expressão regular na URL
  let results = regex.exec(url);

  // Se não houver correspondência, retorna null(nenhum parâmetro encontrado)
  if (!results) return null;

  // Se o valor do parâmetro não estiver presente, retorna uma string vazia
  if (!results[2]) return "";

  // Decodifica o valor do parâmetro (tratando caracteres especiais, como %20 para espaços)
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Função para redirecionar para a página de detalhes
function redirectToDatails(supplierID) {
  // Rediciona para a página de detalhes com o ID do fornecedor
  window.location.href = `cadastro_suppliers.html?id=${supplierID}`;
}

// Adiciona um ouvinte de evento para cliques na página de detalhes fornecedor
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link de "detalhar" com a classe "detlhar-link"
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const supplierID = event.target.getAttribute("data-id");
    redirectToDatails(supplierID);
  }
});

// Função assíncrona para criar ou atualizar um cliente
async function createSupplier(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtem os valores dos campos dos formulários
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

    // Se for uma atualização(PATCH), adiciona o id ao objeto de dados
    if (id) {
      data.id = id;
    }

    // Faz uma requisição para a API
    const url = id ? `${endpoint}${id}` : `${endpoint}`;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao criar/atualizar cliente", response.statusText);
      alert(
        "Erro ao criar/atualizar cliente. Por favor, tente novemente mais tarde."
      );
      return;
    }

    // Se chegou até aqui, a criação/atualização foi bem sucedida
    console.log("CLiente criado/atualizado com sucesso!");
    alert("Cliente criado/atualizado com sucesso!");

    // Limpa os campos do formulário
    document.getElementById("txt_id").value = "";
    document.getElementById("txt_name").value = "";
    document.getElementById("txt_email").value = "";

    // Recarrega a lista de fornecedores
    loadSuppliers();
  } catch (error) {
    console.error("Erro ao criar/atualizar cliente:", error);
    alert(
      "Erro ao criar/atualizar cliente. Por favor, tente novamente mais tarde."
    );
  }
}

// Função assincrona para excluir um fornecedor
async function deleteSupplier(supplierID) {
  try {
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este fornecedor?"
    );

    if (!confirmDelete) {
      return;
    }

    // Faz a requisição DELETE para a API de fornecedores com o ID especifico
    const response = await fetch(`${endpoint}${supplierID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a exclusão foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao Excluir forncedor:", response.statusText);
      alert(
        "Erro ao excluir fornecedor. Por favor tente novamente mais tarde."
      );
      return;
    }

    // Se chegou até aqui, a exclusão foi bem-sucedida
    console.log("Cliente excluído com sucesso!");
    alert("Cliente excluído com sucesso!");

    // Recarrega a lista de fornecedores
    loadSuppliers();

    // Remove ou ouvinte de eventos do link de "exluir"
    document.removeEventListener("click", deleteLinkClickHandler);

    // Adiciona novamente o ouvinte de evento de click para o "excluir" na página
    document.addEventListener("click", deleteLinkClickHandler);
  } catch (error) {
    console.error(error);
  }
}

// Função para lidar com, cliques no link de "excluir"
function deleteLinkClickHandler(event) {
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const supplierID = event.target.getAttribute("data-id");
    deleteSupplier(supplierID);
  }
}

// Adiciona um ouvinte de evento clique "excluir" na página
document.addEventListener("click", deleteLinkClickHandler);
