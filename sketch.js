let qTree
function setup()
{
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    qTree = new QuadTree(boundary, 8);
    m = new Map(qTree, 8)
    m.buildMap()
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
        for (let i = 0; i < 5; i++)
        {
            let m = new Point(mouseX, mouseY);
            let a = qTree.kNearest(m, 32, 32, 32);
            console.log(a.found)
        }
    }
    background(0);
    qTree.show();
}

