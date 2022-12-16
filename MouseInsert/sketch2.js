let qTree

function setup()
{
    createCanvas(400, 400);
    let boundary = new Rectangle(200, 200, 200, 200);
    qTree = new QuadTree(boundary, 4);
}

function draw()
{
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        qTree.insert(m);
    }
    background(0);
    qTree.show2();
}

