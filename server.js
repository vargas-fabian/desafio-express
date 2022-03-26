const express = require('express');
const fs = require('fs');

// Contenedor

class Contenedor {
    id;
    name;
    constructor(name){
        this.id = 1;
        this.name = `./${name}.txt`
    }
 
    async getAll(){
        try{
            const rawData = await fs.promises.readFile(this.name)
            return JSON.parse(rawData)
 
        } catch(e){
            return []
        }
    }
 
    async save(objeto){
        objeto.id = this.id
        const todosLosObjetos = await this.getAll()
        todosLosObjetos.push(objeto)
        await fs.promises.writeFile(this.name,JSON.stringify(todosLosObjetos),err => {
            if(err) {
                console.log(err)
            }
        })
        this.id++;
    }
    async getById(idToFind){
        const todos = await this.getAll()
        return todos.find(({id}) => id === idToFind)
    }
    async deleteById(idToDelete){
        const todos = await this.getAll()
        const aGuardar = todos.filter(({id}) => id !==idToDelete)
        await fs.promises.writeFile(this.name,JSON.stringify(aGuardar),err => {
            if(err) {
                console.log(err)
            }
        })
    }
    async deleteAll(){
        await fs.promises.writeFile(this.name,JSON.stringify([]),err => {
            if(err) {
                console.log(err)
            }
        }) 
    }
}



const app = express();
const contenedor = new Contenedor("productos")

const server = app.listen(8080, async () => {
    await contenedor.deleteAll()
    await contenedor.save({title: "Escuadra", price: 999, thumbail: "url1"})
    await contenedor.save({title: "Calculadora", price: 888, thumbail: "url2"})
    await contenedor.save({title: "Globo Terraqueo", price: 777, thumbail: "url3"})
    console.log("servidor http en el puerto 8080");
});

app.get('/productos', async (req,res) => {
    const productos = await contenedor.getAll()
    //Los productos disponibles son:
    res.send(productos)
});

app.get('/productosRamdom', async(req,res) => {
    const productos = await contenedor.getAll()
    const numeroreal = Math.random() * productos.length
    const indice = Math.floor(numeroreal);
    res.send(productos[indice])
});