# Quad-tree

A quad-tree is a tree data structure in which each internal node has exactly four children. Quad-trees are used to
partition a two-dimensional space by recursively subdividing it into four quadrants or regions.

## Screenshots
<img width="599" alt="Screenshot 2023-01-05 at 09 48 18" src="https://user-images.githubusercontent.com/45508098/210773722-0b8176b1-7e10-4624-b6f3-355f2cc039e5.png">
## Features

- Insert points into the quad-tree
- Query the quad-tree to find all points within a given bounding box
- Rebalance the tree to ensure good performance


## Getting Started

To use the quad-tree in your own project, you can clone this repository:

```bash
  git clone https://github.com/sinaapolo969/Quad-tree.git
```

Then, you can require the module in your JavaScript code:

```bash
const QuadTree = require('quad-tree');
```

## Example

Here is an example of how to use the quad-tree to store a set of 2D points and query them:

```bash
const QuadTree = require('quad-tree');

// Create a new quad-tree with a bounding box that covers the entire canvas
const tree = new QuadTree({
  x: 0,
  y: 0,
  width: 500,
  height: 500
});

// Insert some points into the tree
tree.insert({ x: 100, y: 100 });
tree.insert({ x: 200, y: 200 });
tree.insert({ x: 300, y: 300 });

// Query the tree to find all points within a given bounding box
const points = tree.query({
  x: 50,
  y: 50,
  width: 200,
  height: 200
});

// points will be an array containing the two points [{ x: 100, y: 100 }, { x: 200, y: 200 }]
```

## Module Reference

#### k-nearest

`kNearest(point: Point, k: number, distanceFn?: (a: Point, b: Point) => number)`

Finds the k points in the quad-tree that are closest to the given point.

```bash
// Find the 3 points in the tree that are closest to the point (250, 250)
const nearestPoints = tree.kNearest({ x: 250, y: 250 }, 3);
```

#### Get all items

`QuadTree(bounds: Bounds)`

Creates a new quad-tree with the given bounds.

`bounds`

An object with the following properties:

- `x`: The x-coordinate of the top-left corner of the bounding box
- `y`: The y-coordinate of the top-left corner of the bounding box
- `width`: The width of the bounding box
- `height`: The height of the bounding box

`insert(point: Point)`

Inserts a point into the quad-tree.

`point`

An object with the following properties:

- `x`: The x-coordinate of the point
- `y`: The y-coordinate of the point

`query(bounds: Bounds)`

Queries the quad-tree to find all points within the given bounds.

`rebalance()`

Rebalances the quad-tree for better performance. This should be called after a large number of points have been inserted
into the tree.


