import http from 'http'
import fs from 'fs'
import queryString from 'querystring'
import { URLSearchParams } from 'url'

const PORTA = 3000
const HOST = 'localhost'
let cursos = [ ]


const server = http.createServer((req, res) => {
    // const {url, method} = req //    const url = req.url    const method = req.method
    console.log(req.url, ' - ', req.method)// conferir a requisição - URL e Método
    if(req.url === '/' && req.method === 'GET'){
        res.writeHead(200, {"content-type": 'text/html; charset=utf-8'})
        // res.write()
        res.end('<h1> Página Inicial </h1>')
    }else if(req.url === '/cadastro' && req.method === 'GET'){
         res.writeHead(200, {"content-type": 'text/html; charset=utf-8'})   
        res.end(fs.readFileSync('cadastro.html', 'utf-8'))
    } else if(req.url === '/cursos' && req.method === 'POST'){
        res.writeHead(200, {"content-type": 'text/html; charset=utf-8'})
      
        let dados = ''
        req.on('data', chunk => {
            dados += chunk.toString()
        })
        req.on('end', () => {
            const dados_req = queryString.parse(dados) 
            const dados_req1 = new URLSearchParams(dados)
            cursos.push(dados_req)
            res.end(JSON.stringify(dados_req) + '<br><br>' + JSON.stringify(Object.fromEntries(dados_req1)))
        })
        

    }
     else if(req.url === '/cursos' && req.method === 'GET'){
        res.writeHead(200, {"content-type": 'application/json; charset=utf-8'})
        res.end(` 
            <h1> Cursos Cadastrados </h1>
            <h3> ${cursos.map((curso) => 
                `<p>Curso: ${curso.curso}</p><p>
                Carga Horária: ${curso.ch}</p><p>
                Tipo: ${curso.tipo}</p>`).join('')} </h3>
            
            `)
    }
    else{
        res.writeHead(404, {"content-type": 'text/html; charset=utf-8'})
        res.end('<h1> Página não localizada! </h1>')
    }


    

})

server.listen(PORTA, HOST,  () => {
    console.log(`Servidor rodando: http://${HOST}:${PORTA}`)
})