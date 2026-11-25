'use strict';
function calculate(){
 const v=id=>Number(document.getElementById(id).value), shock=v('shock')/100,growth=v('growth')/100,yieldRate=v('yield')/100,wait=v('wait')/12;
 if(![shock,growth,yieldRate,wait].every(Number.isFinite)||shock<-.95||shock>.5||growth<-.5||growth>.5||yieldRate<0||yieldRate>.2||![2,3].includes(wait)){document.getElementById('results').textContent='Enter values within the stated input limits.';return;}
 let immediate=100,stocks=0,cash=100,rows=[];
 for(let year=1;year<=10;year++){
  let r=year===1?shock:growth; immediate*=1+r;stocks*=1+r;cash*=1+yieldRate;
  if(year>wait&&year<=wait+3){let buy=cash/(wait+4-year);cash-=buy;stocks+=buy;}
  if([1,3,5,10].includes(year))rows.push([year,immediate,stocks+cash]);
 }
 let max=Math.max(...rows.flatMap(x=>[x[1],x[2]]));
 document.getElementById('results').innerHTML='<h3>Illustrative index values</h3><p>Higher is not necessarily better after tax or risk; staging misses gains if the market rises during the wait.</p><table><thead><tr><th>Year</th><th>Immediate stocks</th><th>Staged</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1].toFixed(1)+'<div class="bar"><span style="width:'+(100*r[1]/max)+'%"></span></div></td><td>'+r[2].toFixed(1)+'<div class="bar"><span style="width:'+(100*r[2]/max)+'%"></span></div></td></tr>').join('')+'</tbody></table>';
}
document.getElementById('run').addEventListener('click',calculate);calculate();
