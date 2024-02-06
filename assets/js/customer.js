const endpoint = `http://localhost:3000/customers/`;
// Função assíncrona para carregar os clientes da API
async function loadCustomers() {
  try {
    // Faz uma requisição GET para a API de clientes
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao carregar clientes:", response.statusText);
      // Chama a função exibirErro para mostrar uma mensagem de erro ao usuário
      exibirErro(
        "Erro ao carregar clientes. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Converte a resposta para JSON
    const data = await response.json();

    // Chama a função para carregar os clientes na tabela
    loadTableCustomers(data);
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    // Chama a função exibirErro em caso de erro durante a requisição
    exibirErro(
      "Erro ao carregar clientes. Por favor, tente novamente mais tarde."
    );
  }
}

// Função assíncrona para buscar os detalhes do cliente da API e preencher o formulário
async function loadCustomerDetails(customerId) {
  try {
    console.log("Buscando detalhes do cliente para o ID:", customerId);

    // Faz uma requisição GET para a API de clientes com o ID específico
    const response = await fetch(`${endpoint}${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica o status da resposta
    if (response.status === 200) {
      // Converte a resposta para JSON
      const customerDetails = await response.json();
      console.log("Detalhes do cliente obtidos com sucesso:", customerDetails);

      // Preenche os campos do formulário com os detalhes do cliente
      if (customerDetails.data && customerDetails.data.length > 0) {
        const customer = customerDetails.data[0];

        // Atribui valores apenas se os campos existirem e o valor não for undefined
        const idElement = document.getElementById("txt_id");
        const nameElement = document.getElementById("txt_name");
        const emailElement = document.getElementById("txt_email");
        const cityElement = document.getElementById("txt_city");

        if (idElement)
          idElement.value = customer.id !== undefined ? customer.id : "";
        if (nameElement)
          nameElement.value = customer.name !== undefined ? customer.name : "";
        if (emailElement)
          emailElement.value =
            customer.email !== undefined ? customer.email : "";
        if (cityElement)
          cityElement.value = customer.city !== undefined ? customer.city : "";
      } else {
        console.error("Detalhes do cliente indefinidos ou vazios.");
        alert(
          "Detalhes do cliente indefinidos ou vazios. Tente novamente mais tarde."
        );
      }
    } else {
      // Exibe uma mensagem de erro se a busca falhar
      console.error("Erro ao obter detalhes do cliente:", response.statusText);
      alert(
        "Erro ao obter detalhes do cliente. Por favor, tente novamente mais tarde."
      );
    }
  } catch (error) {
    console.error("Erro ao obter detalhes do cliente:", error);
    alert(
      "Erro ao obter detalhes do cliente. Por favor, tente novamente mais tarde."
    );
  }
}

// Aguarda o carregamento completo da página antes de executar algumas ações
document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID do cliente da URL
  const customerId = getParameterByName("id");

  // Se existir um ID de cliente na URL, carrega os detalhes desse cliente
  if (customerId) {
    setTimeout(() => {
      loadCustomerDetails(customerId);
    }, 100);
  }
});

// Função para obter o parâmetro de consulta da URL
function getParameterByName(name, url) {
  // Se a URL não for fornecida, utiliza a URL atual da janela
  if (!url) url = window.location.href;

  // Escapa caracteres especiais na string do nome do parâmetro
  name = name.replace(/[\[\]]/g, "\\$&");

  // Cria uma expressão regular para encontrar o parâmetro na URL
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

  // Executa a expressão regular na URL
  var results = regex.exec(url);

  // Se não houver correspondência, retorna null (nenhum parâmetro encontrado)
  if (!results) return null;

  // Se o valor do parâmetro não estiver presente, retorna uma string vazia
  if (!results[2]) return "";

  // Decodifica o valor do parâmetro (tratando caracteres especiais, como %20 para espaços)
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Função para carregar os dados na tabela da página HTML
function loadTableCustomers(customers) {
  try {
    let html = "";

    // Itera sobre os clientes e cria as linhas da tabela
    for (let c in customers) {
      html += `<tr data-id="${customers[c].id}">`;
      html += `<td> ${customers[c].id} </td>`;
      html += `<td> ${customers[c].name} </td>`;
      html += `<td> ${customers[c].email} </td>`;
      html += `<td> ${customers[c].city} </td>`;
      html += `<td>
                <a href="#" class="primary-color detalhar-link" data-id="${customers[c].id}"> Detalhar </a> |  
                <a href="#" class="primary-color excluir-link" data-id="${customers[c].id}"> Excluir </a>
             </td>`;
      html += `</tr>`;
    }

    // Obtém o elemento tbody da tabela
    const tbodyCustomersElement = document.getElementById("tbody_customers");

    // Atualiza o conteúdo do elemento tbody
    if (tbodyCustomersElement) {
      tbodyCustomersElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// Função para redirecionar para a página de detalhes
function redirectToDetails(customerId) {
  // Redireciona para a página de detalhes com o ID do cliente
  window.location.href = `cadastro_customers.html?id=${customerId}`;
}

// Adiciona um ouvinte de evento para cliques na página de detalhes cliente
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link de "detalhar" com a classe "detalhar-link"
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const customerId = event.target.getAttribute("data-id");
    redirectToDetails(customerId);
  }
});

// Função assíncrona para criar ou atualizar um cliente
async function createCustomer(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os valores dos campos do formulário
    const id = document.getElementById("txt_id").value;
    const name = document.getElementById("txt_name").value;
    const email = document.getElementById("txt_email").value;
    const city = document.getElementById("txt_city").value;

    // Determina o método com base no valor de id
    const method = id ? "PATCH" : "POST";

    // Constrói o objeto de dados a ser enviado no corpo da requisição
    const data = {
      name: name,
      email: email,
      city: city,
    };

    // Se for uma atualização (PATCH), adiciona o id ao objeto de dados
    if (id) {
      data.id = id;
    }

    // Faz a requisição para a API
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
      console.error("Erro ao criar/atualizar cliente:", response.statusText);
      alert(
        "Erro ao criar/atualizar cliente. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Se chegou até aqui, a criação/atualização foi bem-sucedida
    console.log("Cliente criado/atualizado com sucesso!");
    alert("Cliente criado/atualizado com sucesso!");

    // Limpa os campos do formulário
    document.getElementById("txt_id").value = "";
    document.getElementById("txt_name").value = "";
    document.getElementById("txt_email").value = "";
    document.getElementById("txt_city").value = "";

    // Recarrega a lista de clientes
    loadCustomers();
  } catch (error) {
    console.error("Erro ao criar/atualizar cliente:", error);
    alert(
      "Erro ao criar/atualizar cliente. Por favor, tente novamente mais tarde."
    );
  }
}

// Função assíncrona para excluir um cliente
async function deleteCustomer(customerId) {
  try {
    // Confirmação do usuário antes de excluir
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmDelete) {
      return;
    }

    // Faz a requisição DELETE para a API de clientes com o ID específico
    const response = await fetch(`${endpoint}${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a exclusão foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao excluir cliente:", response.statusText);
      alert("Erro ao excluir cliente. Por favor, tente novamente mais tarde.");
      return;
    }

    // Se chegou até aqui, a exclusão foi bem-sucedida
    console.log("Cliente excluído com sucesso!");
    alert("Cliente excluído com sucesso!");

    // Recarrega a lista de clientes após a exclusão
    loadCustomers();

    // Remove o ouvinte de eventos do link de "excluir"
    document.removeEventListener("click", deleteLinkClickHandler);

    // Adiciona novamente o ouvinte de evento para cliques na página
    document.addEventListener("click", deleteLinkClickHandler);
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    alert("Erro ao excluir cliente. Por favor, tente novamente mais tarde.");
  }
}

// Função para lidar com cliques no link de "excluir"
function deleteLinkClickHandler(event) {
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const customerId = event.target.getAttribute("data-id");
    deleteCustomer(customerId); // Chama a função para excluir o cliente
  }
}

// Adiciona um ouvinte de evento para cliques na página
document.addEventListener("click", deleteLinkClickHandler);

// Função para exibir mensagens de erro
function exibirErro(message) {
  // Exibe uma mensagem de erro ao usuário, por exemplo, usando um alert
  alert(`Erro: ${message}`);
}
//! Resumo das functions
/*
loadCustomers: Essa função faz uma requisição assíncrona (GET) para a API de clientes, verifica se a resposta foi bem-sucedida, converte os dados para JSON e chama a função loadTableCustomers para preencher a tabela na página HTML com os clientes obtidos.

loadCustomerDetails: Essa função busca os detalhes de um cliente específico com base no ID fornecido. Realiza uma requisição assíncrona (GET), verifica o status da resposta, converte os dados para JSON e preenche os campos do formulário na página HTML com os detalhes do cliente.

DOMContentLoaded Event Listener: Este evento é acionado quando o DOM foi completamente carregado. Ele verifica se há um ID de cliente na URL e, se existir, chama a função loadCustomerDetails para carregar os detalhes desse cliente.

getParameterByName: Uma função que extrai parâmetros da URL com base no nome do parâmetro.

loadTableCustomers: Preenche dinamicamente a tabela na página HTML com os dados dos clientes.

redirectToDetails: Redireciona o usuário para a página de detalhes do cliente com base no ID fornecido.

Event Listener para cliques: Adiciona um ouvinte de evento para cliques na página, especificamente nos links de "detalhar", redirecionando para a página de detalhes correspondente.

createCustomer: Função assíncrona que cria ou atualiza um cliente. Obtém os valores do formulário, determina o método (POST ou PATCH), constrói o objeto de dados, faz a requisição para a API e recarrega a lista de clientes após uma criação ou atualização bem-sucedida.
*/
