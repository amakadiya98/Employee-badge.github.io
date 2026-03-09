const params = new URLSearchParams(window.location.search)
const voter = params.get("voter")

function getEmployees(){
return JSON.parse(localStorage.getItem("employees")) || []
}

function saveEmployees(list){
localStorage.setItem("employees",JSON.stringify(list))
}

/* ADD EMPLOYEE */

function addEmployee(){

let name=document.getElementById("empName").value.toLowerCase()

let employees=getEmployees()

if(!employees.includes(name)){
employees.push(name)
saveEmployees(employees)
alert("Employee added")
}else{
alert("Employee already exists")
}

}

/* GENERATE VOTING LINK */

function generateLink(){

let name=document.getElementById("linkName").value

let base=window.location.origin+window.location.pathname.replace("admin.html","index.html")

let link=base+"?voter="+name

document.getElementById("linkResult").innerText=link

}

/* LOAD VOTING PAGE */

function loadVoting(){

let employees=getEmployees()

let html=""

employees.forEach(emp=>{

let disabled= emp===voter ? "disabled" : ""

html+=`

<div class="employee-card">

<h3>${emp} ${emp===voter?"(You)":""}</h3>

Work Quality
<input type="range" min="1" max="5" id="${emp}_work" ${disabled}>

Discipline
<input type="range" min="1" max="5" id="${emp}_discipline" ${disabled}>

Behavior
<input type="range" min="1" max="5" id="${emp}_behavior" ${disabled}>

Contribution
<input type="range" min="1" max="5" id="${emp}_contribution" ${disabled}>

</div>
`
})

if(document.getElementById("employeeVoting"))
document.getElementById("employeeVoting").innerHTML=html

}

/* SUBMIT VOTES */

function submitVotes(){

if(localStorage.getItem("voted_"+voter)){
msg.innerText="You already voted"
return
}

let employees=getEmployees()

let data=JSON.parse(localStorage.getItem("votes")) || {}

employees.forEach(emp=>{

if(emp===voter) return

if(!data[emp]){
data[emp]={work:0,discipline:0,behavior:0,contribution:0,votes:0}
}

data[emp].work+=Number(document.getElementById(emp+"_work").value)
data[emp].discipline+=Number(document.getElementById(emp+"_discipline").value)
data[emp].behavior+=Number(document.getElementById(emp+"_behavior").value)
data[emp].contribution+=Number(document.getElementById(emp+"_contribution").value)

data[emp].votes++

})

localStorage.setItem("votes",JSON.stringify(data))
localStorage.setItem("voted_"+voter,true)

msg.innerText="Votes submitted successfully 🎉"

}

/* DASHBOARD */

function loadDashboard(){

let data=JSON.parse(localStorage.getItem("votes")) || {}

let html=""
let winner=""
let bestScore=0

let leaders={
work:{name:"",score:0},
discipline:{name:"",score:0},
behavior:{name:"",score:0},
contribution:{name:"",score:0}
}

for(let emp in data){

let d=data[emp]

let work=Math.round(d.work/(d.votes*5)*100)
let discipline=Math.round(d.discipline/(d.votes*5)*100)
let behavior=Math.round(d.behavior/(d.votes*5)*100)
let contribution=Math.round(d.contribution/(d.votes*5)*100)

let avg=Math.round((work+discipline+behavior+contribution)/4)

if(avg>bestScore){
bestScore=avg
winner=emp
}

if(work>leaders.work.score) leaders.work={name:emp,score:work}
if(discipline>leaders.discipline.score) leaders.discipline={name:emp,score:discipline}
if(behavior>leaders.behavior.score) leaders.behavior={name:emp,score:behavior}
if(contribution>leaders.contribution.score) leaders.contribution={name:emp,score:contribution}

html+=`

<div class="employee-card">

<h3>${emp}</h3>

Work Quality ${work}%
<div class="progress"><div class="bar" style="width:${work}%"></div></div>

Discipline ${discipline}%
<div class="progress"><div class="bar" style="width:${discipline}%"></div></div>

Behavior ${behavior}%
<div class="progress"><div class="bar" style="width:${behavior}%"></div></div>

Contribution ${contribution}%
<div class="progress"><div class="bar" style="width:${contribution}%"></div></div>

<b>Average ${avg}%</b>

</div>
`
}

if(document.getElementById("employeeCards"))
document.getElementById("employeeCards").innerHTML=html

if(document.getElementById("leaderboard"))
document.getElementById("leaderboard").innerHTML=`

Work Quality Leader: ${leaders.work.name} (${leaders.work.score}%)
<br>
Discipline Leader: ${leaders.discipline.name} (${leaders.discipline.score}%)
<br>
Behavior Leader: ${leaders.behavior.name} (${leaders.behavior.score}%)
<br>
Contribution Leader: ${leaders.contribution.name} (${leaders.contribution.score}%)
`

if(document.getElementById("winner"))
document.getElementById("winner").innerText="🏆 Employee of the Month: "+winner

}

function resetVotes(){

if(confirm("Reset all votes?")){
localStorage.removeItem("votes")
location.reload()
}

}

function exportExcel(){

let data=JSON.parse(localStorage.getItem("votes"))||{}

let csv="Employee,Work,Discipline,Behavior,Contribution,Votes\n"

for(let emp in data){

let d=data[emp]

csv+=`${emp},${d.work},${d.discipline},${d.behavior},${d.contribution},${d.votes}\n`

}

let blob=new Blob([csv],{type:"text/csv"})
let url=URL.createObjectURL(blob)

let a=document.createElement("a")
a.href=url
a.download="employee_votes.csv"
a.click()

}

/* AUTO LOAD */

loadVoting()