

const tables = document.querySelectorAll(".grow-wrap")

const botao = document.querySelector("#addButton");
const saveButton = document.querySelector("#saveButton");

const prin = document.querySelector("main");
let tabelas = []

fetch('/load')
   .then(res=>{
      return res.json()
   })
   .then(res=>{
      res.forEach(assunto=>{
         addAssunto(assunto);
      })
   })
   .catch(res=>{
      console.log("failed to load")
   });

(()=>{
   console.log("oi")
})();


saveButton.addEventListener("click",(e)=>{
   fetch("/save",{
      method:'POST',
      headers:{
         'Accept':'application/json',
         'Content-Type':'application/json'
      },
      body:JSON.stringify(tabelas)
   }).then(res=>{
      return res.json();
   }).then(res=>{
      Array.from(document.querySelectorAll(".changed")).forEach(elemento=>{
         elemento.classList.remove("changed")
      })
   })
})

function addAssunto(tableContent){
   tabelas.push(tableContent)
   prin.insertBefore(createAssunto(tableContent),botao);
}

botao.addEventListener("click",(e)=>{
   addAssunto(createTableContent(tabelas.length))  
})

function createTableContent(id){
   return {
      id,
      title:"Título",
      titles:['título','título','título'],
      descricoes:['|','|','|'],
      codes:['|','|','|']
   }
}



function createAssunto(assunto) {
   // Criar o elemento principal div com a classe "assunto"
   const divAssunto = document.createElement('div');
   divAssunto.className = 'assunto';

   // Criar o h1 e adicioná-lo na div
   const h1 = document.createElement('h1');
   h1.textContent = assunto.title;
   h1.setAttribute("contenteditable","true");
   h1.setAttribute("spellcheck","false");
   h1.addEventListener("input",e=>{
      e.target.classList.add("changed")
   })
   h1.addEventListener("blur", e=>{
      const thisinput = e.target;
      tabelas[assunto.id]["title"] = thisinput.textContent;
      console.log(tabelas);

   })
   divAssunto.appendChild(h1);

   // Criar a tabela com borda
   const table = document.createElement('table');
   table.setAttribute('border', '1');

   // Criar o thead e a linha de cabeçalho
   const thead = document.createElement('thead');
   const headerRow = document.createElement('tr');

   const headers = ['Javascript', 'Python', 'Java'];
   headers.forEach(headerText => {
       const th = document.createElement('th');
       th.textContent = headerText;
       headerRow.appendChild(th);
   });

   thead.appendChild(headerRow);
   table.appendChild(thead);

   // Criar o tbody
   const tbody = document.createElement('tbody');

   // Linhas de dados
   const rows = [
       [
           { className: 'title', content:  assunto.titles[0],language:0,type:"titles"},
           { className: 'title', content: assunto.titles[1],language:1,type:"titles"},
           { className: 'title', content: assunto.titles[2],language:2,type:"titles"}
       ],
       [
           { className: 'text', content:  assunto.descricoes[0],language:0,type:"descricoes"},
           { className: 'text', content:assunto.descricoes[1],language:1,type:"descricoes"},
           { className: 'text', content:assunto.descricoes[2],language:2,type:"descricoes"}
       ],
       [
           { className: 'code', content: assunto.codes[0],language:0,type:"codes"},
           { className: 'code', content:assunto.codes[1],language:1,type:"codes"},
           { className: 'code', content:assunto.codes[2],language:2,type:"codes"}
       ]
   ];

   rows.forEach(rowData => {
       const row = document.createElement('tr');
       rowData.forEach(cellData => {
           const td = document.createElement('td');
           td.className = cellData.className;
           td.style.cssText= "position:relative";

           const growButton = document.createElement("button")
           growButton.textContent = "+";
           growButton.classList.add("growButton");
           growButton.style.cssText = "position:absolute;right:0px;top:0px;height:18px;width:18px";
           growButton.addEventListener("click", e=>{
            if(e.target.nextSibling.classList.contains('hidden')){
               e.target.nextSibling.classList.remove('hidden');
               e.target.textContent = "-";
            }else{
               e.target.nextSibling.classList.add('hidden');
               e.target.textContent = "+";
            }
           })
           td.appendChild(growButton);

           const divGrowWrap = document.createElement('div');
           divGrowWrap.className = 'grow-wrap';
           divGrowWrap.classList.add("hidden");
           divGrowWrap.setAttribute("data-language", cellData.language);
           divGrowWrap.setAttribute("data-type", cellData.type);
           divGrowWrap.textContent = cellData.content;


           td.appendChild(divGrowWrap);
           row.appendChild(td);
       });
       tbody.appendChild(row);
   });
   table.appendChild(tbody)
   divAssunto.appendChild(table);
   // Retornar a estrutura criada

   const celulas = divAssunto.querySelectorAll(".grow-wrap")
    
   celulas.forEach((celula)=>{
      celula.addEventListener("click",(e)=>{
         const cel = e.target;
         if(cel.tagName=="BUTTON"){
            return
         }
         console.log(cel.tagName)

         const input = document.createElement("textArea")
         // input.setAttribute("type", "text")
         input.setAttribute("spellcheck", "false")
         // input.style.width = cel.offsetWidth - (cel.clientLeft * 2) +  "px";
         // input.style.height= cel.offsetHeight - (cel.clientTop*2) + "px";
         // input.style.border = "0px";
         // input.style.fontFamily= "inherit";
         // input.style.fontSize = "inherit";
         // input.style.outline= "0px";
         input.value = cel.textContent;
         cel.classList.add("active")
         cel.dataset.replicatedValue = input.value;
         cel.innerHTML = ""
         input.addEventListener("blur",(e)=>{
            const thisinput = e.target;
            cel.innerHTML = thisinput.value || "|";
            cel.classList.remove("active");
            console.log(e.target)
            tabelas[assunto.id][cel.dataset.type][cel.dataset.language] = thisinput.value || "|";
            thisinput.remove();
            celula.dataset.replicatedValue =  " "
         })
         input.addEventListener("input",(e)=>{
            const thisinput = e.target;
            thisinput.parentNode.dataset.replicatedValue = thisinput.value;
            celula.parentElement.classList.add("changed")
         })
         cel.append(input)
         input.focus();
      })
   })
   return divAssunto;
}

tables.forEach((celula)=>{
   celula.addEventListener("click",(e)=>{
      const cel = e.target;
      const input = document.createElement("textArea")
      // input.setAttribute("type", "text")
      input.setAttribute("spellcheck", "false")
      // input.style.width = cel.offsetWidth - (cel.clientLeft * 2) +  "px";
      // input.style.height= cel.offsetHeight - (cel.clientTop*2) + "px";
      // input.style.border = "0px";
      // input.style.fontFamily= "inherit";
      // input.style.fontSize = "inherit";
      // input.style.outline= "0px";
      input.value = cel.textContent;
      cel.classList.add("active")
      cel.dataset.replicatedValue = input.value;
      cel.innerHTML = ""
      input.addEventListener("blur",(e)=>{
         const thisinput = e.target;
         cel.innerHTML = thisinput.value;
         cel.classList.remove("active");
         console.log("her")
         thisinput.remove();
         celula.dataset.replicatedValue =  " "
      })
      input.addEventListener("input",(e)=>{
         const thisinput = e.target;
         thisinput.parentNode.dataset.replicatedValue = thisinput.value;
      })
      cel.append(input)
      input.focus();
   })
})