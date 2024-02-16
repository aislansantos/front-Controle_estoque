// Adiciona uma Promise para carregar as categorias
export async function loadCategories() {
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
