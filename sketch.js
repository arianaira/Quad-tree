let qTree
function setup()
{
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    qTree = new QuadTree(boundary, 4);

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
            let m = new Point(mouseX+random(-5,5), mouseY+random(-5,5));
            qTree.insert(m);
        }
    }
    background(0);
    qTree.show();
}

