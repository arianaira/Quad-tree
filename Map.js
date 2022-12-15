class Map
{
    DEFAULT_CAPACITY = 8;
    constructor(boundray, capacity = this.DEFAULT_CAPACITY)
    {
        this.capacity = capacity;
        this.quadtree = new QuadTree(boundray, this.capacity);
    }

    buildMap()
    {
        const places = ['restaurant', 'hospital', 'shopping center', 'cinema', 'metro station', 'hotel'
        , 'park', 'bus station']
        for (let i = 0; i < 50; i++)
        {
            const random = Math.floor(Math.random() * places.length);
            let x = Math.floor(Math.random() * 50);
            let y = Math.floor(Math.random() * 50);
            let p = new Point(x, y, places[random])
            this.quadtree.insert(p)
        }
    }

    suggestLocation(point, place)
    {
        let points = [];
        points = this.quadtree.kNearest(point, 6, 32, 32);
        if (place === 'all')
        {
            return points;
        }
        let res = [];
        for (let i = 0; i < points.length; i++)
        {
            if (points[i] === place)
            {
                res.push(points[i]);
            }
        }

        return res;
    }



}