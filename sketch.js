let qTree
let map
function setup()
{
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    qTree = new QuadTree(boundary, 8);
    map = new Map(qTree, 8)
    map.buildMap()
    // console.log(qTree)
    // for (let i = 0; i < 500; i++)
    // {
    //     let p = new Point(random(width), random(height));
    //     qTree.insert(p);
    // }
    // background(0);
    // qTree.show();
}

function draw()
{
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        let a = map.suggestLocation(m, 'all')
        let out=document.getElementById('output')
        out.innerText=JSON.stringify(a)
        console.log(a)
    }
    background(0);
    qTree.show();
}

