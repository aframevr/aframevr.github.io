function generateElements(){for(var t=1;t<=totalRotations;t++){var e=360/totalRotations*t,o=document.createElement("a-entity");o.setAttribute("rotation",{x:0,y:0,z:e});for(var r=1;r<=totalSteps;r++){var a=r/totalSteps,n=r/totalSteps,l=document.createElement("a-entity");l.setAttribute("class","circleElementContainer"+r),l.setAttribute("position",{x:0,y:a,z:0});var i=document.createElement("a-entity");i.setAttribute("class","circleElement"+r),i.setAttribute("scale",{x:n,y:n,z:n}),i.setAttribute("material",{color:getRandomColor(),metalness:0,roughness:0}),i.setAttribute("geometry",{primitive:"sphere",radius:1.5}),i.setAttribute("animation__yoyo",{property:"scale",dir:"alternate",dur:1e4*n,easing:"easeInOutSine",loop:!0,to:"0 0 0"}),l.appendChild(i),o.appendChild(l)}objectContainer.appendChild(o)}}function alterEveryOtherPath(){for(var t,e=0;e<=totalSteps;e++)for(var o=document.getElementsByClassName("circleElement"+e),r=getRandomNumber(21,-10),a=getRandomNumber(21,-10),n=getRandomNumber(6,5),l=0;l<o.length;l++)t=l%2==0?[[0,0,0],[r,a,r],[a,r,a]]:[[0,0,0],[a,r,a],[r,a,r]],o[l].setAttribute("alongpath",{path:t.map(function(t){return t.join(",")}).join(", "),closed:!0,dur:1e3*n,loop:!0})}function getRandomNumber(t,e){return Math.floor(Math.random()*t+e)}function getRandomColor(){for(var t="0123456789abcdef",e="",o=0;o<6;o++)e+=t[Math.floor(16*Math.random())];return"#"+e}function getRandomShape(){var t=["sphere","octahedron","icosahedron","torus","tetrahedron"];return t[Math.floor(Math.random()*t.length)]}var scene=document.querySelector("a-scene"),sky=document.querySelector("a-sky"),objectContainer=document.querySelector("#object-container"),totalSteps=getRandomNumber(17,10),totalRotations=getRandomNumber(17,10);sky.setAttribute("color",getRandomColor()),sky.setAttribute("animation__color",{property:"color",dir:"alternate",dur:2e3,easing:"easeInOutSine",loop:!0,to:getRandomColor()}),generateElements(),alterEveryOtherPath();