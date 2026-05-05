import http from 'http'
import fs from 'fs'

const PORTA = 3000
const HOST = 'localhost'

// Array que funciona como nosso "Banco de Dados" temporário
let cursos = []

const server = http.createServer((req, res) => {
    // Rota: Página Inicial
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end('<h1>Sistema Acadêmico</h1><a href="/cadastro">Cadastrar Novo Curso</a> | <a href="/cursos">Ver Cursos</a>')
    } 
    
    // Rota: Formulário de Cadastro
    else if (req.url === '/cadastro' && req.method === 'GET') {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(fs.readFileSync('cadastro.html', 'utf-8'))
    } 
    
    // Rota: Processamento do Cadastro (POST)
    else if (req.url === '/cursos' && req.method === 'POST') {
        let corpo = ''
        
        // Coleta os pedaços (chunks) de dados enviados pelo formulário
        req.on('data', chunk => {
            corpo += chunk.toString()
        })

        // Após receber tudo, processa e salva
        req.on('end', () => {
            const params = new URLSearchParams(corpo)
            const novoCurso = {
                curso: params.get('curso'),
                ch: params.get('ch'),
                tipo: params.get('tipo')
            }
            
            cursos.push(novoCurso) // Adiciona ao array[cite: 1]
            
            // Redireciona ou confirma o sucesso
            res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" })
            res.end('<h2>Curso salvo com sucesso!</h2><a href="/cursos">Ver Lista de Cursos</a>')
        })
    } 
    
    // Rota: Listagem de Cursos (GET)[cite: 1]
    else if (req.url === '/cursos' && req.method === 'GET') {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        
        let listaHtml = '<h1>Cursos Cadastrados</h1><table border="1"><tr><th>Nome</th><th>Carga Horária</th><th>Tipo</th></tr>'
        
        // Gera as linhas da tabela dinamicamente[cite: 1]
        cursos.forEach(c => {
            listaHtml += `<tr><td>${c.curso}</td><td>${c.ch}</td><td>${c.tipo}</td></tr>`
        })
        
        listaHtml += '</table><br><a href="/cadastro">Cadastrar Outro</a>'
        res.end(listaHtml)
    } 
    
    // Rota 404
    else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        res.end('<h1>404 - Not Found</h1>')
    }
})

server.listen(PORTA, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORTA}`)
})