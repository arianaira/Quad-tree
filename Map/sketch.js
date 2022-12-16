let qTree
let map
var place;
function setup()
{
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    qTree = new QuadTree(boundary, 8);
    place = prompt('type one of the following \n restaurant/hospital/shopping center/cinema/hotel/all');
    if (place !== 'all')
    {
        console.log(`nearest ${place}s to you`)
    }
    map = new Map(qTree, 8)
    map.buildMap()
}

function draw()
{
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        let a = map.suggestLocation(m, place)
        let out=document.getElementById('output')
        out.innerText=JSON.stringify(a)
        console.log(a)
    }
    background(0);
    qTree.show();
}

