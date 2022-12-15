function setup()
{
    createCanvas(400, 400);

    let boundary = new Rectangle(200, 200, 200, 200);
    let qTree = new QuadTree(boundary);
    console.log(qTree);
}
