/* ================= LOGIN ================= */

async function login(){

let u = user.value
let p = pass.value

const res = await fetch("usuarios.txt")
const txt = await res.text()

let ok = false

txt.split("\n").forEach(l=>{

let d = l.split("|")

if(d.length < 4) return

let user = d[0].trim()
let passw = d[1].trim()
let rol = d[2].trim()
let activo = d[3].includes("true")

if(u===user && p===passw && activo){

localStorage.setItem("user", user)
localStorage.setItem("rol", rol)

ok = true

}

})

if(ok){
window.location="panel.html"
}else{
msg.innerText="❌ Datos incorrectos"
}

}

/* ================= PANEL ================= */

if(document.getElementById("menu")){

let user = localStorage.getItem("user")
let rol = localStorage.getItem("rol")

if(!user) location="index.html"

rolTexto = document.getElementById("rol")
rolTexto.innerText = user + " ("+rol+")"

cargarCategorias(rol)

}

/* ================= CATEGORIAS ================= */

async function cargarCategorias(rol){

const res = await fetch("categorias.txt")
const txt = await res.text()

txt.split("\n").forEach(linea=>{

if(!linea.includes("|")) return

let d = linea.split("|")

let nombre = d[0].trim()
let archivo = d[1].trim()

let color="cyan"
let activo=true
let roles="admin,operador"
let icon=""
let orden=0

d.forEach(x=>{

x=x.trim()

if(x.includes("color=")) color=x.split("=")[1]
if(x.includes("activo=")) activo=x.includes("true")
if(x.includes("roles=")) roles=x.split("=")[1]
if(x.includes("icon=")) icon=x.split("=")[1]
if(x.includes("orden=")) orden=parseInt(x.split("=")[1])

})

if(!activo) return
if(!roles.includes(rol)) return

menu.innerHTML += `
<button style="background:${color}" onclick="abrirCat('${archivo}')">
${icon} ${nombre}
</button>
`

})

}

/* ================= SUBCATEGORIAS ================= */

async function abrirCat(archivo){

subcategorias.innerHTML=""
contenido.innerHTML=""

const res = await fetch(archivo)
const txt = await res.text()

let bloques = txt.split("###")

bloques.forEach(b=>{

if(!b.trim()) return

let l = b.trim().split("\n")

let titulo = l[0]
let props = {}

if(titulo.includes("|")){
let partes = titulo.split("|")
titulo = partes[0].trim()

partes.forEach(p=>{
if(p.includes("=")){
let [k,v]=p.split("=")
props[k.trim()]=v.trim()
}
})
}

if(props.activo==="false") return

subcategorias.innerHTML += `
<button onclick="verContenido(\`${b}\`)">
${titulo}
</button>
`

})

}

/* ================= CONTENIDO ================= */

function verContenido(bloque){

contenido.innerHTML=""

let partes = bloque.split("\n").slice(1).join("\n")

let tarjetas = partes.split("---")

tarjetas.forEach(t=>{

if(!t.trim()) return

let lineas = t.trim().split("\n")

let titulo = lineas[0]
let valor = lineas[1] || ""
let resto = lineas.slice(2).join("<br>")

let html=""

if(valor.match(/\.(png|jpg|jpeg|webp)/i)){
html = `<img src="${valor}" width="150">`
}
else if(valor.includes("youtube") || valor.includes("youtu.be")){
let id = valor.split("v=")[1] || valor.split("/").pop()
html = `<iframe src="https://www.youtube.com/embed/${id}" width="300"></iframe>`
}
else{
html = `<p>${valor}</p>`
}

contenido.innerHTML += `
<div class="card">
<h3>${titulo}</h3>
${html}
<p>${resto}</p>
</div>
`

})

}

/* ================= LOGOUT ================= */

function logout(){
localStorage.clear()
location="index.html"
}
