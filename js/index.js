const params = new URLSearchParams(window.location.search)
const employee = params.get("employee")

if(employee && document.getElementById("employeeTitle")){
employeeTitle.innerText = "Vote for " + employee
}

function submitVote(){

if(localStorage.getItem("voted_"+employee)){
msg.innerText="You already voted"
return
}

let data = JSON.parse(localStorage.getItem("votes")) || {}

if(!data[employee]){
data[employee] = {work:0,discipline:0,behavior:0,contribution:0,votes:0}
}

data[employee].work += Number(work.value)
data[employee].discipline += Number(discipline.value)
data[employee].behavior += Number(behavior.value)
data[employee].contribution += Number(contribution.value)

data[employee].votes++

localStorage.setItem("votes",JSON.stringify(data))

localStorage.setItem("voted_"+employee,true)

msg.innerText="Vote Submitted 🎉"
}

function loadDashboard(){

let data = JSON.parse(localStorage.getItem("votes")) || {}

let cardHTML=""
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

if(work>leaders.work.score){leaders.work={name:emp,score:work}}
if(discipline>leaders.discipline.score){leaders.discipline={name:emp,score:discipline}}
if(behavior>leaders.behavior.score){leaders.behavior={name:emp,score:behavior}}
if(contribution>leaders.contribution.score){leaders.contribution={name:emp,score:contribution}}

cardHTML+=`
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

employeeCards.innerHTML=cardHTML

leaderboard.innerHTML=`
Work Quality Leader: ${leaders.work.name} (${leaders.work.score}%)
<br>
Discipline Leader: ${leaders.discipline.name} (${leaders.discipline.score}%)
<br>
Behavior Leader: ${leaders.behavior.name} (${leaders.behavior.score}%)
<br>
Contribution Leader: ${leaders.contribution.name} (${leaders.contribution.score}%)
`

winner.innerHTML="🏆 Employee of the Month: "+winner
}

function generateLink(){

let name=document.getElementById("empName").value

let link=window.location.origin+window.location.pathname.replace("admin.html","index.html")+"?employee="+name

linkResult.innerText=link
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