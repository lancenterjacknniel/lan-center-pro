/* ================= LOGIN ================= */

async function login(){

const res = await fetch("usuarios.txt")
const txt = await res.text()

let u = user.value
let p = pass.value

let ok = false

txt.split("\n").forEach(l=>{

let d = l.split("|")

if(d.length<4) return

let user = d[0].trim()
let passw = d[1].trim()
let rol = d[2].trim()
let activo = d[3].includes("true")

if(u===user && p===passw && activo){
localStorage.setItem("user",user)
localStorage.setItem("rol",rol)
ok=true
}

})

if(ok){
location="panel.html"
}else{
msg.innerText="❌ Error"
}

}

/* ================= PANEL ================= */

if(document.getElementById("menu")){

let user = localStorage.getItem("user")
let rol = localStorage.getItem("rol")

if(!user) location="index.html"

rol.innerText = user + " ("+rol+")"

cargarCategorias(rol)

}

/* ================= CATEGORIAS ================= */

async function cargarCategorias(rol){

const res = await fetch("categorias.txt")
const txt = await res.text()

let lista = []

txt.split("\n").forEach(l=>{

if(!l.includes("|")) return

let d = l.split("|")

let obj = {
nombre:d[0].trim(),
archivo:d[1].trim(),
color:"cyan",
activo:true,
roles:"admin,operador",
icon:"",
orden:0
}

d.forEach(x=>{
x=x.trim()
if(x.includes("color=")) obj.color=x.split("=")[1]
if(x.includes("activo=")) obj.activo=x.includes("true")
if(x.includes("roles=")) obj.roles=x.split("=")[1]
if(x.includes("icon=")) obj.icon=x.split("=")[1]
if(x.includes("orden=")) obj.orden=parseInt(x.split("=")[1])
})

if(!obj.activo) return
if(!obj.roles.includes(rol)) return

lista.push(obj)

})

/* ORDENAR */
lista.sort((a,b)=>a.orden-b.orden)

/* RENDER */
lista.forEach(c=>{

menu.innerHTML += `
<button style="background:${c.color}" onclick="abrirCat('${c.archivo}')">
${c.icon} ${c.nombre}
</button>
`

})

}

/* ================= SUBCATEGORIAS ================= */

async function abrirCat(archivo){

subcats.innerHTML=""
contenido.innerHTML=""

const res = await fetch(archivo)
const txt = await res.text()

let bloques = txt.split("###")

bloques.forEach(b=>{

if(!b.trim()) return

let l = b.trim().split("\n")

let titulo = l[0]
let props = {activo:true}

if(titulo.includes("|")){
let partes = titulo.split("|")
titulo = partes[0].trim()

partes.forEach(p=>{
if(p.includes("=")){
let [k,v]=p.split("=")
props[k.trim()] = v.trim()
}
})
}

if(props.activo==="false") return

subcats.innerHTML += `
<button onclick="verContenido(\`${b}\`)">
${titulo}
</button>
`

})

}

/* ================= TARJETAS ================= */

function verContenido(bloque){

contenido.innerHTML=""

let partes = bloque.split("\n").slice(1).join("\n")
let tarjetas = partes.split("---")

tarjetas.forEach(t=>{

if(!t.trim()) return

let lineas = t.trim().split("\n")

let titulo = lineas[0]
let valor = lineas[1] || ""
let desc = lineas.slice(2).join("<br>")

let html=""

/* DETECTAR TIPO */

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

let destacado = t.includes("destacado=true") ? "destacado" : ""

contenido.innerHTML += `
<div class="card ${destacado}">
<h3>${titulo}</h3>
${html}
<p>${desc}</p>
</div>
`

})

}

/* ================= LOGOUT ================= */

function logout(){
localStorage.clear()
location="index.html"
}
