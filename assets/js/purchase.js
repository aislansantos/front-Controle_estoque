// Endpoints para consulta
const pedidoBaseUrl = "http://localhost:3000/purchases";

// Função assíncrona para carregar listagem de compras
async function loadPurchase() {
  try {
    // Faz uma requisição  GET para a API
    const response = await fetch(pedidoBaseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro ao carregar pedidos de compra", response.statusText);
      alert(
        "Erro ao carregar pedidos de compra. Por favor, tente novamente mais tarde."
      );
      return;
    }
    // Converte a resposta para JSON
    const data = await response.json();
    // Chama a função para carregar os pedidos de compra na tabela HTML
    loadTablesPurchase(data);
  } catch (error) {
    console.error(error);
  }
}

// Função para carregar os dados na tabela da pagina html
function loadTablesPurchase(purchases) {
  try {
    let html = "";
    // Verifica se purchases está definido e não está vazio
    if (!purchases || purchases.length === 0) {
      console.error("Nenhum dado de pedido disponível.");
      return;
    }
    // Itera sobre os pedidos de compra e cria as linhas da tabela HTML
    for (let purchase of Object.values(purchases)) {
      html += `<tr data-id="${purchase.id}">`;
      html += `<td>${purchase.id}</td>`;
      html += `<td>${purchase.order_number}</td>`;
      html += `<td>${formatDate(purchase.order_date)}</td>`;
      html += `<td>${formatDate(purchase.release_date)}</td>`;
      html += `<td>${formatDate(purchase.expiration_date)}</td>`;
      html += `<td>${purchase.supplier}</td>`;
      html += `<td>${formatCurrency(purchase.total_purchase)}</td>`;
      html += `<td>
      <a href="#" class="primary-color detalhar-link btn btn-sm btn-outline-primary" data-id="${purchase.id}">Detalhar</a>
      <a href="#" class="primary-color excluir-link btn btn-sm btn-outline-danger" data-id="${purchase.id}">Excluir</a>
                </td>`;
      html += `</tr>`;
    }
    // Obtém o elemento tbody da tabela
    const tbodyPurchaseElement = document.getElementById("tbody_pedido_compra");
    // Atualiza o conteúdo do tbody
    if (tbodyPurchaseElement) {
      tbodyPurchaseElement.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
  }
}

// Adiciona um ouvidor para cliques na página de consulta oara carregar os detalhes ou excluir o pedido de compra
document.addEventListener("click", function (event) {
  // Verifica se o clique foi no link para detalhar o pedido, usando a classe do botão
  if (event.target.classList.contains("detalhar-link")) {
    event.preventDefault(); // Impede o comportamento padrão do link
    const purchaseId = event.target.getAttribute("data-id");
    redirectToDetails(purchaseId);
  }
  if (event.target.classList.contains("excluir-link")) {
    event.preventDefault(); // Impede o comporamento padrão do link
    const purchaseId = event.getAttribute("data-id");
    deletePurchase(purchaseId);
  }
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

// Função para formatar a data de ISO para shortForm
function formatDate(value) {
  // Converte o formato iso em date com o valor do parametro
  const dataObjeto = new Date(value);
  // Captura o dia do objeto na variavel
  let d = dataObjeto.getUTCDate();
  // Captura o mês do objeto na variavel, acresce 1 por que os meses começam pelo 0
  let m = dataObjeto.getUTCMonth() + 1;
  // Captura o ano do objeto na variavel
  const y = dataObjeto.getFullYear();
  // Convertemos para string para comparar o tamanho e padronizar com duas strings se as datas só estiverem com 1.

  
  if (d.toString().length < 2) {
    d = "0" + d;
  }
  if (m.toString().length < 2) {
    m = "0" + m;
  }
  return `${d}/${m}/${y}`;
}

// Função que converte e formata o valor recebido como moeda(R$)
function formatCurrency(value) {
  atual = Number(value);
  const f = atual.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  return f;
}
