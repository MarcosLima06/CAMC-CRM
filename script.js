
/* CAMC - Cadastro de clientes */

const formulario = document.getElementById("formCadastro");
const totalClientes = document.getElementById("totalClientes");

// Recupera os clientes salvos no navegador
let clientes = JSON.parse(
    localStorage.getItem("camc_clientes") || "[]"
);


// Guarda o código do cliente que está sendo editado
let clienteEmEdicao = null;


// Atualiza a quantidade de clientes
function atualizarTotal() {
    totalClientes.textContent = clientes.length;
}

// Salva um novo cliente
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    if (!nome || !telefone || !email || !endereco) {
        alert("Preencha todos os campos.");
        return;
    }

    // Gera um identificador único
    const codigo = crypto.randomUUID();

    const novoCliente = {
        codigo: codigo,
        nome: nome,
        telefone: telefone,
        email: email,
        endereco: endereco
    };

    
if (clienteEmEdicao !== null) {
    const cliente = clientes.find(function(item) {
        return item.codigo === clienteEmEdicao;
    });

    if (!cliente) {
        alert("Cliente não encontrado.");
        return;
    }

    cliente.nome = nome;
    cliente.telefone = telefone;
    cliente.email = email;
    cliente.endereco = endereco;

    clienteEmEdicao = null;
} else {
    clientes.push(novoCliente);
}


    localStorage.setItem(
        "camc_clientes",
        JSON.stringify(clientes)
    );

    
    
atualizarTotal();
mostrarClientes();
carregarClientesAtendimento();
carregarClientesTickets();
carregarClientesFeedback();
carregarClientesCompras();
atualizarRelatorios();
formulario.reset();



    alert("Dados salvos com sucesso!");
});

// Mostra os clientes já cadastrados
atualizarTotal();



/* Lista de clientes cadastrados */

const listaClientes = document.getElementById("listaClientes");

function mostrarClientes() {
    listaClientes.innerHTML = "";

    if (clientes.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 4;
        celula.textContent = "Nenhum cliente cadastrado.";

        linha.appendChild(celula);
        listaClientes.appendChild(linha);
        return;
    }

    clientes.forEach(function(cliente) {
        const linha = document.createElement("tr");

        [cliente.nome, cliente.telefone, cliente.email].forEach(
            function(valor) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            }
        );

        
const acoes = document.createElement("td");


// Botão para editar os dados do cliente
const botaoEditar = document.createElement("button");
botaoEditar.textContent = "Editar";
botaoEditar.className = "btn-editar";

botaoEditar.addEventListener("click", function() {
    clienteEmEdicao = cliente.codigo;

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("email").value = cliente.email;
    document.getElementById("endereco").value = cliente.endereco;

    document.getElementById("nome").focus();
    document.getElementById("clientes").scrollIntoView();

    alert("Altere os dados e clique em Salvar Cliente.");
});

acoes.appendChild(botaoEditar);




const botaoExcluir = document.createElement("button");
botaoExcluir.textContent = "Excluir";
botaoExcluir.className = "btn-excluir";

botaoExcluir.addEventListener("click", function() {
    const confirmar = confirm(
        "Deseja realmente excluir este cliente?"
    );

    if (confirmar) {
        clientes = clientes.filter(function(item) {
            return item.codigo !== cliente.codigo;
        });

        localStorage.setItem(
            "camc_clientes",
            JSON.stringify(clientes)
        );

        atualizarTotal();
        mostrarClientes();
        alert("Cliente excluído com sucesso!");
    }
});

acoes.appendChild(botaoExcluir);


        linha.appendChild(acoes);
        listaClientes.appendChild(linha);
    });
}

// Exibe os clientes ao abrir a página
mostrarClientes();



// Cancela a edição ao limpar o formulário
formulario.addEventListener("reset", function() {
    clienteEmEdicao = null;
});



/* RF02 - Seleção de clientes */

const selecionarCliente = document.getElementById(
    "clienteAtendimento"
);

function carregarClientesAtendimento() {
    selecionarCliente.innerHTML =
        '<option value="">Selecione um cliente</option>';

    clientes.forEach(function(cliente) {
        const opcao = document.createElement("option");

        opcao.value = cliente.codigo;
        opcao.textContent = cliente.nome;

        selecionarCliente.appendChild(opcao);
    });
}

// Carrega os clientes ao abrir o sistema
carregarClientesAtendimento();


/* RF02 - Cadastro de atendimentos */

const formularioAtendimento = document.getElementById("formAtendimento");

let atendimentos = JSON.parse(
    localStorage.getItem("camc_atendimentos") || "[]"
);

formularioAtendimento.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const clienteCodigo = document.getElementById("clienteAtendimento").value;
    const data = document.getElementById("dataAtendimento").value;
    const tipo = document.getElementById("tipoAtendimento").value;
    const situacao = document.getElementById("statusAtendimento").value;
    const descricao = document.getElementById("descricaoAtendimento").value.trim();

    if (!clienteCodigo || !data || !tipo || !situacao || !descricao) {
        alert("Preencha todos os campos do atendimento.");
        return;
    }

    const novoAtendimento = {
        codigo: crypto.randomUUID(),
        clienteCodigo: clienteCodigo,
        data: data,
        tipo: tipo,
        situacao: situacao,
        descricao: descricao
    };

    atendimentos.push(novoAtendimento);

    localStorage.setItem(
        "camc_atendimentos",
        JSON.stringify(atendimentos)
    );

    formularioAtendimento.reset();
    mostrarAtendimentos();
    atualizarTotalAtendimentos();
    atualizarRelatorios();

    alert("Atendimento registrado com sucesso!");
});



/* RF02 - Exibir histórico de atendimentos */

const listaAtendimentos = document.getElementById("listaAtendimentos");

function mostrarAtendimentos() {
    listaAtendimentos.innerHTML = "";

    if (atendimentos.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 5;
        celula.textContent = "Nenhum atendimento registrado.";

        linha.appendChild(celula);
        listaAtendimentos.appendChild(linha);
        return;
    }

    atendimentos.forEach(function(atendimento) {
        const linha = document.createElement("tr");

        const cliente = clientes.find(function(item) {
            return item.codigo === atendimento.clienteCodigo;
        });

        const nomeCliente = cliente ? cliente.nome : "Cliente removido";

        const dados = [
            nomeCliente,
            atendimento.data.split("-").reverse().join("/"),
            atendimento.tipo,
            atendimento.situacao,
            atendimento.descricao
        ];

        dados.forEach(function(dado) {
            const celula = document.createElement("td");
            celula.textContent = dado;
            linha.appendChild(celula);
        });

        listaAtendimentos.appendChild(linha);
    });
}

// Mostra os atendimentos ao abrir a página
mostrarAtendimentos();




/* RF02 - Contador de atendimentos */

function atualizarTotalAtendimentos() {
    const contador = document.getElementById("totalAtendimentos");

    contador.textContent = atendimentos.length;
}

// Atualiza o contador ao abrir o sistema
atualizarTotalAtendimentos();





/* RF03 - Carregar clientes no formulário de tickets */

const clienteTicket = document.getElementById("clienteTicket");

function carregarClientesTickets() {
    clienteTicket.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach(function(cliente) {
        const opcao = document.createElement("option");

        opcao.value = cliente.codigo;
        opcao.textContent = cliente.nome;

        clienteTicket.appendChild(opcao);
    });
}

carregarClientesTickets();




/* RF03 - Cadastro e armazenamento de tickets */

let tickets = JSON.parse(
    localStorage.getItem("camc_tickets") || "[]"
);

const formularioTicket = document.getElementById("formTicket");

formularioTicket.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const novoTicket = {
        codigo: crypto.randomUUID(),
        clienteCodigo: document.getElementById("clienteTicket").value,
        titulo: document.getElementById("tituloTicket").value,
        prioridade: document.getElementById("prioridadeTicket").value,
        situacao: document.getElementById("situacaoTicket").value,
        descricao: document.getElementById("descricaoTicket").value
    };

    tickets.push(novoTicket);

    localStorage.setItem(
        "camc_tickets",
        JSON.stringify(tickets)
    );

    formularioTicket.reset();

    mostrarTickets();
    atualizarTotalTickets();
    atualizarRelatorios();

    alert("Ticket aberto com sucesso!");
});





/* RF03 - Exibir tickets cadastrados */

function mostrarTickets() {
    const listaTickets = document.getElementById("listaTickets");

    listaTickets.innerHTML = "";

    tickets.forEach(function(ticket) {
        const cliente = clientes.find(function(c) {
            return c.codigo === ticket.clienteCodigo;
        });

        const linha = document.createElement("tr");

        const dados = [
            cliente ? cliente.nome : "Cliente não encontrado",
            ticket.titulo,
            ticket.prioridade,
            ticket.situacao,
            ticket.descricao
        ];

        dados.forEach(function(dado) {
            const coluna = document.createElement("td");
            coluna.textContent = dado;
            linha.appendChild(coluna);
        });



/* RF03 - Botão para atualizar ticket */

const colunaAcoes = document.createElement("td");

const botaoAtualizar = document.createElement("button");

botaoAtualizar.textContent = "Atualizar";
botaoAtualizar.className = "btn-salvar";
botaoAtualizar.type = "button";

botaoAtualizar.addEventListener("click", function() {
    const situacoes = ["Aberto", "Em andamento", "Resolvido"];

    const indiceAtual = situacoes.indexOf(ticket.situacao);

    if (indiceAtual === -1) {
        alert("Situação do ticket inválida.");
        return;
    }

    const novaSituacao = situacoes[(indiceAtual + 1) % situacoes.length];

    ticket.situacao = novaSituacao;

    localStorage.setItem(
        "camc_tickets",
        JSON.stringify(tickets)
    );

    mostrarTickets();
    atualizarTotalTickets();
});

colunaAcoes.appendChild(botaoAtualizar);
linha.appendChild(colunaAcoes);


        listaTickets.appendChild(linha);
    });
}

mostrarTickets();



/* RF04 - Canais de Comunicação */

const botoesCanais = document.querySelectorAll(
    ".lista-canais button"
);

botoesCanais.forEach(function(botao) {
    botao.addEventListener("click", function() {
        const canal = botao.dataset.canal;

        
const campoCanal = document.getElementById("canalContato");

if (canal === "whatsapp") {
    campoCanal.value = "WhatsApp";
} else if (canal === "email") {
    campoCanal.value = "E-mail";
} else if (canal === "telefone") {
    campoCanal.value = "Telefone";
}

campoCanal.focus();

    });
});



/* RF04 - Salvamento dos Contatos */

const formContato = document.getElementById("formContato");

let contatos = JSON.parse(
    localStorage.getItem("camc_contatos") || "[]"
);

formContato.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nomeContato").value.trim();
    const canal = document.getElementById("canalContato").value;
    const descricao = document.getElementById("descricaoContato").value.trim();

    if (!nome || !canal || !descricao) {
        alert("Preencha todos os campos!");
        return;
    }

    const novoContato = {
        id: Date.now(),
        nome: nome,
        canal: canal,
        descricao: descricao,
        data: new Date().toLocaleString("pt-BR")
    };

    contatos.push(novoContato);

    localStorage.setItem(
        "camc_contatos",
        JSON.stringify(contatos)
    );

    alert("Contato registrado com sucesso!");

    formContato.reset();

    mostrarContatos();

});





/* RF03 - Contador de tickets abertos */

function atualizarTotalTickets() {
    const contador = document.getElementById("totalTickets");

    const ticketsAbertos = tickets.filter(function(ticket) {
        return ticket.situacao === "Aberto";
    });

    contador.textContent = ticketsAbertos.length;
}

atualizarTotalTickets();




/* RF04 - Exibir Histórico de Contatos */

function mostrarContatos() {
    const lista = document.getElementById("listaContatos");

    lista.innerHTML = "";

    
const pesquisa = document.getElementById("pesquisarContato")
    .value.toLowerCase().trim();


const canalSelecionado = document.getElementById("filtrarCanal").value;

const contatosFiltrados = contatos.filter(function(contato) {
    const correspondeNome = contato.nome.toLowerCase().includes(pesquisa);

    const correspondeCanal = canalSelecionado === "" ||
        contato.canal === canalSelecionado;

    return correspondeNome && correspondeCanal;
});


contatosFiltrados.forEach(function(contato) {

        const linha = document.createElement("tr");

        [contato.nome, contato.canal, contato.data, contato.descricao]
            .forEach(function(valor) {
                const coluna = document.createElement("td");
                coluna.textContent = valor;
                linha.appendChild(coluna);
            });

        
/* RF04 - Botão Excluir Contato */

const colunaAcoes = document.createElement("td");
const botaoExcluir = document.createElement("button");

botaoExcluir.textContent = "Excluir";
botaoExcluir.type = "button";
botaoExcluir.className = "btn-excluir";

botaoExcluir.addEventListener("click", function() {
    const confirmar = confirm(
        "Deseja realmente excluir este contato?"
    );

    if (confirmar) {
        contatos = contatos.filter(function(item) {
            return item.id !== contato.id;
        });

        localStorage.setItem(
            "camc_contatos",
            JSON.stringify(contatos)
        );

        mostrarContatos();
    }
});

colunaAcoes.appendChild(botaoExcluir);
linha.appendChild(colunaAcoes);


        lista.appendChild(linha);
    });
}

mostrarContatos();



/* RF04 - Pesquisa Automática de Contatos */

const campoPesquisa = document.getElementById("pesquisarContato");

campoPesquisa.addEventListener("input", function() {
    mostrarContatos();
});



/* RF04 - Filtro Automático por Canal */

const filtroCanal = document.getElementById("filtrarCanal");

filtroCanal.addEventListener("change", function() {
    mostrarContatos();
});



/* RF06 - Carregar Clientes no Feedback */

const clienteFeedback = document.getElementById("clienteFeedback");

function carregarClientesFeedback() {
    clienteFeedback.innerHTML =
        '<option value="">Selecione um cliente</option>';

    clientes.forEach(function(cliente) {
        const opcao = document.createElement("option");

        opcao.value = cliente.codigo;
        opcao.textContent = cliente.nome;

        clienteFeedback.appendChild(opcao);
    });
}

carregarClientesFeedback();



/* RF06 - Registro e armazenamento dos feedbacks */

const formFeedback = document.getElementById("formFeedback");

let feedbacks = JSON.parse(
    localStorage.getItem("camc_feedbacks") || "[]"
);

formFeedback.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const codigoCliente = clienteFeedback.value;
    const nota = document.getElementById("notaFeedback").value;
    const comentario = document.getElementById("comentarioFeedback").value.trim();

    const cliente = clientes.find(function(item) {
        return String(item.codigo) === String(codigoCliente);
    });

    if (!cliente || !nota || !comentario) {
        alert("Preencha todos os campos.");
        return;
    }

    const novoFeedback = {
        codigoCliente: cliente.codigo,
        nome: cliente.nome,
        nota: Number(nota),
        comentario: comentario,
        data: new Date().toLocaleString("pt-BR")
    };

    feedbacks.push(novoFeedback);

    localStorage.setItem(
        "camc_feedbacks",
        JSON.stringify(feedbacks)
    );

    mostrarFeedbacks();

    alert("Feedback registrado com sucesso!");

    formFeedback.reset();
});



/* RF06 - Exibir Histórico de Feedbacks */

function mostrarFeedbacks() {
    const lista = document.getElementById("listaFeedbacks");

    lista.innerHTML = "";

    feedbacks.forEach(function(feedback) {
        const linha = document.createElement("tr");

        [
            feedback.nome,
            feedback.nota,
            feedback.comentario,
            feedback.data
        ].forEach(function(valor) {
            const coluna = document.createElement("td");

            coluna.textContent = valor;
            linha.appendChild(coluna);
        });

        lista.appendChild(linha);
    });
}

mostrarFeedbacks();



/* RF07 - Histórico de Compras */

// Recuperar as compras salvas no navegador
let compras = JSON.parse(localStorage.getItem("camc_compras") || "[]");




/* RF07 - Carregar clientes no formulário de compras */

function carregarClientesCompras() {
    const select = document.getElementById("clienteCompra");

    select.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach(function(cliente) {
        const opcao = document.createElement("option");

        opcao.value = cliente.codigo;
        opcao.textContent = cliente.nome;

        select.appendChild(opcao);
    });
}

carregarClientesCompras();



/* RF07 - Registrar compras */

document.getElementById("formCompras").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const codigoCliente = document.getElementById("clienteCompra").value;
    const produto = document.getElementById("produtoCompra").value;
    const quantidade = Number(document.getElementById("quantidadeCompra").value);
    const valor = Number(document.getElementById("valorCompra").value);

    const cliente = clientes.find(function(item) {
        return String(item.codigo) === String(codigoCliente);
    });

    if (!cliente || !produto || quantidade <= 0 || valor <= 0) {
        alert("Preencha corretamente os dados da compra.");
        return;
    }

    const compra = {
        codigoCliente: cliente.codigo,
        nome: cliente.nome,
        produto: produto,
        quantidade: quantidade,
        valor: valor,
        data: new Date().toLocaleString("pt-BR")
    };

    compras.push(compra);

    localStorage.setItem("camc_compras", JSON.stringify(compras));
    mostrarCompras();
    atualizarRelatorios();

    alert("Compra registrada com sucesso!");

    document.getElementById("formCompras").reset();
});



/* RF07 - Exibir histórico de compras */

function mostrarCompras() {
    const lista = document.getElementById("listaCompras");

    lista.innerHTML = "";

    compras.forEach(function(compra) {
        const linha = document.createElement("tr");

        const dados = [
            compra.nome,
            compra.produto,
            compra.quantidade,
            Number(compra.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
            compra.data
        ];

        dados.forEach(function(valor) {
            const coluna = document.createElement("td");
            coluna.textContent = valor;
            linha.appendChild(coluna);
        });

        lista.appendChild(linha);
    });
}

// Mostrar compras ao abrir o sistema
mostrarCompras();




/* CAMC-CRM - Relatórios do Sistema */

function atualizarRelatorios() {
    const valorTotal = compras.reduce(function(total, compra) {
        return total + Number(compra.valor);
    }, 0);

    document.getElementById("relatorioClientes").textContent =
        clientes.length;

    document.getElementById("relatorioAtendimentos").textContent =
        atendimentos.length;

    document.getElementById("relatorioTickets").textContent =
        tickets.length;

    document.getElementById("relatorioCompras").textContent =
        compras.length;

    document.getElementById("relatorioValor").textContent =
        valorTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}

// Atualizar relatórios ao abrir o sistema
atualizarRelatorios();



/* CAMC-CRM - Imprimir relatório */

document.getElementById("btnImprimirRelatorio")
    .addEventListener("click", function() {
        atualizarRelatorios();
        window.print();
    });
