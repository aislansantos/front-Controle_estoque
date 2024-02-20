const endpoint = `http://localhost:3000/sellers/`;
// Função assíncrona para carregar os clientes da API
async function loadSellers() {
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
      console.error("Erro ao carregar vendedores:", response.statusText);
      alert(
        "Erro ao carregar vendedores. Por favor, teste novamente  mais tarde."
      );
      return;
    }

    // Converte a resposta para JSON
    const data = await response.json();

    // Chama a função para carregar os clientes na tabela
    loadTableSellers(data);
  } catch (error) {
    console.error("Erro ao carregar vendedores:", error);
    // Chama a função exibirErro em caso de erro durante a requisição
    exibirErro(
      "Erro ao carregar vendedores. Por favor, tente novamente mais tarde."
    );
  }
}

//Função assíncrona para buscar os detalhes do vendeor da API e preencher o formuário
async function loadSellerDetails(sellerId) {
  try {
    console.log("Buscanto detalhe do vendedor para o ID:", sellerId);

    // Faz uma requisição GET para a API fr vendedores com o ID especifico
    const response = await fetch(`${endpoint}${sellerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica o statos da resposta
    if (response.status === 200) {
      // Converte a resposta para JSON
      const sellerDetails = await response.json();
      console.log("Detalhes do vendedor obtidos com sucesso:", sellerDetails);

      // Verifica se há dados na resposta
      if (sellerDetails.data && sellerDetails.data.length > 0) {
        const seller = sellerDetails.data[0];

        // Atribui valores apenas se os campos existirem e o valor não for undefined
        const idElement = document.getElementById("txt_id");
        const nameElement = document.getElementById("txt_name");
        const emailElement = document.getElementById("txt_email");
        const branchElement = document.getElementById("txt_branch");

        if (idElement)
          idElement.value = seller.id !== undefined ? seller.id : "";
        if (nameElement)
          nameElement.value = seller.name !== undefined ? seller.name : "";
        if (emailElement)
          emailElement.value = seller.email !== undefined ? seller.email : "";
        if (branchElement)
          branchElement.value =
            seller.branch !== undefined ? seller.branch : "";

        // Verifica se há dados na resposta
        if (sellerDetails.data && sellerDetails.data.length > 0) {
          const seller = sellerDetails.data[0];
        }
      } else {
        console.error("Detalher do vendedor indefinidos ou vazios");
        alert(
          "Detalhers do vendedor indefinidos ou vazios. Tente novamente mais taede."
        );
      }
    } else {
      // Exibe uma mensagem de erro se a busca falhar
      console.error(
        "Erro ao obter detalhes do vendedor: ",
        response.statusText
      );
      alert(
        "Erro ao obter detalhe do vendedor. Por favor, tente novamente mais tarde."
      );
    }
  } catch (error) {
    console.error("Erro ao obter detalher do vendedor", error);
    alert(
      "Erro ao obter detalhes do vendedor. Por favor, tente novemente mais tarde."
    );
  }
}

// Aguarda o carregamento completo da página antes de executar algumas ações
document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID do vendedor na URL
  const sellerId = getParameterByName("id");

  // Se existir um ID de vendedor na URL, carrega os detalhes desse vendedor
  if (sellerId) {
    setTimeout(() => {
      loadSellerDetails(sellerId);
    }, 500);
  }
});

// Função para obter parâmetros da consulta na URL
function getParameterByName(name, url) {
  // Se a URL não for fornecida, utiliza a URL atual da janela
  if (!url) url = window.location.href;

  // Escapa caracteres especiais na string do nome do parâmetro
  name = name.replace(/[\[\]]/g, "\\$&");

  // Cria uma expressão regular na URL
  var regex = new RegExp("[?&]" + name + "(=([^&]*))");

  // Executa a expressão regular na URL
  var results = regex.exec(url);

  // Se não houver correspondência, retorna null (nenhum parâmetro encontrado)
  if (!results) return null;

  // Se o valor do parâmetro não estiver presente, retorna uma string vazia
  if (!results[2]) return "";

  // Decodifica o valor do parâmetro (tratando caracteres especiais, como %20 para espaços)
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Função para carregar os dados na tabela da página html
function loadTableSellers(sellers) {
  try {
    let html = "";

    // Itera sobre os vendedores e cria linhas da tabela
    for (let seller of Object.values(sellers)) {
      html += `<tr data-id="${seller.id}">`;
      html += `<td>${seller.id}</td>`;
      html += `<td>${seller.name}</td>`;
      html += `<td>${seller.email}</td>`;
      html += `<td>${seller.branch}</td>`;
      html += `<td>
                    <a href="#" class="primary-color detalhar-link" data-id="${seller.id}"> Detalhar </a> | 
                    <a href="#" class="primary-color excluir-link" data-id="${seller.id}"> Excluir </a> 
                </td>`;
      html += `</tr>`;
    }

    // Obtém o elemento tbody da tabela
    const tbodySellersElement = document.getElementById("tbody_sellers");

    // Atualiza o conteudo do elemento
    if (tbodySellersElement) {
      tbodySellersElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// Função para redirecionar para a página de detalhes
function redirectToDetails(sellerId) {
  // Redireciona oara a pagina de detalhes com o ID do vendedor
  window.location.href = `cadastro_sellers.html?id=${sellerId}`;
}

// Adiciona um ouvinte de evento para cliques na página de detalhes cliente
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link de "detalhar" com a classe "detalhar-link"
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const sellerId = event.target.getAttribute("data-id");
    console.log(sellerId);
    redirectToDetails(sellerId);
  }
});

// Função assíncrona para criar ou atualizar um vendedor
async function createSeller(event) {
  try {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os valores do campo do formulário
    const id = document.getElementById("txt_id").value;
    const name = document.getElementById("txt_name").value;
    const email = document.getElementById("txt_email").value;
    const branch = document.getElementById("txt_branch").value;

    // Determina o método com base no valor de ID
    const method = id ? "PATCH" : "POST";

    // Constrói o objeto de dados a ser enviado no corpo da requisição
    const data = {
      name: name,
      email: email,
      branch: branch,
    };

    // Se for uma atualização (PATCH), adiciona o ID ao objeto de dados
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
      console.error("Erro ao criar/atualizar vendedor:", response.statusText);
      alert(
        "Erro ao criar/atualizar vendedor. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Se chegou até aqui, a criação/atualização foi bem-sucedida

    console.log("Vendedor criado/atualizado com sucesso!");
    alert("Vendedor criado/atualizado com sucesso!");

    // Limpa os campos do formulário
    document.getElementById("txt_id").value = "";
    document.getElementById("txt_name").value = "";
    document.getElementById("txt_email").value = "";
    document.getElementById("txt_branch").value = "";

    // Recarrega a lista de clientes
    loadSellers();
  } catch (error) {
    console.error(error);
  }
}
// Função assícrona para excluir um vendedor
async function deleteSeller(sellerId) {
  try {
    //Confirmação do usuario antes excluir o vendedor
    const conformDelete = confirm(
      "Tem certeza que deseja exluir este vendedor?"
    );

    if (!conformDelete) {
      return;
    }

    // Faz a requisição DELETE para API de vendedor com o ID especifico
    const response = await fetch(`${endpoint}${sellerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se a exclusão foi bem sucedida
    if (!response.ok) {
      console.error("Erro ao excluir o vendedor:", response.statusText);
      alert("Erro ao excluir vendedor, Por favor, tente novamente mais tarde.");
      return;
    }

    // Se chegou até aqui, a exclusão foi bem-sucedida
    console.log("Cliente excluído com sucesso");
    alert("Cliente excluído com sucesso");

    // Recarrega a lista de cliente após a exclusão
    loadSellers();

    // Remove o ouvinte de evento do link de excluir
    document.removeEventListener("click", deleteLinkClickHandler);

    // Adiciona novamente o ouvinte de evento para cliques na pagina
    document.addEventListener("click", deleteLinkClickHandler);
  } catch (error) {
    console.error("Erro ao excluir o vendedor", error);
    alert("Erro ao excluir o vendedor. Por favor, tente novamente mais tarde.");
  }
}

function deleteLinkClickHandler(event) {
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o comportamento padrão de um link
    const sellerId = event.target.getAttribute("data-id");
    deleteSeller(sellerId);
  }
}

// Adiciona um ouvinte de evento para cliques na página
document.addEventListener("click", deleteLinkClickHandler);
