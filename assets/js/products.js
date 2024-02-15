let endpointProdcut = `http://localhost:3000/products/`;
// Função assíncrona para carregar produtos da API
async function loadProducts() {
  try {
    // Faz uma requisição GET para a API
    const response = await fetch(endpointProdcut, {
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

    // chama a função para carregar os clientes na tabela
    loadTableProducts(data);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    alert("Erro ao carregar produtos. Por favor, tente novamente mais tarde.");
  }
}

// Função para carregar os dados na tabela da pagina HTML
function loadTableProducts(products) {
  try {
    let html = "";

    // Verifica se products está definido e não está vazio
    if (!products || products.length === 0) {
      console.error("Nenhum dados de produto disponível.");
      return;
    }

    // Itera sobre os produtos e cria as linhas da tabela
    for (let product in products) {
      html += `<tr data-id="${products[product]}">`;
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

    //atualiza o conteúdo do tbody
    if (tbodyProductsElement) {
      tbodyProductsElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
  }
}
