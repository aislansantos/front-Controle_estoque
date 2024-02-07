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

    // Itera sobre os fornecedores e cria as linhas da tabela
    for (let s in suppliers) {
      html += `<tr data-id="${suppliers[s].id}">`;
      html += `<td> ${suppliers[s].id} </td>`;
      html += `<td> ${suppliers[s].name} </td>`;
      html += `<td> ${suppliers[s].email} </td>`;
      html += `<td>
                <a href=# class="primary-color detalhar-link" data-id="${suppliers[s].id}">Detalhar</a> |
                <a href=# class="primary-color excluir-link" data-id="${suppliers[s].id}">Excluir</a>
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
