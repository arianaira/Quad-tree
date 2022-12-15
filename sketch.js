let qTree
let map
function setup()
{
    createCanvas(600, 600);
    let boundary = new Rectangle(400, 400, 400, 400);
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
    let a;
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        a = map.suggestLocation(m, 'all')
        let out=document.getElementById('output')

        out.innerText=''
        for(let ans of a){
            ans=JSON.stringify(ans)
            out.innerText+=ans.slice(1,ans.length-1)+'\n'

        }
        // out.innerText=JSON.stringify(a)
        console.log(a)
    }
    background(0);
    qTree.show();
}

