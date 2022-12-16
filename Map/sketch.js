let qTree
let map
var place;
function setup()
{
    createCanvas(600, 600);
    let boundary = new Rectangle(400, 400, 400, 400);
    qTree = new QuadTree(boundary, 8);
    place = prompt('type one of the following \nrestaurant ' +
        '\nhospital\nshopping center\ncinema\nhotel\nall');
    if (place !== 'all')
    {
        console.log(`nearest ${place}s to you`)
    }
    map = new Map(qTree, 8)
    map.buildMap()
}

function draw()
{
    let a;
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        let a = map.suggestLocation(m, place)
        let out=document.getElementById('output')

        out.innerText=''
        for(let ans of a){
            ans=JSON.stringify(ans)
            out.innerText+=ans.slice(1,ans.length-1)+'\n'

        }
        console.log(a)
    }
    background(0);
    qTree.show();
}

